import { NextResponse } from "next/server"
import { StripeHelpers } from "@/lib/stripe/stripe-config"

export async function GET() {
  try {
    const paymentLinks = await StripeHelpers.getOrCreateMembershipPaymentLinks()

    return NextResponse.json({
      success: true,
      paymentLinks,
    })
  } catch (error) {
    console.error("Error fetching payment links:", error)
    return NextResponse.json({ error: "Failed to fetch payment links" }, { status: 500 })
  }
}
