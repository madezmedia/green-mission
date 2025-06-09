"use client"

import type React from "react"

import { useAuth } from "@/lib/hooks/use-auth"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireMembership?: boolean
  redirectTo?: string
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireMembership = false,
  redirectTo = "/sign-in",
}: AuthGuardProps) {
  const { isSignedIn, loading, airtableMember } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isSignedIn) {
        router.push(redirectTo)
        return
      }

      if (requireMembership && isSignedIn && !airtableMember) {
        router.push("/onboarding")
        return
      }
    }
  }, [loading, isSignedIn, airtableMember, requireAuth, requireMembership, redirectTo, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isSignedIn) {
    return null
  }

  if (requireMembership && isSignedIn && !airtableMember) {
    return null
  }

  return <>{children}</>
}
