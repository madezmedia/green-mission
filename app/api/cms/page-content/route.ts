import { NextRequest, NextResponse } from "next/server"
import { getGreenMissionAirtableConfigs } from "@/lib/airtable/green-mission-client"
import Airtable from "airtable"

export interface PageContent {
  id: string
  pageSlug: string
  pageTitle: string
  metaDescription?: string
  heroTitle?: string
  heroDescription?: string
  published: boolean
  createdTime: string
  lastModifiedTime: string
}

export interface PageSection {
  id: string
  pageId: string[]
  sectionSlug: string
  sectionTitle: string
  sectionContent?: string
  sectionOrder: number
  sectionType: "text" | "list" | "grid" | "cta"
  published: boolean
}

export interface CallToAction {
  id: string
  ctaTitle: string
  ctaDescription?: string
  ctaButtonText: string
  ctaButtonLink: string
  ctaType: "primary" | "secondary" | "outline"
  active: boolean
}

async function getPageContent(slug?: string): Promise<PageContent[]> {
  try {
    const configs = getGreenMissionAirtableConfigs()
    const config = configs.cms

    if (!config.configured) {
      throw new Error("CMS base is not configured")
    }

    const airtable = new Airtable({ apiKey: config.apiKey })
    const base = airtable.base(config.baseId)
    const table = base("Page Content")

    const options: any = {
      filterByFormula: "{Published} = TRUE()",
      sort: [{ field: "Page Title", direction: "asc" }],
    }

    if (slug) {
      options.filterByFormula = `AND({Published} = TRUE(), {Page Slug} = '${slug}')`
      options.maxRecords = 1
    }

    const records = await table.select(options).all()

    return records.map((record: any) => ({
      id: record.id,
      pageSlug: record.get("Page Slug") as string,
      pageTitle: record.get("Page Title") as string,
      metaDescription: record.get("Meta Description") as string,
      heroTitle: record.get("Hero Title") as string,
      heroDescription: record.get("Hero Description") as string,
      published: record.get("Published") as boolean,
      createdTime: record.get("Created Time") as string,
      lastModifiedTime: record.get("Last Modified Time") as string,
    }))
  } catch (error) {
    console.error("Error fetching page content:", error)
    return []
  }
}

async function getPageSections(pageSlug: string): Promise<PageSection[]> {
  try {
    const configs = getGreenMissionAirtableConfigs()
    const config = configs.cms

    if (!config.configured) {
      throw new Error("CMS base is not configured")
    }

    const airtable = new Airtable({ apiKey: config.apiKey })
    const base = airtable.base(config.baseId)
    const table = base("Page Sections")

    const records = await table
      .select({
        filterByFormula: `AND({Published} = TRUE(), {Page Slug} = '${pageSlug}')`,
        sort: [{ field: "Section Order", direction: "asc" }],
      })
      .all()

    return records.map((record: any) => ({
      id: record.id,
      pageId: record.get("Page") as string[],
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

async function getCallToActions(active = true): Promise<CallToAction[]> {
  try {
    const configs = getGreenMissionAirtableConfigs()
    const config = configs.cms

    if (!config.configured) {
      throw new Error("CMS base is not configured")
    }

    const airtable = new Airtable({ apiKey: config.apiKey })
    const base = airtable.base(config.baseId)
    const table = base("Call to Actions")

    const options: any = {
      sort: [{ field: "CTA Title", direction: "asc" }],
    }

    if (active) {
      options.filterByFormula = "{Active} = TRUE()"
    }

    const records = await table.select(options).all()

    return records.map((record: any) => ({
      id: record.id,
      ctaTitle: record.get("CTA Title") as string,
      ctaDescription: record.get("CTA Description") as string,
      ctaButtonText: record.get("CTA Button Text") as string,
      ctaButtonLink: record.get("CTA Button Link") as string,
      ctaType: record.get("CTA Type") as "primary" | "secondary" | "outline",
      active: record.get("Active") as boolean,
    }))
  } catch (error) {
    console.error("Error fetching call to actions:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const includeSections = searchParams.get("sections") === "true"
    const includeCTAs = searchParams.get("ctas") === "true"

    const pageContent = await getPageContent(slug || undefined)

    if (pageContent.length === 0) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      )
    }

    const result: any = {
      success: true,
      data: slug ? pageContent[0] : pageContent,
    }

    // Include sections if requested
    if (includeSections && slug) {
      const sections = await getPageSections(slug)
      result.data.sections = sections
    }

    // Include CTAs if requested
    if (includeCTAs) {
      const ctas = await getCallToActions()
      result.data.callToActions = ctas
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in page content API:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch page content" },
      { status: 500 }
    )
  }
}