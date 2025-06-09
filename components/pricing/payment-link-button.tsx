"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState } from "react"

interface PaymentLinkButtonProps {
  paymentLinkUrl: string
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
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)

    try {
      // Open payment link in new tab
      window.open(paymentLinkUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Failed to open payment link:", error)
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => setLoading(false), 1000)
    }
  }

  if (currentTier) {
    return (
      <Button disabled className={`w-full ${className}`} size="lg">
        Current Plan
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      className={`w-full transition-all ${
        popular ? "bg-gradient-primary hover:shadow-lg hover:scale-105" : "hover:bg-primary hover:scale-105"
      } ${className}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening...
        </>
      ) : (
        <>
          Subscribe for ${price}/{billing === "monthly" ? "mo" : "yr"}
          <ExternalLink className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}
