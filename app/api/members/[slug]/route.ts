import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    let member
    let cached = false

    // Try to use cached member lookup first
    try {
      const { AirtableCacheWrapper } = await import("@/lib/cache/redis-client")
      member = await AirtableCacheWrapper.getMemberBySlug(params.slug)
      cached = true
    } catch (cacheError) {
      console.warn("Cache not available, using direct Airtable call:", cacheError)

      try {
        const { getGreenMissionMemberBusinesses } = await import("@/lib/airtable/green-mission-client")
        const members = await getGreenMissionMemberBusinesses({
          slug: params.slug,
          membershipStatus: "Active",
          directoryVisibility: true,
        })
        member = members[0] || null
      } catch (airtableError) {
        console.warn("Airtable not available, using sample data:", airtableError)

        // Fallback to sample data
        const { sampleMembers } = await import("@/lib/data")
        member = sampleMembers.find((m) => m.name.toLowerCase().replace(/\s+/g, "-") === params.slug) || null
      }
    }

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      member,
      cached,
    })
  } catch (error) {
    console.error("Error fetching member by slug:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}
