// app/api/webhooks/clerk/organizations/route.ts

import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { handleClerkOrganizationWebhook } from "@/lib/clerk-airtable-sync"

export async function POST(request: NextRequest) {
  // Get the headers
  const headerPayload = request.headers
  const svixId = headerPayload.get("svix-id")
  const svixTimestamp = headerPayload.get("svix-timestamp")
  const svixSignature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    )
  }

  // Get the body
  const payload = await request.text()
  const body = JSON.parse(payload)

  // Create a new Svix instance with your secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_ORGANIZATIONS

  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET_ORGANIZATIONS not found")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  const wh = new Webhook(webhookSecret)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    )
  }

  // Handle the webhook
  try {
    const eventType = evt.type
    const organizationData = evt.data

    console.log(`Received Clerk organization webhook: ${eventType}`)

    await handleClerkOrganizationWebhook(eventType, organizationData)

    return NextResponse.json({
      success: true,
      message: `Processed ${eventType} event`
    })

  } catch (error) {
    console.error("Error processing organization webhook:", error)
    return NextResponse.json(
      { 
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}