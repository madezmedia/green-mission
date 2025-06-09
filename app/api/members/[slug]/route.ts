import { type NextRequest, NextResponse } from "next/server"
import { AirtableCacheWrapper } from "@/lib/cache/redis-client"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Use cached member lookup
    const member = await AirtableCacheWrapper.getMemberBySlug(params.slug)

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      member,
      cached: true,
    })
  } catch (error) {
    console.error("Error fetching cached Green Mission member by slug:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}
