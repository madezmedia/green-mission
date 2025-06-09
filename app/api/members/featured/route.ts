import { NextResponse } from "next/server"
import { getGreenMissionMemberBusinesses } from "@/lib/airtable/green-mission-client"

export async function GET() {
  try {
    const featuredMembers = await getGreenMissionMemberBusinesses({
      featuredMember: true,
      membershipStatus: "Active",
      directoryVisibility: true,
      limit: 6,
    })

    return NextResponse.json({
      success: true,
      count: featuredMembers.length,
      members: featuredMembers,
    })
  } catch (error) {
    console.error("Error fetching featured Green Mission members:", error)
    return NextResponse.json({ error: "Failed to fetch featured members" }, { status: 500 })
  }
}
