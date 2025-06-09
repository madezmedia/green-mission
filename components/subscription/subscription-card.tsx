"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSubscription } from "@/lib/hooks/use-subscription"
import { Calendar, CreditCard, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

export default function SubscriptionCard() {
  const {
    subscription,
    loading,
    error,
    isActive,
    isPastDue,
    willCancelAtPeriodEnd,
    currentPeriodEnd,
    cancelSubscription,
    createPortalSession,
  } = useSubscription()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load subscription details</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You don't have an active subscription. Upgrade to access premium features.
          </p>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = () => {
    if (isPastDue) {
      return <Badge variant="destructive">Past Due</Badge>
    }
    if (willCancelAtPeriodEnd) {
      return <Badge variant="secondary">Canceling</Badge>
    }
    if (isActive) {
      return <Badge variant="default">Active</Badge>
    }
    return <Badge variant="outline">{subscription.status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{subscription.productName}</h3>
          <p className="text-muted-foreground">
            ${(subscription.amount / 100).toFixed(2)} / {subscription.interval}
          </p>
        </div>

        {currentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {willCancelAtPeriodEnd ? "Cancels on" : "Renews on"} {format(currentPeriodEnd, "PPP")}
            </span>
          </div>
        )}

        {willCancelAtPeriodEnd && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Your subscription will cancel at the end of the current billing period. You'll continue to have access
              until {currentPeriodEnd && format(currentPeriodEnd, "PPP")}.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={createPortalSession} className="flex-1">
            Manage Billing
          </Button>

          {isActive && !willCancelAtPeriodEnd && (
            <Button variant="destructive" onClick={() => cancelSubscription(false)} className="flex-1">
              Cancel Subscription
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
