import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionTestimonials } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      featured: searchParams.get("featured") === "true" || undefined,
      membershipTier: searchParams.get("tier") || undefined,
      useCase: searchParams.get("useCase") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    const testimonials = await getGreenMissionTestimonials(options)

    return NextResponse.json({
      success: true,
      count: testimonials.length,
      testimonials,
    })
  } catch (error) {
    console.error("Error fetching Green Mission testimonials:", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}
