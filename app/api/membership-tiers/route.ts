import { NextResponse } from "next/server"
import { getGreenMissionMembershipTiers } from "@/lib/airtable/green-mission-client"

export async function GET() {
  try {
    const tiers = await getGreenMissionMembershipTiers(true)

    return NextResponse.json({
      success: true,
      count: tiers.length,
      tiers,
    })
  } catch (error) {
    console.error("Error fetching Green Mission membership tiers:", error)
    return NextResponse.json({ error: "Failed to fetch membership tiers" }, { status: 500 })
  }
}
