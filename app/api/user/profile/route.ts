import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { MemberProfileCache } from "@/lib/cache/redis-client"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get complete cached profile (Clerk + Airtable + Stripe)
    const profile = await MemberProfileCache.getCompleteProfile(userId)
    const permissions = await MemberProfileCache.getMemberPermissions(userId)

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        permissions,
      },
      cached: true,
    })
  } catch (error) {
    console.error("Error fetching cached user profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
