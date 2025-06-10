// app/api/organizations/complete/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { 
  createCompleteOrganization,
  updateCompleteOrganization,
  getUserCompleteOrganizations,
  deleteCompleteOrganization,
  addOrganizationMember,
  removeOrganizationMember
} from "@/lib/organization-management"

// GET - Get user's complete organizations with business data
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log(`Fetching organizations for user: ${userId}`)
    const result = await getUserCompleteOrganizations(userId)

    return NextResponse.json(result)
    
  } catch (error) {
    console.error("Error in GET /api/organizations/complete:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch organizations",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// POST - Create complete organization with Clerk API and Airtable sync
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Creating organization with data:", { ...body, adminUserId: userId })

    const { businessName, businessData } = body

    if (!businessName || businessName.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Business name is required and cannot be empty" 
        },
        { status: 400 }
      )
    }

    // Create complete organization system
    const result = await createCompleteOrganization({
      businessName: businessName.trim(),
      adminUserId: userId,
      businessData: businessData || {}
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Organization created successfully",
        organization: {
          organizationId: result.organizationId,
          businessId: result.businessId,
          businessName: result.businessName,
          slug: result.slug,
          airtableRecordId: result.airtableRecordId
        }
      })
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.error || "Failed to create organization"
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error("Error in POST /api/organizations/complete:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create organization",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PUT - Update complete organization
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, businessName, businessData, action, targetUserId } = body

    if (!organizationId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Organization ID is required" 
        },
        { status: 400 }
      )
    }

    // Handle different actions
    switch (action) {
      case "update":
        const updateResult = await updateCompleteOrganization(organizationId, {
          businessName,
          businessData
        })
        return NextResponse.json(updateResult)

      case "add_member":
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: "Target user ID is required" },
            { status: 400 }
          )
        }
        const addResult = await addOrganizationMember(organizationId, targetUserId, body.role || "basic_member")
        return NextResponse.json(addResult)

      case "remove_member":
        if (!targetUserId) {
          return NextResponse.json(
            { success: false, error: "Target user ID is required" },
            { status: 400 }
          )
        }
        const removeResult = await removeOrganizationMember(organizationId, targetUserId)
        return NextResponse.json(removeResult)

      default:
        // Default to update action
        const defaultResult = await updateCompleteOrganization(organizationId, {
          businessName,
          businessData
        })
        return NextResponse.json(defaultResult)
    }
    
  } catch (error) {
    console.error("Error in PUT /api/organizations/complete:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to update organization",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete complete organization
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationId")

    if (!organizationId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Organization ID is required" 
        },
        { status: 400 }
      )
    }

    const result = await deleteCompleteOrganization(organizationId)
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("Error in DELETE /api/organizations/complete:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete organization",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}