"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import PricingCard from "@/components/pricing/pricing-card"
import { useAuth } from "@/lib/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface PaymentLinks {
  [key: string]: {
    url: string
    id: string
  }
}

interface PricingTier {
  id: string
  name: string
  description: string
  features: string[]
  monthlyPrice: number
  yearlyPrice: number
  popular?: boolean
}

export default function PricingPage() {
  const { membershipTier } = useAuth()
  const [isYearly, setIsYearly] = useState(false)
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinks>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPaymentLinks() {
      try {
        const response = await fetch("/api/stripe/payment-links")
        const data = await response.json()

        if (data.success) {
          setPaymentLinks(data.paymentLinks)
        }
      } catch (error) {
        console.error("Failed to fetch payment links:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentLinks()
  }, [])

  const pricingTiers = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential features for sustainable businesses",
      features: ["Directory Listing", "Basic Profile", "Community Access", "Monthly Newsletter"],
      monthlyPrice: 29,
      yearlyPrice: 290,
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Advanced features for growing businesses",
      features: ["Featured Listing", "Enhanced Profile", "Priority Support", "Exclusive Content", "Event Access"],
      monthlyPrice: 59,
      yearlyPrice: 590,
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Premium features for established companies",
      features: [
        "Spotlight Features",
        "Custom Branding",
        "Analytics Dashboard",
        "Partnership Opportunities",
        "Dedicated Support",
      ],
      monthlyPrice: 99,
      yearlyPrice: 990,
      popular: false,
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading pricing plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Choose Your Membership Plan</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Join the Green Mission community and connect with like-minded sustainable businesses. Every plan includes
          access to our growing network of eco-conscious partners.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} aria-label="Toggle yearly billing" />
        <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>Yearly</span>
        {isYearly && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Save 2 months!</span>}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {pricingTiers.map((tier) => {
          const linkKey = `${tier.id}_${isYearly ? "yearly" : "monthly"}`
          const paymentLink = paymentLinks[linkKey]

          return (
            <PricingCard
              key={tier.id}
              name={tier.name}
              price={isYearly ? tier.yearlyPrice : tier.monthlyPrice}
              period={isYearly ? "year" : "month"}
              description={tier.description}
              features={tier.features}
              popular={tier.popular}
              paymentLinkUrl={paymentLink?.url || "#"}
              currentTier={membershipTier === tier.name}
            />
          )
        })}
      </div>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Need a Custom Solution?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Looking for enterprise features, custom integrations, or volume discounts? We'd love to work with you to
              create a plan that fits your organization's needs.
            </p>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
