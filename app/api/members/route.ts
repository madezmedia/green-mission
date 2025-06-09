import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      membershipStatus: searchParams.get("status") || undefined,
      featuredMember: searchParams.get("featured") === "true" || undefined,
      directorySpotlight: searchParams.get("spotlight") === "true" || undefined,
      industryCategory: searchParams.get("category") || undefined,
      city: searchParams.get("city") || undefined,
      state: searchParams.get("state") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    // Try Airtable first, fallback to sample data if needed
    let members
    let cached = false

    try {
      // Use Airtable directly (cache was causing issues)
      const { getGreenMissionMemberBusinesses } = await import("@/lib/airtable/green-mission-client")
      members = await getGreenMissionMemberBusinesses(options)
      console.log(`✅ Successfully fetched ${members.length} members from Airtable`)
    } catch (airtableError) {
      console.error("Airtable error details:", airtableError)
      console.warn("Airtable not available, using sample data:", airtableError)

      // Fallback to sample data
      const { sampleMembers } = await import("@/lib/data")
      members = sampleMembers
        .filter((m) => {
          if (options.featuredMember && !m.featured) return false
          if (options.city && !m.location.toLowerCase().includes(options.city.toLowerCase())) return false
          return true
        })
        .slice(0, options.limit || 50)
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
