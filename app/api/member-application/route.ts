import { type NextRequest, NextResponse } from "next/server"
import { createGreenMissionMemberBusiness, type MemberBusiness } from "@/lib/airtable/green-mission-client"

export async function POST(request: NextRequest) {
  try {
    const memberData = await request.json()

    // Validate required fields (ensure field names match Airtable or your mapping)
    if (!memberData["Business Name"] || !memberData.Email) {
      return NextResponse.json({ error: "Business name and email are required" }, { status: 400 })
    }

    // Set default values
    const applicationData: Partial<MemberBusiness> = {
      ...memberData,
      "Membership Status": "Pending",
      "Directory Visibility": false,
      "Featured Member": false,
      "Directory Spotlight": false,
      "Newsletter Subscription": true, // Default to true or based on form input
      "Member Since": new Date().toISOString().split("T")[0],
    }

    const recordId = await createGreenMissionMemberBusiness(applicationData)

    if (!recordId) {
      throw new Error("Failed to create member application")
    }

    return NextResponse.json({
      success: true,
      message: "Member application submitted successfully",
      recordId,
    })
  } catch (error) {
    console.error("Error creating Green Mission member application:", error)
    return NextResponse.json({ error: "Failed to submit member application" }, { status: 500 })
  }
}
