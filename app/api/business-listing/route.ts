import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"
import { generateBusinessIdentifiers } from "@/lib/business-id-generator"
import { getDashboardConfig, getVisibleFormFields, ESSENTIAL_FIELDS } from "@/lib/config"

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

  // Handle logo upload
  if (formData.logo) {
    mappedData["Logo"] = [{ url: formData.logo }]
  }

  // Handle business images
  if (formData.businessImages && formData.businessImages.length > 0) {
    mappedData["Business Images"] = formData.businessImages.map((url: string) => ({ url }))
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
    lastSynced: fields["Last Updated"] || null,
    logo: fields["Logo"] && fields["Logo"][0] ? fields["Logo"][0].url : "",
    businessImages: fields["Business Images"] ? fields["Business Images"].map((img: any) => img.url) : []
  }
}

/**
 * Filter API response based on simplified mode configuration
 *
 * In simplified mode, only essential fields are returned to match the UI.
 * In advanced mode, all fields are returned for full functionality.
 *
 * @param {any} listing - The complete business listing object
 * @returns {any} Filtered listing object based on current configuration
 */
function filterResponseForSimplifiedMode(listing: any) {
  const config = getDashboardConfig()
  
  // If not in simplified mode, return complete response
  if (!config.isSimplified) {
    return listing
  }
  
  // Essential fields for simplified mode (matching UI requirements)
  const essentialFields = [
    'id',
    'businessName',
    'description',
    'industry',
    'website',
    'email',
    'phone',
    'city',
    'country',
    'status',
    'logo',           // Include logo for image management
    'businessImages'  // Include business images for gallery management
  ]
  
  // Create filtered object with only essential fields
  const filteredListing: any = {}
  
  essentialFields.forEach(field => {
    if (listing.hasOwnProperty(field)) {
      filteredListing[field] = listing[field]
    }
  })
  
  // PHASE 2: Advanced fields that are filtered out in simplified mode
  // These fields are preserved in the data but hidden from API response:
  // - sustainabilityPractices: Advanced sustainability reporting
  // - certifications: Detailed certification information
  // - membershipTier: Membership level management
  // - directoryVisibility: Advanced visibility controls
  // - lastSynced: Airtable sync status information
  // - organizationId: Organization management features
  
  return filteredListing
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
    
    // Apply response filtering based on simplified mode configuration
    const filteredListing = filterResponseForSimplifiedMode(listing)

    return NextResponse.json({
      success: true,
      listing: filteredListing
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
      
      // Apply response filtering based on simplified mode configuration
      const filteredListing = filterResponseForSimplifiedMode(listing)

      return NextResponse.json({
        success: true,
        listing: filteredListing,
        message: "Business listing updated successfully"
      })
    } else {
      // Create new record - generate Business ID and Slug first
      console.log("Creating new business listing for:", formData.businessName)
      
      try {
        const { businessId, slug } = await generateBusinessIdentifiers(formData.businessName)
        console.log("Generated Business ID:", businessId, "Slug:", slug)
        
        // Add generated identifiers to the data
        const newBusinessData = {
          ...airtableData,
          "Business ID": businessId,
          "Slug": slug
        }
        
        const createdRecord = await greenMissionClient.createMember(newBusinessData)
        const listing = mapFromAirtableFormat(createdRecord)
        
        // Apply response filtering based on simplified mode configuration
        const filteredListing = filterResponseForSimplifiedMode(listing)

        return NextResponse.json({
          success: true,
          listing: filteredListing,
          message: "Business listing created successfully"
        })
      } catch (idGenerationError) {
        console.error("Error generating business identifiers:", idGenerationError)
        
        // Fallback without auto-generated IDs
        const createdRecord = await greenMissionClient.createMember(airtableData)
        const listing = mapFromAirtableFormat(createdRecord)
        
        // Apply response filtering based on simplified mode configuration
        const filteredListing = filterResponseForSimplifiedMode(listing)

        return NextResponse.json({
          success: true,
          listing: filteredListing,
          message: "Business listing created successfully (manual ID generation required)"
        })
      }
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
    
    // Apply response filtering based on simplified mode configuration
    const filteredListing = filterResponseForSimplifiedMode(listing)

    return NextResponse.json({
      success: true,
      listing: filteredListing,
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