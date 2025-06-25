"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Filter, Grid, List, Search, MapPin, Users } from "lucide-react"
import MemberCard from "@/components/directory/member-card"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"
import { cn } from "@/lib/utils"
import type { Member } from "@/types"

interface Category {
  id: string
  categoryName: string
  memberCount: number
}

interface ApiResponse {
  success: boolean
  count: number
  members: any[]
  cached?: boolean
  error?: string
}

interface CategoriesResponse {
  success: boolean
  count: number
  categories: Category[]
}

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [members, setMembers] = useState<Member[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        // Only fetch members with directory visibility enabled
        params.append("visibility", "true")
        
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory)
        }
        if (selectedLocation !== "all") {
          params.append("city", selectedLocation)
        }
        params.append("limit", "50")

        console.log("Fetching members with params:", params.toString())
        const response = await fetch(`/api/members?${params}`)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data: ApiResponse = await response.json()
        console.log("API Response:", data)

        if (data.success && data.members) {
          // Transform API data to match our Member type
          const transformedMembers = data.members.map((member: any) => ({
            id: member.id || Math.random(),
            name: member["Business Name"] || member.name || "Unnamed Business",
            slug: member.Slug || member.slug || member["Business Name"]?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
            tagline: member["Short Description"] || member.tagline || "Eco-conscious business",
            description: member["Business Description"] || member.description || "No description available",
            logo: member.Logo?.[0]?.url || member.logo || "/placeholder-logo.svg",
            coverImage: member["Business Images"]?.[0]?.url || member.coverImage || "/placeholder.jpg",
            location: `${member.City || "Unknown"}, ${member.State || ""}`.trim().replace(/,$/, ""),
            category: member["Industry Category"]?.[0] || member.category || "General",
            tier: (member["Membership Tier"]?.[0] || member.tier || "Basic") as "Enterprise" | "Premium" | "Basic",
            rating: member.rating || 4.5,
            reviews: member.reviews || 0,
            sustainabilityScore: member["Sustainability Score"] || member.sustainabilityScore || 75,
            certifications: member.Certifications || member.certifications || [],
            specialties: member["Services Offered"] || member.specialties || [],
            businessTags: member["Business Tags"] || member.businessTags || [],
            featured: member["Featured Member"] || member.featured || false,
            spotlight: member.spotlight || false,
            verified: member.verified || true,
            memberSince: member["Member Since"] || member.memberSince || "2023-01-01",
            industryCategory: member["Industry Category"]?.[0] || member.category || "General",
            greenMissionAlignment: member["Green Mission Alignment"] || member.greenMissionAlignment,
          }))
          console.log("Transformed members:", transformedMembers.length)
          setMembers(transformedMembers)
          setError(null)
        } else {
          console.error("API returned unsuccessful response:", data)
          setError(data.error || "Failed to fetch members")
        }
      } catch (err) {
        console.error("Error fetching members:", err)
        setError(err instanceof Error ? err.message : "Failed to load directory")
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [selectedCategory, selectedLocation])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/directory/categories")
        const data: CategoriesResponse = await response.json()

        if (data.success) {
          setCategories(data.categories)
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategories()
  }, [])

  // Filter members by search term
  const filteredMembers = members.filter((member) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      member.name.toLowerCase().includes(search) ||
      member.tagline.toLowerCase().includes(search) ||
      member.location.toLowerCase().includes(search) ||
      member.category.toLowerCase().includes(search)
    )
  })

  // Get unique locations for filter
  const locations = Array.from(new Set(members.map(m => m.location.split(",")[0]).filter(Boolean)))

  return (
    <div>
      <ShowcaseNavigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-hero py-12 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Business Directory</h1>
              <p className="text-xl text-white/90">
                Discover and connect with eco-conscious businesses making a positive impact
              </p>
              <div className="mt-6 flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{members.length} Active Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{locations.length} Locations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.categoryName}>
                            {cat.categoryName} ({cat.memberCount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search businesses..." 
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
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  Showing {filteredMembers.length} of {members.length} businesses
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => setSelectedCategory("all")}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {selectedLocation !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLocation}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => setSelectedLocation("all")}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" ? "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              )}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <div className="h-40">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Members Grid */}
            {!loading && !error && (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
                )}
              >
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} layout={viewMode} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredMembers.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                      setSelectedLocation("all")
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <ShowcaseFooter />
    </div>
  )
}