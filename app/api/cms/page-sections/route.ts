import { NextRequest, NextResponse } from "next/server"
import { getGreenMissionAirtableConfigs } from "@/lib/airtable/green-mission-client"
import Airtable from "airtable"

export interface PageSection {
  id: string
  pageSlug: string
  sectionSlug: string
  sectionTitle: string
  sectionContent?: string
  sectionOrder: number
  sectionType: "text" | "list" | "grid" | "cta"
  published: boolean
}

async function getPageSections(pageSlug?: string): Promise<PageSection[]> {
  try {
    const configs = getGreenMissionAirtableConfigs()
    const config = configs.cms

    if (!config.configured) {
      throw new Error("CMS base is not configured")
    }

    const airtable = new Airtable({ apiKey: config.apiKey })
    const base = airtable.base(config.baseId)
    const table = base("Page Sections")

    let filterFormula = "{Published} = TRUE()"
    
    if (pageSlug) {
      filterFormula = `AND({Published} = TRUE(), {Page Slug} = '${pageSlug}')`
    }

    const records = await table
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: "Section Order", direction: "asc" }],
      })
      .all()

    return records.map((record: any) => ({
      id: record.id,
      pageSlug: record.get("Page Slug") as string,
      sectionSlug: record.get("Section Slug") as string,
      sectionTitle: record.get("Section Title") as string,
      sectionContent: record.get("Section Content") as string,
      sectionOrder: record.get("Section Order") as number,
      sectionType: record.get("Section Type") as "text" | "list" | "grid" | "cta",
      published: record.get("Published") as boolean,
    }))
  } catch (error) {
    console.error("Error fetching page sections:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageSlug = searchParams.get("page")
    const sectionSlug = searchParams.get("section")

    const sections = await getPageSections(pageSlug || undefined)

    if (sections.length === 0) {
      return NextResponse.json(
        { success: false, error: "No sections found" },
        { status: 404 }
      )
    }

    // Filter by specific section if requested
    let result = sections
    if (sectionSlug) {
      result = sections.filter(section => section.sectionSlug === sectionSlug)
      if (result.length === 0) {
        return NextResponse.json(
          { success: false, error: "Section not found" },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: sectionSlug ? result[0] : result,
    })
  } catch (error) {
    console.error("Error in page sections API:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch page sections" },
      { status: 500 }
    )
  }
}