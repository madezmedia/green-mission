import { NextResponse } from "next/server"
import { getGreenMissionConfigurationStatus } from "@/lib/airtable/green-mission-client"

export async function GET() {
  try {
    const status = getGreenMissionConfigurationStatus()
    
    return NextResponse.json({
      success: true,
      data: status,
      message: "Configuration status retrieved successfully"
    })
  } catch (error) {
    console.error("Error checking configuration status:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to check configuration status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}