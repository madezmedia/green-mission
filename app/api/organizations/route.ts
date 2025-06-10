// app/api/organizations/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { 
  createOrganizationWithSync,
  updateOrganizationWithSync,
  getUserOrganizations 
} from "@/lib/clerk-airtable-sync"

// GET - Get user's organizations and associated business data
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizations = await getUserOrganizations(userId)

    return NextResponse.json({
      success: true,
      organizations,
      count: organizations.length
    })
    
  } catch (error) {
    console.error("Error fetching user organizations:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch organizations",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// POST - Create new organization with business listing
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { businessName, businessData } = body

    if (!businessName) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      )
    }

    // Create organization and sync with Airtable
    const result = await createOrganizationWithSync(
      businessName,
      userId,
      businessData || {}
    )

    return NextResponse.json({
      success: true,
      organization: result,
      message: "Organization created successfully"
    })
    
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json(
      { 
        error: "Failed to create organization",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// PUT - Update organization and business data
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { organizationId, businessName, businessData } = body

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      )
    }

    // Update organization and sync with Airtable
    await updateOrganizationWithSync(organizationId, {
      businessName,
      businessData
    })

    return NextResponse.json({
      success: true,
      message: "Organization updated successfully"
    })
    
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json(
      { 
        error: "Failed to update organization",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}