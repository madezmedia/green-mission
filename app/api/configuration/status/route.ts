import { NextResponse } from "next/server"
import { getGreenMissionConfigurationStatus } from "@/lib/airtable/green-mission-client"

export async function GET() {
  try {
    const status = getGreenMissionConfigurationStatus()

    const overallHealth = status.cms.configured && status.directory.configured && status.branding.configured

    return NextResponse.json({
      health: overallHealth ? "healthy" : "partial",
      bases: status,
      recommendations: {
        cms: !status.cms.configured ? "Configure AIRTABLE_CMS_BASE_ID and AIRTABLE_CMS_API_KEY" : null,
        directory: !status.directory.configured ? "Configure AIRTABLE_DIR_BASE_ID and AIRTABLE_DIR_API_KEY" : null,
        branding: !status.branding.configured ? "Configure AIRTABLE_BRAND_BASE_ID and AIRTABLE_BRAND_API_KEY" : null,
      },
    })
  } catch (error) {
    console.error("Error checking Green Mission configuration status:", error)
    return NextResponse.json(
      {
        health: "unhealthy",
        error: "Failed to check configuration status",
      },
      { status: 500 },
    )
  }
}
