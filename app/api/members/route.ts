import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionMemberBusinesses } from "@/lib/airtable/green-mission-client"

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

    const members = await getGreenMissionMemberBusinesses(options)

    return NextResponse.json({
      success: true,
      count: members.length,
      members,
    })
  } catch (error) {
    console.error("Error in Green Mission members API:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
