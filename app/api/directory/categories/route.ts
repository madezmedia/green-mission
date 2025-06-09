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
      
      // Fallback to sample categories
      categories = [
        { id: "1", categoryName: "Renewable Energy", memberCount: 15 },
        { id: "2", categoryName: "Sustainable Food", memberCount: 12 },
        { id: "3", categoryName: "Eco-Friendly Products", memberCount: 18 },
        { id: "4", categoryName: "Green Transportation", memberCount: 8 },
        { id: "5", categoryName: "Waste Management", memberCount: 6 },
        { id: "6", categoryName: "Organic Farming", memberCount: 10 },
        { id: "7", categoryName: "Clean Technology", memberCount: 14 },
        { id: "8", categoryName: "Sustainable Fashion", memberCount: 9 },
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
