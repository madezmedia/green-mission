import { NextResponse } from "next/server"
import { getGreenMissionDirectoryCategories } from "@/lib/airtable/green-mission-client"

export async function GET() {
  try {
    let categories
    
    try {
      categories = await getGreenMissionDirectoryCategories(true)
      console.log(`✅ Successfully fetched ${categories.length} categories from Airtable`)
    } catch (airtableError) {
      console.warn("Airtable not available for categories, using sample data:", airtableError)
      
      // Fallback to sample categories that match our sample data
      categories = [
        { id: "energy", categoryName: "Energy & Environment", memberCount: 1 },
        { id: "manufacturing", categoryName: "Manufacturing", memberCount: 1 },
        { id: "food", categoryName: "Food & Beverage", memberCount: 1 },
        { id: "technology", categoryName: "Technology", memberCount: 0 },
        { id: "consulting", categoryName: "Consulting", memberCount: 0 },
        { id: "transportation", categoryName: "Transportation", memberCount: 0 },
      ]
    }

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
