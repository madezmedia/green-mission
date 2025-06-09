import { type NextRequest, NextResponse } from "next/server"
import { getGreenMissionBlogPosts } from "@/lib/airtable/green-mission-client"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const posts = await getGreenMissionBlogPosts() // Fetch all to find by slug
    const post = posts.find((p) => p.Slug === params.slug)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error("Error fetching Green Mission blog post by slug:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
