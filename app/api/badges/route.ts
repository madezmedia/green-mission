import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionBadgeDesigns } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const membershipTier = searchParams.get("tier") || undefined

    const badges = await getGreenMissionBadgeDesigns(membershipTier)

    return NextResponse.json({
      success: true,
      count: badges.length,
      badges,
    })
  } catch (error) {
    console.error("Error fetching Green Mission badge designs:", error)
    return NextResponse.json({ error: "Failed to fetch badge designs" }, { status: 500 })
  }
}
