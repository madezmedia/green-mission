import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
})

// Stripe configuration for Green Mission
export const stripeConfig = {
  currency: "usd",
  paymentMethods: ["card"],
  mode: "subscription" as const,
  billingAddressCollection: "required" as const,
  customerCreation: "always" as const,
  allowPromotionCodes: true,
  automaticTax: {
    enabled: true,
  },
  customerUpdate: {
    address: "auto" as const,
    name: "auto" as const,
  },
  invoiceCreation: {
    enabled: true,
    invoiceData: {
      description: "Green Mission Membership",
      footer: "Thank you for supporting sustainable business practices!",
      metadata: {
        service: "green-mission-membership",
      },
    },
  },
}

// Product and price configurations
export const membershipProducts = {
  basic: {
    name: "Basic Membership",
    description: "Essential features for sustainable businesses",
    features: ["Directory Listing", "Basic Profile", "Community Access", "Monthly Newsletter"],
    priceMonthly: 2900, // $29.00 in cents
    priceYearly: 29000, // $290.00 in cents (2 months free)
  },
  premium: {
    name: "Premium Membership",
    description: "Advanced features for growing businesses",
    features: ["Featured Listing", "Enhanced Profile", "Priority Support", "Exclusive Content", "Event Access"],
    priceMonthly: 5900, // $59.00 in cents
    priceYearly: 59000, // $590.00 in cents (2 months free)
  },
  enterprise: {
    name: "Enterprise Membership",
    description: "Premium features for established companies",
    features: [
      "Spotlight Features",
      "Custom Branding",
      "Analytics Dashboard",
      "Partnership Opportunities",
      "Dedicated Support",
    ],
    priceMonthly: 9900, // $99.00 in cents
    priceYearly: 99000, // $990.00 in cents (2 months free)
  },
}

// Webhook event types we handle
export const webhookEvents = [
  "customer.created",
  "customer.updated",
  "customer.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "checkout.session.completed",
  "checkout.session.expired",
] as const

export type WebhookEvent = (typeof webhookEvents)[number]

// Helper functions for Stripe operations using Payment Links
export class StripeHelpers {
  // Create a payment link for membership subscription
  static async createPaymentLink({
    priceId,
    metadata = {},
  }: {
    priceId: string
    metadata?: Record<string, string>
  }) {
    return stripe.paymentLinks.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        ...metadata,
        service: "green-mission-membership",
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_creation: "always",
      payment_method_types: ["card"],
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        },
      },
    })
  }

  // Get or create payment links for all membership tiers
  static async getOrCreateMembershipPaymentLinks() {
    const paymentLinks = await stripe.paymentLinks.list({ active: true })
    const existingLinks = new Map(paymentLinks.data.map((link) => [link.line_items?.data[0]?.price?.id, link]))

    const membershipLinks = {}

    for (const [tierKey, tierData] of Object.entries(membershipProducts)) {
      // Create monthly and yearly payment links if they don't exist
      const monthlyPriceId = `price_${tierKey}_monthly` // You'll need actual price IDs
      const yearlyPriceId = `price_${tierKey}_yearly`

      if (!existingLinks.has(monthlyPriceId)) {
        const monthlyLink = await this.createPaymentLink({
          priceId: monthlyPriceId,
          metadata: {
            tier: tierKey,
            billing: "monthly",
          },
        })
        membershipLinks[`${tierKey}_monthly`] = monthlyLink
      } else {
        membershipLinks[`${tierKey}_monthly`] = existingLinks.get(monthlyPriceId)
      }

      if (!existingLinks.has(yearlyPriceId)) {
        const yearlyLink = await this.createPaymentLink({
          priceId: yearlyPriceId,
          metadata: {
            tier: tierKey,
            billing: "yearly",
          },
        })
        membershipLinks[`${tierKey}_yearly`] = yearlyLink
      } else {
        membershipLinks[`${tierKey}_yearly`] = existingLinks.get(yearlyPriceId)
      }
    }

    return membershipLinks
  }

  // Create or update a customer
  static async createOrUpdateCustomer({
    email,
    name,
    metadata = {},
    customerId,
  }: {
    email: string
    name?: string
    metadata?: Record<string, string>
    customerId?: string
  }) {
    const customerData: Stripe.CustomerCreateParams | Stripe.CustomerUpdateParams = {
      email,
      name,
      metadata: {
        ...metadata,
        source: "green-mission",
      },
    }

    if (customerId) {
      return stripe.customers.update(customerId, customerData)
    } else {
      return stripe.customers.create(customerData as Stripe.CustomerCreateParams)
    }
  }

  // Get customer's active subscription
  static async getActiveSubscription(customerId: string) {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
      expand: ["data.items.data.price.product"],
    })

    return subscriptions.data[0] || null
  }

  // Cancel a subscription
  static async cancelSubscription(subscriptionId: string, immediately = false) {
    if (immediately) {
      return stripe.subscriptions.cancel(subscriptionId)
    } else {
      return stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
    }
  }

  // Create a customer portal session
  static async createPortalSession(customerId: string, returnUrl: string) {
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
  }

  // Create embedded pricing table configuration
  static async createPricingTable() {
    // This would be configured in Stripe Dashboard
    // Return the pricing table ID for embedding
    return {
      pricingTableId: process.env.STRIPE_PRICING_TABLE_ID,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    }
  }
}
