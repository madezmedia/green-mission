"use client"

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"

interface UserProfile {
  user: any
  metadata: any
  airtableMember: any
  stripeCustomer: any
  permissions: any
  lastUpdated: string
}

export function useAuth() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser()
  const { userId, sessionId, getToken } = useClerkAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (!userLoaded || !isSignedIn || !userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/user/profile")
        const data = await response.json()

        if (data.success) {
          setProfile(data.profile)
        } else {
          setError(data.error || "Failed to fetch profile")
        }
      } catch (err) {
        setError("Network error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userLoaded, isSignedIn, userId])

  const refreshProfile = async () => {
    if (!userId) return

    try {
      // Invalidate cache first
      await fetch("/api/cache/invalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "user", targetId: userId }),
      })

      // Refetch profile
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
      }
    } catch (error) {
      console.error("Failed to refresh profile:", error)
    }
  }

  return {
    user,
    profile,
    loading: loading || !userLoaded,
    error,
    isSignedIn,
    userId,
    sessionId,
    getToken,
    refreshProfile,
    // Convenience getters
    membershipTier: profile?.permissions?.membershipTier || "Basic",
    canAccessPremiumContent: profile?.permissions?.canAccessPremiumContent || false,
    canAccessEnterpriseFeatures: profile?.permissions?.canAccessEnterpriseFeatures || false,
    airtableMember: profile?.airtableMember,
    stripeCustomer: profile?.stripeCustomer,
  }
}
