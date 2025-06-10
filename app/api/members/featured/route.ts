import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to use Airtable if configured
    try {
      const { getGreenMissionMemberBusinesses } = await import("@/lib/airtable/green-mission-client")

      const featuredMembers = await getGreenMissionMemberBusinesses({
        featuredMember: true,
        directoryVisibility: true,
        limit: 6,
      })

      if (featuredMembers.length > 0) {
        return NextResponse.json({
          success: true,
          count: featuredMembers.length,
          members: featuredMembers,
          source: "airtable",
        })
      }
    } catch (airtableError) {
      console.log("Airtable not configured, using sample data")
    }

    // Fallback to sample data
    const { sampleMembers } = await import("@/lib/data")
    const featuredMembers = sampleMembers.filter((m) => m.featured).slice(0, 6)

    return NextResponse.json({
      success: true,
      count: featuredMembers.length,
      members: featuredMembers.map((member) => ({
        id: member.id.toString(),
        "Business Name": member.name,
        "Short Description": member.tagline,
        "Business Description": member.description,
        Logo: [{ url: member.logo }],
        "Business Images": [{ url: member.coverImage }],
        City: member.location.split(",")[0],
        State: member.location.split(",")[1]?.trim(),
        "Industry Category": [member.category],
        "Membership Tier": [member.tier],
        "Sustainability Score": member.sustainabilityScore,
        Certifications: member.certifications,
        "Services Offered": member.specialties,
        "Featured Member": member.featured,
        "Membership Status": member.verified ? "Active" : "Pending",
      })),
      source: "sample",
    })
  } catch (error) {
    console.error("Error fetching featured Green Mission members:", error)
    return NextResponse.json({ error: "Failed to fetch featured members" }, { status: 500 })
  }
}
