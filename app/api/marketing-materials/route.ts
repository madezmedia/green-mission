import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionMarketingMaterials } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      type: searchParams.get("type") || undefined,
      templateCategory: searchParams.get("category") || undefined,
      targetAudience: searchParams.get("audience") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    const materials = await getGreenMissionMarketingMaterials(options)

    return NextResponse.json({
      success: true,
      count: materials.length,
      materials,
    })
  } catch (error) {
    console.error("Error fetching Green Mission marketing materials:", error)
    return NextResponse.json({ error: "Failed to fetch marketing materials" }, { status: 500 })
  }
}
