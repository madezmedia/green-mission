import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionMemberBusinesses } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Fetch a specific member by slug
    const members = await getGreenMissionMemberBusinesses({
      slug: params.slug,
      membershipStatus: "Active", // Or remove if slug implies visibility
      directoryVisibility: true, // Or remove if slug implies visibility
      limit: 1,
    })

    if (!members || members.length === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      member: members[0],
    })
  } catch (error) {
    console.error("Error fetching Green Mission member by slug:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}
