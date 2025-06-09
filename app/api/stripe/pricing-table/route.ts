import { NextResponse } from "next/server"
import { StripeHelpers } from "@/lib/stripe/stripe-config"

export async function GET() {
  try {
    const pricingTableConfig = await StripeHelpers.createPricingTable()

    return NextResponse.json({
      success: true,
      config: pricingTableConfig,
    })
  } catch (error) {
    console.error("Error fetching pricing table config:", error)
    return NextResponse.json({ error: "Failed to fetch pricing table config" }, { status: 500 })
  }
}
