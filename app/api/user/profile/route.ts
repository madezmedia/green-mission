import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get basic user data from Clerk
    const user = await currentUser()

    // Return simple profile data without complex caching
    const profile = {
      user: {
        id: user?.id,
        emailAddresses: user?.emailAddresses,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
      metadata: {
        publicMetadata: user?.publicMetadata || {},
        privateMetadata: user?.privateMetadata || {},
      },
      airtableMember: null, // Will be populated later if needed
      stripeCustomer: null, // Will be populated later if needed
      permissions: {
        canAccessDirectory: true,
        canAccessPremiumContent: false,
        canAccessEnterpriseFeatures: false,
        canEditProfile: true,
        membershipTier: "Basic",
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      profile,
      cached: false,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch profile",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
