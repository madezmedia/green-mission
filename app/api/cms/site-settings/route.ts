import { NextRequest, NextResponse } from "next/server"
import { getGreenMissionAirtableConfigs } from "@/lib/airtable/green-mission-client"
import Airtable from "airtable"

export interface SiteSetting {
  id: string
  settingName: string
  settingKey: string
  settingValue: string
  settingType: "Text" | "Image" | "URL" | "Boolean" | "JSON"
  category: "Branding" | "Navigation" | "Footer" | "SEO" | "Contact" | "Social Media" | "General"
  active: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const settingKey = searchParams.get("key")

    const configs = getGreenMissionAirtableConfigs()
    const config = configs.cms

    if (!config.configured) {
      throw new Error("CMS base is not configured")
    }

    const airtable = new Airtable({ apiKey: config.apiKey })
    const base = airtable.base(config.baseId)
    const table = base("Site Settings")

    let filterFormula = "{Active} = TRUE()"
    
    if (category) {
      filterFormula += ` AND {Category} = '${category}'`
    }
    
    if (settingKey) {
      filterFormula += ` AND {Setting Key} = '${settingKey}'`
    }

    const records = await table
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: "Setting Name", direction: "asc" }],
      })
      .all()

    const settings: SiteSetting[] = records.map((record: any) => ({
      id: record.id,
      settingName: record.get("Setting Name") as string,
      settingKey: record.get("Setting Key") as string,
      settingValue: record.get("Setting Value") as string,
      settingType: record.get("Setting Type") as SiteSetting["settingType"],
      category: record.get("Category") as SiteSetting["category"],
      active: record.get("Active") as boolean,
    }))

    // If requesting a single setting by key, return just the value
    if (settingKey && settings.length > 0) {
      return NextResponse.json({ 
        success: true, 
        data: settings[0].settingValue,
        setting: settings[0]
      })
    }

    // Convert to key-value pairs for easier consumption
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.settingKey] = {
        value: setting.settingValue,
        type: setting.settingType,
        category: setting.category,
        id: setting.id
      }
      return acc
    }, {} as Record<string, any>)

    return NextResponse.json({
      success: true,
      data: settingsMap,
      raw: settings
    })

  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}