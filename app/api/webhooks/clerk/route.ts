import { type NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { CacheInvalidationHandlers } from "@/lib/cache/redis-client"

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!
    const svix_id = request.headers.get("svix-id")!
    const svix_timestamp = request.headers.get("svix-timestamp")!
    const svix_signature = request.headers.get("svix-signature")!

    const body = await request.text()

    const wh = new Webhook(webhookSecret)
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })

    // Handle the event and invalidate relevant cache
    await CacheInvalidationHandlers.handleClerkWebhook(evt.type, evt.data)

    // Handle specific events
    switch (evt.type) {
      case "user.created":
        await handleUserCreated(evt.data)
        break

      case "user.updated":
        await handleUserUpdated(evt.data)
        break

      case "user.deleted":
        await handleUserDeleted(evt.data)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Clerk webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}

async function handleUserCreated(userData: any) {
  console.log("User created:", userData.id)

  // Create Stripe customer if email is available
  if (userData.email_addresses?.[0]?.email_address) {
    try {
      const { StripeHelpers } = await import("@/lib/stripe/stripe-config")

      const customer = await StripeHelpers.createOrUpdateCustomer({
        email: userData.email_addresses[0].email_address,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        metadata: {
          clerkUserId: userData.id,
          source: "green-mission-signup",
        },
      })

      // Update Clerk user with Stripe customer ID
      const { clerkClient } = await import("@clerk/nextjs/server")
      await clerkClient.users.updateUserMetadata(userData.id, {
        publicMetadata: {
          stripeCustomerId: customer.id,
        },
      })
    } catch (error) {
      console.error("Failed to create Stripe customer:", error)
    }
  }
}

async function handleUserUpdated(userData: any) {
  console.log("User updated:", userData.id)

  // Update Stripe customer if needed
  const stripeCustomerId = userData.public_metadata?.stripeCustomerId
  if (stripeCustomerId && userData.email_addresses?.[0]?.email_address) {
    try {
      const { StripeHelpers } = await import("@/lib/stripe/stripe-config")

      await StripeHelpers.createOrUpdateCustomer({
        email: userData.email_addresses[0].email_address,
        name: `${userData.first_name} ${userData.last_name}`.trim(),
        customerId: stripeCustomerId,
        metadata: {
          clerkUserId: userData.id,
          lastUpdated: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error("Failed to update Stripe customer:", error)
    }
  }
}

async function handleUserDeleted(userData: any) {
  console.log("User deleted:", userData.id)

  // Note: We typically don't delete Stripe customers for compliance reasons
  // but we can mark them as inactive or add metadata
}
