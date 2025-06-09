import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      membershipStatus: searchParams.get("status") || "Active",
      featuredMember: searchParams.get("featured") === "true" || undefined,
      directorySpotlight: searchParams.get("spotlight") === "true" || undefined,
      industryCategory: searchParams.get("category") || undefined,
      city: searchParams.get("city") || undefined,
      state: searchParams.get("state") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    // Try to use cached data first, fallback to direct call
    let members
    let cached = false

    try {
      const { AirtableCacheWrapper } = await import("@/lib/cache/redis-client")
      members = await AirtableCacheWrapper.getMemberBusinesses(options)
      cached = true
    } catch (cacheError) {
      console.warn("Cache not available, using direct Airtable call:", cacheError)

      try {
        const { getGreenMissionMemberBusinesses } = await import("@/lib/airtable/green-mission-client")
        members = await getGreenMissionMemberBusinesses(options)
      } catch (airtableError) {
        console.warn("Airtable not available, using sample data:", airtableError)

        // Fallback to sample data
        const { sampleMembers } = await import("@/lib/data")
        members = sampleMembers
          .filter((m) => {
            if (options.featuredMember && !m.featured) return false
            return true
          })
          .slice(0, options.limit || 10)
      }
    }

    return NextResponse.json({
      success: true,
      count: members.length,
      members,
      cached,
    })
  } catch (error) {
    console.error("Error in members API:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
