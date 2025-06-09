import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"

// Helper function to map form data to Airtable format
function mapToAirtableFormat(formData: any, userId: string) {
  return {
    "Business Name": formData.businessName,
    "Description": formData.description,
    "Industry": formData.industry,
    "Website": formData.website,
    "Email": formData.email,
    "Phone": formData.phone,
    "Address": formData.address,
    "City": formData.city,
    "State": formData.state,
    "Country": formData.country,
    "Sustainability Practices": formData.sustainabilityPractices,
    "Certifications": formData.certifications,
    "Membership Tier": formData.membershipTier || "Basic",
    "Directory Visibility": formData.directoryVisibility,
    "Status": formData.status || "Pending",
    "User ID": userId,
    "Last Updated": new Date().toISOString()
  }
}

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
    lastSynced: fields["Last Updated"] || null
  }
}

// GET - Fetch user's business listing
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Search for existing listing by User ID
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })

    if (records.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "not_found",
        message: "No business listing found" 
      }, { status: 404 })
    }

    const listing = mapFromAirtableFormat(records[0])

    return NextResponse.json({
      success: true,
      listing
    })
  } catch (error) {
    console.error("Error fetching business listing:", error)
    return NextResponse.json(
      { error: "Failed to fetch business listing" },
      { status: 500 }
    )
  }
}

// POST - Create new business listing
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.json()

    // Check if listing already exists
    const existingRecords = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })

    if (existingRecords.length > 0) {
      return NextResponse.json(
        { error: "Business listing already exists" },
        { status: 400 }
      )
    }

    // Create new record in Airtable
    const airtableData = mapToAirtableFormat(formData, userId)
    const createdRecord = await greenMissionClient.createMember(airtableData)

    const listing = mapFromAirtableFormat(createdRecord)

    return NextResponse.json({
      success: true,
      listing,
      message: "Business listing created successfully"
    })
  } catch (error) {
    console.error("Error creating business listing:", error)
    return NextResponse.json(
      { error: "Failed to create business listing" },
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