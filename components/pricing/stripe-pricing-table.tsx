"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertTriangle } from "lucide-react"

interface StripePricingTableProps {
  className?: string
}

export default function StripePricingTable({ className = "" }: StripePricingTableProps) {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPricingTableConfig() {
      try {
        const response = await fetch("/api/stripe/pricing-table")
        const data = await response.json()

        if (data.success) {
          setConfig(data.config)
        } else {
          setError(data.error || "Failed to load pricing table")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPricingTableConfig()
  }, [])

  useEffect(() => {
    if (config?.pricingTableId && config?.publishableKey) {
      // Load Stripe.js script
      const script = document.createElement("script")
      script.src = "https://js.stripe.com/v3/pricing-table.js"
      script.async = true
      document.head.appendChild(script)

      return () => {
        // Cleanup script when component unmounts
        const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]')
        if (existingScript) {
          document.head.removeChild(existingScript)
        }
      }
    }
  }, [config])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading pricing options...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !config?.pricingTableId) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error || "Pricing table not configured"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Stripe Pricing Table Embed */}
      <stripe-pricing-table
        pricing-table-id={config.pricingTableId}
        publishable-key={config.publishableKey}
        customer-session-client-secret=""
      />

      <style jsx>{`
        stripe-pricing-table {
          width: 100%;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  )
}
