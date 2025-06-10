"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { sampleMembers } from "@/lib/data"
import ShowcaseMemberCard from "./showcase-member-card"
import { Loader2 } from "lucide-react"

export default function FeaturedMembersSection() {
  const [members, setMembers] = useState(sampleMembers.filter((m) => m.featured).slice(0, 3))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedMembers() {
      try {
        const response = await fetch("/api/members/featured")
        const data = await response.json()

        if (data.success && data.members.length > 0) {
          // Transform Airtable data to match our Member type
          const transformedMembers = data.members.slice(0, 3).map((member: any) => ({
            id: member.id,
            name: member["Business Name"] || "Business Name",
            slug: member.Slug || member["Business Name"]?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
            tagline: member["Short Description"] || "Sustainable business",
            description:
              member["Business Description"] || "A sustainable business committed to environmental responsibility.",
            logo: member.Logo?.[0]?.url || "/placeholder.svg?height=64&width=64",
            coverImage: member["Business Images"]?.[0]?.url || "/placeholder.svg?height=200&width=400",
            location: `${member.City || "City"}, ${member.State || "State"}`,
            category: member["Industry Category"]?.[0] || "Sustainability",
            tier: member["Membership Tier"]?.[0] || "Basic",
            rating: 4.8,
            reviews: Math.floor(Math.random() * 200) + 50,
            sustainabilityScore: member["Sustainability Score"] || 85,
            certifications: member.Certifications || ["Eco-Certified"],
            specialties: member["Services Offered"] || ["Sustainable Practices"],
            featured: member["Featured Member"] || true,
            verified: member["Membership Status"] === "Active",
          }))
          setMembers(transformedMembers)
        }
      } catch (error) {
        console.log("Using sample data for featured members")
        // Keep sample data as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMembers()
  }, [])

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary md:text-4xl">
            Featured Sustainable Businesses
          </h2>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-primary md:text-4xl">
          Featured Sustainable Businesses
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <ShowcaseMemberCard key={member.id} member={member} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/directory">Explore Business Directory</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
