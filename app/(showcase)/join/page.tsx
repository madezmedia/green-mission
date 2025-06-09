"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Loader2 } from "lucide-react"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"

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
  icon: React.ReactNode
}

export default function JoinPage() {
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

  const pricingTiers: PricingTier[] = [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for small sustainable businesses getting started",
      features: [
        "Directory Listing",
        "Basic Business Profile",
        "Community Access",
        "Monthly Newsletter",
        "Sustainability Badge"
      ],
      monthlyPrice: 29,
      yearlyPrice: 290,
      popular: false,
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: "premium",
      name: "Premium",
      description: "Ideal for growing businesses ready to expand their reach",
      features: [
        "Featured Directory Listing",
        "Enhanced Business Profile",
        "Priority Support",
        "Exclusive Content Access",
        "Event Invitations",
        "Analytics Dashboard",
        "Social Media Integration"
      ],
      monthlyPrice: 59,
      yearlyPrice: 590,
      popular: true,
      icon: <Star className="h-6 w-6" />
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Comprehensive solution for established sustainable companies",
      features: [
        "Spotlight Features",
        "Custom Branding Options",
        "Advanced Analytics",
        "Partnership Opportunities",
        "Dedicated Account Manager",
        "Custom Integrations",
        "White-label Solutions",
        "API Access"
      ],
      monthlyPrice: 99,
      yearlyPrice: 990,
      popular: false,
      icon: <Crown className="h-6 w-6" />
    }
  ]

  if (loading) {
    return (
      <>
        <ShowcaseNavigation />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading membership plans...</p>
          </div>
        </div>
        <ShowcaseFooter />
      </>
    )
  }

  return (
    <>
      <ShowcaseNavigation />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Join the Green Mission
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect with like-minded sustainable businesses, showcase your eco-friendly practices, 
              and grow your network in the green economy.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Instant access</span>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isYearly ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch 
              checked={isYearly} 
              onCheckedChange={setIsYearly} 
              aria-label="Toggle yearly billing" 
            />
            <span className={`text-sm ${isYearly ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Save 2 months!
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {pricingTiers.map((tier) => {
              const linkKey = `${tier.id}_${isYearly ? "yearly" : "monthly"}`
              const paymentLink = paymentLinks[linkKey]
              const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice
              const period = isYearly ? "year" : "month"

              return (
                <Card 
                  key={tier.id} 
                  className={`relative transition-all duration-200 hover:shadow-lg ${
                    tier.popular 
                      ? "border-green-500 shadow-lg ring-2 ring-green-500/20" 
                      : "border-border hover:border-green-300"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                        {tier.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {tier.description}
                    </CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ${price}
                        </span>
                        <span className="text-muted-foreground">/{period}</span>
                      </div>
                      {isYearly && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${(tier.monthlyPrice * 12) - tier.yearlyPrice} per year
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "bg-primary hover:bg-primary/90"
                      }`}
                      size="lg"
                      onClick={() => {
                        if (paymentLink?.url) {
                          window.location.href = paymentLink.url
                        }
                      }}
                      disabled={!paymentLink?.url}
                    >
                      {paymentLink?.url ? "Get Started" : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens after I pay?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    After payment, you'll be redirected to create your account and set up your business profile. 
                    You'll have immediate access to your dashboard to manage your listing.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I change plans later?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time from your dashboard. 
                    Changes take effect at your next billing cycle.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No setup fees! The price you see is exactly what you pay. 
                    All features are included with your membership tier.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I cancel?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can cancel anytime from your dashboard or contact support. 
                    Your access continues until the end of your billing period.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Need Help Choosing?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Not sure which plan is right for your business? Our team is here to help you 
                  find the perfect fit for your sustainability goals.
                </p>
                <Button variant="outline" size="lg">
                  Schedule a Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ShowcaseFooter />
    </>
  )
}