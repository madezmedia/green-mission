// app/api/organizations/[organizationId]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getCompleteOrganization } from "@/lib/organization-management"

// GET - Get specific organization data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const { userId } = await auth()
    const { organizationId } = await params
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!organizationId) {
      return NextResponse.json(
        { 
          success: false,
          error: "Organization ID is required" 
        },
        { status: 400 }
      )
    }

    console.log(`Fetching organization data for: ${organizationId}`)
    const result = await getCompleteOrganization(organizationId)

    if (result.success) {
      // Check if user is a member of this organization
      const userIsMember = result.members?.some(
        member => member.publicUserData?.userId === userId
      )

      if (!userIsMember) {
        return NextResponse.json(
          { 
            success: false,
            error: "Access denied - not a member of this organization" 
          },
          { status: 403 }
        )
      }

      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 404 })
    }
    
  } catch (error) {
    console.error(`Error fetching organization ${await params}:`, error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch organization",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}