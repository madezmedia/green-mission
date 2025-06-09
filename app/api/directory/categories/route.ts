import { NextResponse } from "next/server"
import { getGreenMissionDirectoryCategories } from "@/lib/airtable/green-mission-client"

export async function GET() {
  try {
    const categories = await getGreenMissionDirectoryCategories(true)

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    console.error("Error fetching Green Mission directory categories:", error)
    return NextResponse.json({ error: "Failed to fetch directory categories" }, { status: 500 })
  }
}
