import { auth, currentUser } from "@clerk/nextjs/server"
import DashboardClient from "./dashboard-client"
import BusinessListingServerWrapper from "./business-listing-server"
import { getDashboardConfig } from "@/lib/config"

// PHASE 2: Import advanced dashboard components for future activation
import DashboardPage from "@/components/dashboard/dashboard-page"

export default async function Dashboard() {
  const { userId } = await auth()
  const user = await currentUser()
  
  // Get dashboard configuration based on feature flags
  const config = getDashboardConfig()

  // Serialize user data for client component
  const userData = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddresses: user?.emailAddresses?.map(email => ({ emailAddress: email.emailAddress })),
  }

  return (
    <div className="space-y-6">
      {/* Welcome message and alerts - always visible */}
      <DashboardClient user={userData} />
      
      {/* PHASE 2: Advanced dashboard with stats and featured members */}
      {!config.isSimplified && config.features.membershipTierDisplay && (
        <div className="space-y-6">
          {/* Complex stats dashboard and featured member sections */}
          <DashboardPage />
        </div>
      )}
      
      {/* Core business listing functionality - always visible */}
      <div className="space-y-4">
        {config.isSimplified && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Your Business Listing
            </h2>
            <p className="text-muted-foreground">
              Manage your business profile and directory visibility.
            </p>
          </div>
        )}
        <BusinessListingServerWrapper />
      </div>
      
      {/* PHASE 2: Network analytics and insights */}
      {!config.isSimplified && config.features.statusManagement && (
        <div className="space-y-6">
          {/* Network analytics section placeholder */}
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Network Analytics
            </h3>
            <p className="text-sm text-muted-foreground/75">
              Advanced analytics and insights coming in Phase 2
            </p>
          </div>
        </div>
      )}
      
      {/* PHASE 2: Advanced user onboarding flows */}
      {!config.isSimplified && config.features.advancedForm && (
        <div className="space-y-6">
          {/* Advanced onboarding section placeholder */}
          <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Advanced Features
            </h3>
            <p className="text-sm text-muted-foreground/75">
              Enhanced onboarding and advanced features coming in Phase 2
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
