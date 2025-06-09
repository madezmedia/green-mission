"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"
import PaymentLinkButton from "./payment-link-button"

interface PricingCardProps {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  paymentLinkUrl: string
  currentTier?: boolean
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  popular = false,
  paymentLinkUrl,
  currentTier = false,
}: PricingCardProps) {
  return (
    <Card className={`relative flex flex-col ${popular ? "border-primary ring-4 ring-primary/10 scale-105" : ""}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-white shadow-lg">
          <Star className="inline w-4 h-4 mr-1" />
          Most Popular
        </div>
      )}

      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold text-primary mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="mb-4">
          <span className="text-5xl font-bold text-primary">${price}</span>
          <span className="text-muted-foreground text-lg">/{period}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature) => (
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
            tier={name}
            billing={period === "month" ? "monthly" : "yearly"}
            price={price}
            popular={popular}
            currentTier={currentTier}
          />
        </div>
      </CardContent>
    </Card>
  )
}
