import { auth, currentUser } from "@clerk/nextjs/server"
import DashboardClient from "./dashboard-client"
import BusinessListingServerWrapper from "./business-listing-server"

export default async function Dashboard() {
  const { userId } = await auth()
  const user = await currentUser()

  // Serialize user data for client component
  const userData = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddresses: user?.emailAddresses?.map(email => ({ emailAddress: email.emailAddress })),
  }

  return (
    <div className="space-y-6">
      <DashboardClient user={userData} />
      <BusinessListingServerWrapper />
    </div>
  )
}
