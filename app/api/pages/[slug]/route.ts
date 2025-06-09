import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionWebsitePages } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const pages = await getGreenMissionWebsitePages(params.slug)

    if (pages.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      page: pages[0],
    })
  } catch (error) {
    console.error("Error fetching Green Mission website page:", error)
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}
