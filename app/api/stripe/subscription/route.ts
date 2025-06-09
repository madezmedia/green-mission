import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { StripeHelpers } from "@/lib/stripe/stripe-config"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    // Get active subscription using cached helper
    const subscription = await StripeHelpers.getActiveSubscription(customerId)

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
      })
    }

    // Format subscription data
    const formattedSubscription = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId: subscription.items.data[0]?.price.id,
      productName: subscription.items.data[0]?.price.product?.name,
      amount: subscription.items.data[0]?.price.unit_amount,
      currency: subscription.items.data[0]?.price.currency,
      interval: subscription.items.data[0]?.price.recurring?.interval,
    }

    return NextResponse.json({
      success: true,
      subscription: formattedSubscription,
      cached: true,
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
