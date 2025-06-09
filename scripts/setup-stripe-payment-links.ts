#!/usr/bin/env node

import Stripe from "stripe"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve))

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bright}${colors.green}${msg}${colors.reset}\n`),
}

async function main() {
  try {
    log.header("🔗 Green Mission Stripe Payment Links Setup")

    const apiKey = await question("Enter your Stripe secret key: ")
    if (!apiKey || !apiKey.startsWith("sk_")) {
      log.error("Invalid Stripe secret key format.")
      process.exit(1)
    }

    const stripe = new Stripe(apiKey)

    log.info("Creating products and prices...")

    // Create products and prices for each membership tier
    const membershipTiers = [
      {
        id: "basic",
        name: "Basic Membership",
        description: "Essential features for sustainable businesses",
        monthlyPrice: 2900, // $29.00
        yearlyPrice: 29000, // $290.00 (2 months free)
      },
      {
        id: "premium",
        name: "Premium Membership",
        description: "Advanced features for growing businesses",
        monthlyPrice: 5900, // $59.00
        yearlyPrice: 59000, // $590.00 (2 months free)
      },
      {
        id: "enterprise",
        name: "Enterprise Membership",
        description: "Premium features for established companies",
        monthlyPrice: 9900, // $99.00
        yearlyPrice: 99000, // $990.00 (2 months free)
      },
    ]

    const paymentLinks = {}

    for (const tier of membershipTiers) {
      log.info(`Creating ${tier.name}...`)

      // Create product
      const product = await stripe.products.create({
        name: tier.name,
        description: tier.description,
        metadata: {
          tier: tier.id,
          service: "green-mission-membership",
        },
      })

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.monthlyPrice,
        currency: "usd",
        recurring: {
          interval: "month",
        },
        metadata: {
          tier: tier.id,
          billing: "monthly",
        },
      })

      // Create yearly price
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: tier.yearlyPrice,
        currency: "usd",
        recurring: {
          interval: "year",
        },
        metadata: {
          tier: tier.id,
          billing: "yearly",
        },
      })

      // Create payment links
      const monthlyPaymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: monthlyPrice.id,
            quantity: 1,
          },
        ],
        metadata: {
          tier: tier.id,
          billing: "monthly",
          service: "green-mission-membership",
        },
        allow_promotion_codes: true,
        billing_address_collection: "required",
        customer_creation: "always",
        payment_method_types: ["card"],
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
          },
        },
      })

      const yearlyPaymentLink = await stripe.paymentLinks.create({
        line_items: [
          {
            price: yearlyPrice.id,
            quantity: 1,
          },
        ],
        metadata: {
          tier: tier.id,
          billing: "yearly",
          service: "green-mission-membership",
        },
        allow_promotion_codes: true,
        billing_address_collection: "required",
        customer_creation: "always",
        payment_method_types: ["card"],
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
          },
        },
      })

      paymentLinks[`${tier.id}_monthly`] = {
        url: monthlyPaymentLink.url,
        id: monthlyPaymentLink.id,
        priceId: monthlyPrice.id,
      }

      paymentLinks[`${tier.id}_yearly`] = {
        url: yearlyPaymentLink.url,
        id: yearlyPaymentLink.id,
        priceId: yearlyPrice.id,
      }

      log.success(`Created ${tier.name} payment links`)
    }

    log.header("Payment Links Created Successfully!")

    console.log("\n📋 Payment Links Summary:")
    console.log("=".repeat(50))

    for (const [key, link] of Object.entries(paymentLinks)) {
      console.log(`${key}: ${link.url}`)
    }

    console.log("\n🔧 Environment Variables to Add:")
    console.log("=".repeat(50))
    console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...`)
    console.log(`STRIPE_SECRET_KEY=${apiKey}`)

    // If you want to create a pricing table, you'll need to do this in Stripe Dashboard
    log.info("\n📊 To create an embedded pricing table:")
    log.info("1. Go to Stripe Dashboard > Products > Pricing tables")
    log.info("2. Create a new pricing table with your products")
    log.info("3. Add the pricing table ID to your environment variables")
    log.info("   STRIPE_PRICING_TABLE_ID=prctbl_...")
  } catch (error: any) {
    log.error("Setup failed:", error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Handle script termination
process.on("SIGINT", () => {
  console.log("\n\nSetup cancelled by user.")
  rl.close()
  process.exit(0)
})

// Run the main function
if (require.main === module) {
  main()
}
