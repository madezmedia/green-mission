import Link from "next/link"
import { Button } from "@/components/ui/button"
import { sampleMembers } from "@/lib/data" // Assuming this data is still relevant
import ShowcaseMemberCard from "./showcase-member-card"

export default function FeaturedMembersSection() {
  const featured = sampleMembers.filter((m) => m.featured).slice(0, 3) // Take first 3 featured

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold text-primary md:text-4xl">
          Featured Sustainable Businesses
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((member) => (
            <ShowcaseMemberCard key={member.id} member={member} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button variant="secondary" size="lg" asChild>
            <Link href="/dashboard">View All Members</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
