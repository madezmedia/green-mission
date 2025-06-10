import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"

// Helper function to map form data to Airtable format
function mapToAirtableFormat(formData: any, userId: string) {
  // Only include fields that actually exist in the Airtable schema
  const mappedData: any = {
    "Business Name": formData.businessName,
    "Business Description": formData.description,
    "Website": formData.website,
    "Email": formData.email,
    "Phone": formData.phone,
    "Business Address": formData.address,
    "City": formData.city,
    "State": formData.state,
    "Membership Status": formData.status || "Pending",
    "User ID": userId
  }

  // Only add optional fields if they have values
  if (formData.sustainabilityPractices) {
    mappedData["Sustainability Practices"] = formData.sustainabilityPractices
  }
  
  if (formData.certifications) {
    mappedData["Certifications"] = formData.certifications
  }

  // Handle Business Tags - only use predefined options: "Sustainable", "Local", "B-Corp", "Women-Owned"
  // Always include "Sustainable", add "Local" by default for directory listings
  mappedData["Business Tags"] = ["Sustainable", "Local"]

  // Note: Country field doesn't exist in current Airtable schema
  // Store country info in Business Address or skip for now

  return mappedData
}

// Helper function to map Airtable data to form format
function mapFromAirtableFormat(record: any) {
  if (!record || !record.fields) {
    console.error("Invalid record structure:", record)
    throw new Error("Invalid record structure")
  }
  
  const fields = record.fields
  
  // Industry is not stored in Business Tags since they have limited options
  // We'll need to track industry separately or use a different field
  const industry = "" // Default empty for now
  
  return {
    id: record.id,
    businessName: fields["Business Name"] || "",
    description: fields["Business Description"] || "",
    industry: industry,
    website: fields["Website"] || "",
    email: fields["Email"] || "",
    phone: fields["Phone"] || "",
    address: fields["Business Address"] || "",
    city: fields["City"] || "",
    state: fields["State"] || "",
    country: fields["Country"] || "",
    sustainabilityPractices: fields["Sustainability Practices"] || "",
    certifications: fields["Certifications"] || "",
    membershipTier: "Basic", // Default since this field doesn't exist yet
    directoryVisibility: true, // Default to true
    status: fields["Membership Status"] || "Pending",
    lastSynced: fields["Last Updated"] || null
  }
}

// GET - Fetch user's business listing
export async function GET() {
  try {
    const { userId } = await auth()
    console.log("GET /api/business-listing - User ID:", userId)
    
    if (!userId) {
      console.log("No userId found - unauthorized")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Searching for existing listing...")
    // Search for existing listing by User ID
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })
    console.log("Records found:", records.length)

    if (records.length === 0) {
      console.log("No records found for user")
      return NextResponse.json({ 
        success: false, 
        error: "not_found",
        message: "No business listing found" 
      }, { status: 404 })
    }

    console.log("Mapping record to listing format...")
    const listing = mapFromAirtableFormat(records[0])

    return NextResponse.json({
      success: true,
      listing
    })
  } catch (error) {
    console.error("Error fetching business listing:", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { 
        error: "Failed to fetch business listing",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// POST - Create or update business listing (upsert)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.json()
    console.log("POST /api/business-listing - Form data received:", JSON.stringify(formData, null, 2))

    // Check if listing already exists
    const existingRecords = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })

    const airtableData = mapToAirtableFormat(formData, userId)
    console.log("Mapped Airtable data:", JSON.stringify(airtableData, null, 2))

    if (existingRecords.length > 0) {
      // Update existing record
      const recordId = existingRecords[0].id
      if (!recordId) {
        throw new Error("Record ID not found")
      }
      const updatedRecord = await greenMissionClient.updateMember(recordId, airtableData)
      const listing = mapFromAirtableFormat(updatedRecord)

      return NextResponse.json({
        success: true,
        listing,
        message: "Business listing updated successfully"
      })
    } else {
      // Create new record
      const createdRecord = await greenMissionClient.createMember(airtableData)
      const listing = mapFromAirtableFormat(createdRecord)

      return NextResponse.json({
        success: true,
        listing,
        message: "Business listing created successfully"
      })
    }
  } catch (error) {
    console.error("Error saving business listing:", error)
    console.error("Error details:", error instanceof Error ? error.message : error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: "Failed to save business listing",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PUT - Update existing business listing
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.json()

    // Find existing listing
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })

    if (records.length === 0) {
      return NextResponse.json(
        { error: "Business listing not found" },
        { status: 404 }
      )
    }

    const recordId = records[0].id
    if (!recordId) {
      throw new Error("Record ID not found")
    }
    const airtableData = mapToAirtableFormat(formData, userId)
    
    // Update record in Airtable
    const updatedRecord = await greenMissionClient.updateMember(recordId, airtableData)

    const listing = mapFromAirtableFormat(updatedRecord)

    return NextResponse.json({
      success: true,
      listing,
      message: "Business listing updated successfully"
    })
  } catch (error) {
    console.error("Error updating business listing:", error)
    return NextResponse.json(
      { error: "Failed to update business listing" },
      { status: 500 }
    )
  }
}

// DELETE - Remove business listing
export async function DELETE() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find existing listing
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })

    if (records.length === 0) {
      return NextResponse.json(
        { error: "Business listing not found" },
        { status: 404 }
      )
    }

    const recordId = records[0].id
    if (!recordId) {
      throw new Error("Record ID not found")
    }
    
    // Delete record from Airtable
    await greenMissionClient.deleteMember(recordId)

    return NextResponse.json({
      success: true,
      message: "Business listing deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting business listing:", error)
    return NextResponse.json(
      { error: "Failed to delete business listing" },
      { status: 500 }
    )
  }
}