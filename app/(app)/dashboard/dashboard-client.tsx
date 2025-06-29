"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { Suspense } from "react"

function DashboardAlerts({ user }: { user: any }) {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get("welcome") === "true"
  const isSuccess = searchParams.get("success") === "true"

  return (
    <>
      {isWelcome && (
        <Alert className="border-primary/20 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            Welcome to Green Mission, {user?.firstName}! Your business profile has been submitted for review. You'll
            receive an email confirmation once it's approved.
          </AlertDescription>
        </Alert>
      )}
      {isSuccess && (
        <Alert className="border-green-500/20 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            Payment successful! Welcome to Green Mission, {user?.firstName}! You can now manage your business listing below.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default function DashboardClient({ user }: { user: any }) {
  return (
    <Suspense fallback={null}>
      <DashboardAlerts user={user} />
    </Suspense>
  )
}