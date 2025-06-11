import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    let member
    let cached = false

    // Skip cache for now, try Airtable then fallback to sample data
    try {
      const { getGreenMissionMemberBusinesses } = await import("@/lib/airtable/green-mission-client")
      const members = await getGreenMissionMemberBusinesses({
        slug: slug,
      })
      member = members[0] || null
    } catch (airtableError) {
      console.warn("Airtable not available, using sample data:", airtableError)

      // Fallback to sample data
      const { sampleMembers } = await import("@/lib/data")
      
      // Helper function to create slug from name
      const createSlug = (name: string) => 
        name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
      
      const sampleMember = sampleMembers.find((m) => createSlug(m.name) === slug)
      
      if (sampleMember) {
        // Transform sample member to expected API format
        member = {
          id: sampleMember.id,
          "Business Name": sampleMember.name,
          Slug: slug,
          Email: "contact@" + sampleMember.name.toLowerCase().replace(/\s+/g, '') + ".com",
          "Short Description": sampleMember.tagline,
          "Business Description": sampleMember.description,
          Logo: [{ url: sampleMember.logo }],
          "Business Images": [{ url: sampleMember.coverImage }],
          City: sampleMember.location.split(',')[0],
          State: sampleMember.location.split(',')[1]?.trim(),
          "Industry Category": [sampleMember.category],
          "Services Offered": sampleMember.specialties,
          "Business Tags": sampleMember.businessTags,
          "Membership Tier": [sampleMember.tier],
          "Member Since": "2023-01-01",
          "Membership Status": "Active",
          "Featured Member": sampleMember.featured,
          "Directory Spotlight": sampleMember.spotlight,
          "Sustainability Score": sampleMember.sustainabilityScore,
          Certifications: sampleMember.certifications,
          Website: `https://${sampleMember.name.toLowerCase().replace(/\s+/g, '')}.com`,
        }
      }
    }

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      member,
      cached,
    })
  } catch (error) {
    console.error("Error fetching member by slug:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}
