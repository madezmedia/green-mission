"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentLinkButtonProps {
  paymentLinkUrl?: string
  tier: string
  billing: "monthly" | "yearly"
  price: number
  popular?: boolean
  currentTier?: boolean
  className?: string
}

export default function PaymentLinkButton({
  paymentLinkUrl,
  tier,
  billing,
  price,
  popular = false,
  currentTier = false,
  className = "",
}: PaymentLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (!paymentLinkUrl) {
      // Show configuration message for preview mode
      alert("This is a preview. Configure Stripe payment links to enable payments.")
      return
    }

    setIsLoading(true)

    // Open payment link in new tab
    window.open(paymentLinkUrl, "_blank", "noopener,noreferrer")

    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 1000)
  }

  if (currentTier) {
    return (
      <Button disabled className={`w-full ${className}`} variant="outline">
        <CreditCard className="w-4 h-4 mr-2" />
        Current Plan
      </Button>
    )
  }

  const isPreview = !paymentLinkUrl || paymentLinkUrl.includes("test_")

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full ${className}`}
        variant={popular ? "default" : "outline"}
        size="lg"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Opening...
          </>
        ) : (
          <>
            <ExternalLink className="w-4 h-4 mr-2" />
            {isPreview ? "Preview" : "Subscribe"} - ${price}/{billing === "yearly" ? "year" : "month"}
          </>
        )}
      </Button>

      {isPreview && (
        <Alert className="text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription>Preview mode - Configure Stripe to enable payments</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
