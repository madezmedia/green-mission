import { type NextRequest, NextResponse } from "next/server"
import { AirtableCacheWrapper } from "@/lib/cache/redis-client"

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

    // Use cached data instead of direct Airtable call
    const members = await AirtableCacheWrapper.getMemberBusinesses(options)

    return NextResponse.json({
      success: true,
      count: members.length,
      members,
      cached: true, // Indicate response came from cache
    })
  } catch (error) {
    console.error("Error in cached Green Mission members API:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
