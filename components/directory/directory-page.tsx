"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List, Search, Loader2 } from "lucide-react"
import { categories, sampleMembers } from "@/lib/data"
import MemberCard from "./member-card"
import { cn } from "@/lib/utils"

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [members, setMembers] = useState(sampleMembers)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    async function fetchDirectoryMembers() {
      try {
        // Fetch only members with Directory Visibility enabled
        const response = await fetch("/api/members?visibility=true&limit=50")
        const data = await response.json()

        if (data.success && data.members.length > 0) {
          // Transform Airtable data to match our Member type
          const transformedMembers = data.members.map((member: any) => ({
            id: member.id,
            name: member["Business Name"] || "Business Name",
            slug: member.Slug || member["Business Name"]?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
            tagline: member["Short Description"] || "Sustainable business",
            description: member["Business Description"] || "A sustainable business committed to environmental responsibility.",
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
            featured: member["Featured Member"] || false,
            verified: member["Membership Status"] === "Active",
          }))
          setMembers(transformedMembers)
        }
      } catch (error) {
        console.log("Using sample data for directory")
        // Keep sample data as fallback
      } finally {
        setLoading(false)
      }
    }

    fetchDirectoryMembers()
  }, [])

  // Filter members based on search and category
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || member.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Directory</h1>
        <p className="text-muted-foreground">Find and connect with eco-conscious businesses.</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or location..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex rounded-md border bg-card p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} businesses
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-6",
            viewMode === "grid" ? "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
          )}
        >
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} layout={viewMode} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No businesses found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
