import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import type Stripe from "stripe"
import { CacheInvalidationHandlers } from "@/lib/cache/redis-client"
import { stripe } from "@/lib/stripe/stripe-config"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Handle the event and invalidate relevant cache
    await CacheInvalidationHandlers.handleStripeWebhook(event.type, event.data)

    // Handle specific events
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout completed:", session.id)

  // Update user metadata in Clerk if needed
  if (session.metadata?.userId) {
    const { clerkClient } = await import("@clerk/nextjs/server")

    try {
      await clerkClient.users.updateUserMetadata(session.metadata.userId, {
        publicMetadata: {
          stripeCustomerId: session.customer,
          hasActiveSubscription: true,
        },
      })
    } catch (error) {
      console.error("Failed to update user metadata:", error)
    }
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log("Subscription changed:", subscription.id, subscription.status)

  // Additional logic for subscription changes
  // e.g., update Airtable member status, send notifications, etc.
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Payment succeeded:", invoice.id)

  // Additional logic for successful payments
  // e.g., send confirmation emails, update member benefits, etc.
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Payment failed:", invoice.id)

  // Additional logic for failed payments
  // e.g., send dunning emails, update member status, etc.
}
