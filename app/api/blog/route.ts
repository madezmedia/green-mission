import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionBlogPosts } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const options = {
      featured: searchParams.get("featured") === "true" || undefined,
      memberOnly: searchParams.get("memberOnly") === "true" || undefined, // Corrected
      tierAccess: searchParams.get("tierAccess") || undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined,
    }

    const posts = await getGreenMissionBlogPosts(options)

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
    })
  } catch (error) {
    console.error("Error fetching Green Mission blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}
