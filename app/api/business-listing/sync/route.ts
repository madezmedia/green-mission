import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"

// Helper function to map Airtable data to form format
function mapFromAirtableFormat(record: any) {
  const fields = record.fields
  return {
    id: record.id,
    businessName: fields["Business Name"] || "",
    description: fields["Description"] || "",
    industry: fields["Industry"] || "",
    website: fields["Website"] || "",
    email: fields["Email"] || "",
    phone: fields["Phone"] || "",
    address: fields["Address"] || "",
    city: fields["City"] || "",
    state: fields["State"] || "",
    country: fields["Country"] || "",
    sustainabilityPractices: fields["Sustainability Practices"] || "",
    certifications: fields["Certifications"] || "",
    membershipTier: fields["Membership Tier"] || "Basic",
    directoryVisibility: fields["Directory Visibility"] || false,
    status: fields["Status"] || "Pending",
    lastSynced: new Date().toISOString()
  }
}

// POST - Force sync with Airtable (pull latest data)
export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch latest data from Airtable
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })

    if (records.length === 0) {
      return NextResponse.json({
        success: false,
        error: "not_found",
        message: "No business listing found in Airtable"
      }, { status: 404 })
    }

    // Get the most recent record (in case there are duplicates)
    const latestRecord = records.sort((a, b) => {
      const dateA = new Date(a.fields["Last Updated"] || a.createdTime).getTime()
      const dateB = new Date(b.fields["Last Updated"] || b.createdTime).getTime()
      return dateB - dateA
    })[0]

    const listing = mapFromAirtableFormat(latestRecord)

    return NextResponse.json({
      success: true,
      listing,
      message: "Successfully synced with Airtable",
      syncTime: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error syncing with Airtable:", error)
    return NextResponse.json(
      { 
        error: "Failed to sync with Airtable",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}