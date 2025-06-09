"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

interface Subscription {
  id: string
  status: string
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
  priceId: string
  productName: string
  amount: number
  currency: string
  interval: string
}

export function useSubscription() {
  const { stripeCustomer, userId } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscription() {
      if (!stripeCustomer?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/stripe/subscription?customerId=${stripeCustomer.id}`)
        const data = await response.json()

        if (data.success) {
          setSubscription(data.subscription)
        } else {
          setError(data.error || "Failed to fetch subscription")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [stripeCustomer?.id])

  const redirectToPaymentLink = async (paymentLinkUrl: string) => {
    window.open(paymentLinkUrl, "_blank")
  }

  const getPaymentLinks = async () => {
    try {
      const response = await fetch("/api/stripe/payment-links")
      const data = await response.json()

      if (data.success) {
        return data.paymentLinks
      } else {
        throw new Error(data.error || "Failed to fetch payment links")
      }
    } catch (error) {
      console.error("Payment links error:", error)
      throw error
    }
  }

  const cancelSubscription = async (immediately = false) => {
    if (!subscription?.id) return

    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          immediately,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscription(data.subscription)
      } else {
        throw new Error(data.error || "Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Cancel subscription error:", error)
      throw error
    }
  }

  const createPortalSession = async () => {
    if (!stripeCustomer?.id) return

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: stripeCustomer.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || "Failed to create portal session")
      }
    } catch (error) {
      console.error("Portal session error:", error)
      throw error
    }
  }

  return {
    subscription,
    loading,
    error,
    redirectToPaymentLink,
    getPaymentLinks,
    cancelSubscription,
    createPortalSession,
    // Convenience getters
    isActive: subscription?.status === "active",
    isPastDue: subscription?.status === "past_due",
    isCanceled: subscription?.status === "canceled",
    willCancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
    currentPeriodEnd: subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd * 1000) : null,
  }
}
