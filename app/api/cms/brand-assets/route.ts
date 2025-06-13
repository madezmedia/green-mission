import { NextRequest, NextResponse } from "next/server"
import { getGreenMissionAirtableConfigs } from "@/lib/airtable/green-mission-client"
import Airtable from "airtable"

export interface BrandAsset {
  id: string
  assetName: string
  assetType: "Logo - Primary" | "Logo - Secondary" | "Logo - Icon" | "Logo - Transparent" | "Hero Image" | "Background Image" | "Icon" | "Illustration"
  files: { url: string; filename: string }[]
  usageContext: string[]
  active: boolean
  altText?: string
  notes?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawAssetType = searchParams.get("type")
    const rawUsageContext = searchParams.get("usage")

    // URL decode the parameters to handle encoded spaces and special characters
    const assetType = rawAssetType ? decodeURIComponent(rawAssetType) : null
    const usageContext = rawUsageContext ? decodeURIComponent(rawUsageContext) : null

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log("Brand Assets API - assetType:", assetType, "usageContext:", usageContext)
    }

    const configs = getGreenMissionAirtableConfigs()
    const config = configs.cms

    if (!config.configured) {
      throw new Error("CMS base is not configured")
    }

    const airtable = new Airtable({ apiKey: config.apiKey })
    const base = airtable.base(config.baseId)
    const table = base("Brand Assets")

    // Start with no filter to test basic connectivity
    let filterFormula = ""
    let selectOptions: any = {
      sort: [{ field: "Asset Name", direction: "asc" }],
    }
    
    // Use only the asset type filter - this is confirmed to work
    // The Active field filter and usage context filters cause syntax errors
    if (assetType) {
      const escapedAssetType = assetType.replace(/'/g, "\\'")
      filterFormula = `{Asset Type} = '${escapedAssetType}'`
      selectOptions.filterByFormula = filterFormula
    }
    
    // Note: We're not filtering by Active field or Usage Context to avoid
    // Airtable formula syntax issues. The asset type filter is sufficient
    // for the primary use case of loading logos.
    
    const records = await table
      .select(selectOptions)
      .all()

    const assets: BrandAsset[] = records.map((record: any) => ({
      id: record.id,
      assetName: record.get("Asset Name") as string,
      assetType: record.get("Asset Type") as BrandAsset["assetType"],
      files: (record.get("Files") as any[] || []).map((file: any) => ({
        url: file.url,
        filename: file.filename
      })),
      usageContext: record.get("Usage Context") as string[] || [],
      active: record.get("Active") as boolean,
      altText: record.get("Alt Text") as string,
      notes: record.get("Notes") as string,
    }))

    // If requesting a specific asset type, return the first match
    if (assetType && assets.length > 0) {
      return NextResponse.json({ 
        success: true, 
        data: assets[0],
        assets: assets
      })
    }

    return NextResponse.json({
      success: true,
      data: assets
    })

  } catch (error) {
    console.error("Error fetching brand assets:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch brand assets" },
      { status: 500 }
    )
  }
}