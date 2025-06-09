"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentLinkButton from "@/components/pricing/payment-link-button"
import { Check, Star, ExternalLink, CreditCard, Zap, Loader2 } from "lucide-react"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic"

export default function PricingPreviewPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Ensure component only renders on client side
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mock payment links for preview
  const mockPaymentLinks = {
    basic_monthly: "https://buy.stripe.com/test_basic_monthly",
    basic_yearly: "https://buy.stripe.com/test_basic_yearly",
    premium_monthly: "https://buy.stripe.com/test_premium_monthly",
    premium_yearly: "https://buy.stripe.com/test_premium_yearly",
    enterprise_monthly: "https://buy.stripe.com/test_enterprise_monthly",
    enterprise_yearly: "https://buy.stripe.com/test_enterprise_yearly",
  }

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

  // Show loading state during hydration
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading pricing preview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          <Zap className="w-4 h-4 mr-1" />
          Preview Mode
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Stripe Integration Preview</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Compare Payment Links vs Embedded Pricing Table approaches for Green Mission membership subscriptions.
        </p>
      </div>

      <Tabs defaultValue="payment-links" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="payment-links" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Payment Links
          </TabsTrigger>
          <TabsTrigger value="pricing-table" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pricing Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment-links" className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Payment Links Approach</h2>
            <p className="text-muted-foreground mb-6">Individual payment links for each plan that open in new tabs</p>

            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} aria-label="Toggle yearly billing" />
              <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>Yearly</span>
              {isYearly && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Save 2 months!</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => {
              const linkKey = `${tier.id}_${isYearly ? "yearly" : "monthly"}`
              const paymentLinkUrl = mockPaymentLinks[linkKey as keyof typeof mockPaymentLinks]

              return (
                <Card
                  key={tier.id}
                  className={`relative flex flex-col ${
                    tier.popular ? "border-primary ring-4 ring-primary/10 scale-105" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-white shadow-lg">
                      <Star className="inline w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold text-primary mb-2">{tier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-primary">
                        ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground text-lg">/{isYearly ? "year" : "month"}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-sm text-card-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <PaymentLinkButton
                        paymentLinkUrl={paymentLinkUrl}
                        tier={tier.name}
                        billing={isYearly ? "yearly" : "monthly"}
                        price={isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                        popular={tier.popular}
                        currentTier={false}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Payment Links Benefits:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Opens in new tab, keeps users on your site</li>
              <li>• Simple implementation, no complex checkout flow</li>
              <li>• Easy to customize button styling and behavior</li>
              <li>• Works great for mobile and desktop</li>
              <li>• Can be shared directly via email or social media</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="pricing-table" className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Embedded Pricing Table</h2>
            <p className="text-muted-foreground mb-6">Stripe-hosted pricing table embedded directly in your page</p>
          </div>

          {/* Mock Stripe Pricing Table */}
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <CreditCard className="w-4 h-4" />
                    Stripe Embedded Pricing Table
                  </div>
                  <p className="text-muted-foreground">This would be the actual Stripe pricing table component</p>
                </div>

                {/* Mock pricing table layout */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pricingTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={`border rounded-lg p-6 text-center ${
                          tier.popular ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        {tier.popular && (
                          <Badge className="mb-4 bg-primary text-primary-foreground">Most Popular</Badge>
                        )}
                        <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                        <div className="text-3xl font-bold text-primary mb-4">
                          ${tier.monthlyPrice}
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                        <Button className="w-full mb-4" variant={tier.popular ? "default" : "outline"}>
                          Subscribe Now
                        </Button>
                        <ul className="text-sm text-left space-y-2">
                          {tier.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Pricing Table Benefits:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Fully hosted and maintained by Stripe</li>
              <li>• Built-in promotion codes and tax calculation</li>
              <li>• Responsive design that matches your theme</li>
              <li>• Automatic currency conversion</li>
              <li>• A/B testing capabilities through Stripe Dashboard</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Payment Links Setup:</h4>
                <code className="text-xs bg-muted p-2 rounded block">npm run setup-stripe-payment-links</code>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Required Environment Variables:</h4>
                <div className="text-xs bg-muted p-2 rounded space-y-1">
                  <div>STRIPE_SECRET_KEY=sk_test_...</div>
                  <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                  <div>STRIPE_PRICING_TABLE_ID=prctbl_... (for embedded table)</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Recommendation:</h4>
                <p className="text-sm text-muted-foreground">
                  Start with Payment Links for simplicity, then consider the Embedded Pricing Table for advanced
                  features like promotion codes and A/B testing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
