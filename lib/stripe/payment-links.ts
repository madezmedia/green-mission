// Static payment link configurations for development/testing
export const PAYMENT_LINKS = {
  basic_monthly: {
    url: "https://buy.stripe.com/test_basic_monthly",
    priceId: "price_basic_monthly",
  },
  basic_yearly: {
    url: "https://buy.stripe.com/test_basic_yearly",
    priceId: "price_basic_yearly",
  },
  premium_monthly: {
    url: "https://buy.stripe.com/test_premium_monthly",
    priceId: "price_premium_monthly",
  },
  premium_yearly: {
    url: "https://buy.stripe.com/test_premium_yearly",
    priceId: "price_premium_yearly",
  },
  enterprise_monthly: {
    url: "https://buy.stripe.com/test_enterprise_monthly",
    priceId: "price_enterprise_monthly",
  },
  enterprise_yearly: {
    url: "https://buy.stripe.com/test_enterprise_yearly",
    priceId: "price_enterprise_yearly",
  },
}

// Helper to get payment link by tier and billing period
export function getPaymentLink(tier: string, billing: "monthly" | "yearly") {
  const key = `${tier}_${billing}` as keyof typeof PAYMENT_LINKS
  return PAYMENT_LINKS[key]
}
