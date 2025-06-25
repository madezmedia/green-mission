import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
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
    // Check if this is a recurring price to determine customer creation setting
    const price = await stripe.prices.retrieve(priceId)
    const isRecurring = !!price.recurring
    
    const paymentLinkData: any = {
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
      payment_method_types: ["card"],
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        },
      },
    }
    
    // Only set customer_creation for non-recurring prices
    if (!isRecurring) {
      paymentLinkData.customer_creation = "always"
    }
    
    return stripe.paymentLinks.create(paymentLinkData)
  }

  // Get or create payment links for all membership tiers
  static async getOrCreateMembershipPaymentLinks(): Promise<Record<string, any>> {
    try {
      // Fetch membership plans from CMS API (same as frontend)
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/cms/membership-plans?active=true`)
      const result = await response.json()
      
      if (!result.plans) {
        throw new Error('Failed to fetch membership plans from CMS')
      }
      
      const membershipPlans = result.plans
      const paymentLinks = await stripe.paymentLinks.list({ active: true })
      const existingLinks = new Map(paymentLinks.data.map((link) => [link.line_items?.data[0]?.price?.id, link]))

      const membershipLinks: Record<string, any> = {}

      for (const plan of membershipPlans) {
        const planId = plan.id
        const planName = plan.planName?.toLowerCase().replace(/\s+/g, '_') || 'unknown'
        const monthlyPrice = plan.monthlyPrice
        
        if (!planId || !monthlyPrice || !planName) {
          console.warn(`Skipping plan ${planId} - missing required fields`)
          continue
        }

        // Generate a consistent price ID based on plan ID
        const stripeMonthlyPriceId = `price_${planName}_monthly`

        // Check if the price exists in Stripe, if not create it
        let actualPriceId = stripeMonthlyPriceId
        try {
          await stripe.prices.retrieve(stripeMonthlyPriceId)
        } catch (error: any) {
          if (error?.code === 'resource_missing') {
            // Create the missing price in Stripe
            console.log(`Creating missing Stripe price: ${stripeMonthlyPriceId}`)
            
            // First, create or get the product
            const productName = plan.planName
            const productDescription = plan.planDescription || `${productName} membership`
            
            let product
            try {
              // Try to find existing product
              const products = await stripe.products.list({ limit: 100 })
              product = products.data.find(p => p.name === productName)
              
              if (!product) {
                // Create new product
                product = await stripe.products.create({
                  name: productName,
                  description: productDescription,
                  metadata: {
                    plan_id: planId,
                    plan_name: planName,
                    source: 'green-mission-cms'
                  }
                })
              }
            } catch (productError) {
              console.error(`Error creating product for ${planName}:`, productError)
              continue
            }

            // Create the price
            try {
              const newPrice = await stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(monthlyPrice * 100), // Convert to cents
                currency: 'usd',
                recurring: {
                  interval: 'month'
                },
                metadata: {
                  plan_id: planId,
                  plan_name: planName,
                  source: 'green-mission-cms'
                }
              })
              actualPriceId = newPrice.id
              console.log(`Created Stripe price ${actualPriceId} for ${planName}`)
            } catch (priceError) {
              console.error(`Error creating price for ${planName}:`, priceError)
              continue
            }
          } else {
            console.error(`Error retrieving price ${stripeMonthlyPriceId}:`, error)
            continue
          }
        }

        // Create or get payment link
        if (!existingLinks.has(actualPriceId)) {
          try {
            const paymentLink = await this.createPaymentLink({
              priceId: actualPriceId,
              metadata: {
                plan_id: planId,
                plan_name: planName,
                billing: "monthly"
              },
            })
            membershipLinks[`${planId}_monthly`] = paymentLink
            console.log(`Created payment link for ${planName} with key ${planId}_monthly`)
          } catch (linkError) {
            console.error(`Error creating payment link for ${planName}:`, linkError)
          }
        } else {
          membershipLinks[`${planId}_monthly`] = existingLinks.get(actualPriceId)
        }
      }

      return membershipLinks
    } catch (error) {
      console.error('Error in getOrCreateMembershipPaymentLinks:', error)
      throw error
    }
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
