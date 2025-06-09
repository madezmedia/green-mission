"use client"

import { useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import DashboardPageContent from "@/components/dashboard/dashboard-page"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const { user } = useUser()
  const isWelcome = searchParams.get("welcome") === "true"

  return (
    <div className="space-y-6">
      {isWelcome && (
        <Alert className="border-primary/20 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            Welcome to Green Mission, {user?.firstName}! Your business profile has been submitted for review. You'll
            receive an email confirmation once it's approved.
          </AlertDescription>
        </Alert>
      )}
      <DashboardPageContent />
    </div>
  )
}
