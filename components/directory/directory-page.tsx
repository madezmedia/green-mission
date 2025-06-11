"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Filter, Grid, List, Search, Loader2, X } from "lucide-react"
import { sampleMembers } from "@/lib/data"
import MemberCard from "./member-card"
import { cn } from "@/lib/utils"

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [members, setMembers] = useState(sampleMembers)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchDirectoryData() {
      try {
        // Fetch both members and categories
        const [membersResponse, categoriesResponse] = await Promise.all([
          fetch("/api/members?visibility=true&limit=50"),
          fetch("/api/directory/categories")
        ])
        
        const membersData = await membersResponse.json()
        const categoriesData = await categoriesResponse.json()

        // Process members first to get categories from actual data
        let processedMembers = []
        if (membersData.success && membersData.members.length > 0) {
          // Transform Airtable data to match our Member type
          processedMembers = membersData.members.map((member: any) => ({
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
            businessTags: member["Business Tags"] || [],
            featured: member["Featured Member"] || false,
            spotlight: member["Directory Spotlight"] || false,
            verified: member["Membership Status"] === "Active",
          }))
          setMembers(processedMembers)
        }

        // Extract unique categories from actual member data
        const uniqueCategories = [...new Set(processedMembers.map(m => m.category))]
        const dynamicCategories = uniqueCategories.map(cat => {
          const count = processedMembers.filter(m => m.category === cat).length
          return {
            id: cat.toLowerCase().replace(/[^a-z0-9]/g, ''),
            categoryName: cat,
            memberCount: count
          }
        })

        // Process categories - prefer API data, then dynamic from members, then fallback
        console.log("Categories API response:", categoriesData)
        console.log("Dynamic categories from members:", dynamicCategories)
        
        if (categoriesData.success && categoriesData.categories.length > 0) {
          console.log("Using API categories")
          setCategories(categoriesData.categories)
        } else if (dynamicCategories.length > 0) {
          console.log("Using dynamic categories from member data")
          setCategories(dynamicCategories)
        } else {
          // Final fallback to static categories
          setCategories([
            { id: "energy", categoryName: "Energy & Environment", memberCount: 0 },
            { id: "manufacturing", categoryName: "Manufacturing", memberCount: 0 },
            { id: "food", categoryName: "Food & Beverage", memberCount: 0 },
            { id: "technology", categoryName: "Technology", memberCount: 0 },
            { id: "consulting", categoryName: "Consulting", memberCount: 0 },
            { id: "transportation", categoryName: "Transportation", memberCount: 0 },
          ])
        }

      } catch (error) {
        console.log("Using sample data for directory")
        // Keep sample data as fallback and extract categories from it
        setMembers(sampleMembers)
        
        // Extract categories from sample data
        const uniqueCategories = [...new Set(sampleMembers.map(m => m.category))]
        const dynamicCategories = uniqueCategories.map(cat => {
          const count = sampleMembers.filter(m => m.category === cat).length
          return {
            id: cat.toLowerCase().replace(/[^a-z0-9]/g, ''),
            categoryName: cat,
            memberCount: count
          }
        })
        setCategories(dynamicCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchDirectoryData()
  }, [])

  // Filter members based on search, category, and additional filters
  const filteredMembers = members.filter((member) => {
    // Enhanced search functionality
    const matchesSearch = searchTerm === "" || 
                         member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.businessTags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         member.certifications.some(cert => cert.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Improved category matching
    const matchesCategory = selectedCategory === "all" || 
                           member.category.toLowerCase() === selectedCategory.toLowerCase() ||
                           member.category.toLowerCase().includes(selectedCategory.toLowerCase())
    
    // Featured filter
    const matchesFeatured = !showFeaturedOnly || member.featured || member.spotlight
    
    return matchesSearch && matchesCategory && matchesFeatured
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
                <SelectItem key={cat.id} value={cat.categoryName || cat.name}>
                  {cat.categoryName || cat.name} {cat.memberCount ? `(${cat.memberCount})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-primary text-primary-foreground")}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {showFilters && <X className="ml-2 h-4 w-4" />}
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

      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Additional Filters</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowFeaturedOnly(false)
                setSelectedCategory("all")
                setSearchTerm("")
              }}
            >
              Clear All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured-only" 
                checked={showFeaturedOnly}
                onCheckedChange={setShowFeaturedOnly}
              />
              <Label htmlFor="featured-only">Featured & Showcase Only</Label>
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} businesses
          {showFeaturedOnly && " (Featured & Showcase only)"}
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
