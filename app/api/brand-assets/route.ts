import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionBrandAssets } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      assetType: searchParams.get("type") || undefined,
      colorVariant: searchParams.get("colorVariant") || undefined,
      sizeVariant: searchParams.get("sizeVariant") || undefined,
      useCase: searchParams.get("useCase") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    const assets = await getGreenMissionBrandAssets(options)

    return NextResponse.json({
      success: true,
      count: assets.length,
      assets,
    })
  } catch (error) {
    console.error("Error fetching Green Mission brand assets:", error)
    return NextResponse.json({ error: "Failed to fetch brand assets" }, { status: 500 })
  }
}
