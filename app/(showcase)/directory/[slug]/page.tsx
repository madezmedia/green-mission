import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"
import { 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Star, 
  Shield, 
  Award, 
  Calendar,
  ExternalLink,
  ArrowLeft,
  Clock,
  Users,
  CheckCircle
} from "lucide-react"

interface MemberProfile {
  id: string
  "Business Name": string
  Slug: string
  "Owner Name"?: string
  Email: string
  Phone?: string
  Website?: string
  "Business Description"?: string
  "Short Description"?: string
  Logo?: { url: string }[]
  "Business Images"?: { url: string }[]
  "Business Address"?: string
  City?: string
  State?: string
  "ZIP Code"?: string
  "Industry Category"?: string[]
  "Services Offered"?: string[]
  "Membership Tier"?: string[]
  "Member Since"?: string
  "Membership Status": string
  "Featured Member"?: boolean
  "Sustainability Score"?: number
  Certifications?: string[]
  "Social Media Links"?: string
  "Operating Hours"?: string
}

export default async function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Server-side data fetching
  let member: MemberProfile | null = null
  let error: string | null = null
  
  try {
    // Direct server-side data fetching using Airtable client
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
          "Membership Tier": [sampleMember.tier],
          "Member Since": "2023-01-01",
          "Membership Status": "Active",
          "Featured Member": sampleMember.featured,
          "Sustainability Score": sampleMember.sustainabilityScore,
          Certifications: sampleMember.certifications,
          Website: `https://${sampleMember.name.toLowerCase().replace(/\s+/g, '')}.com`,
        } as MemberProfile
      }
    }

    if (!member) {
      notFound()
    }
  } catch (err) {
    console.error("Error fetching member:", err)
    error = "Failed to load member profile"
  }

  if (error || !member) {
    return (
      <div>
        <ShowcaseNavigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Member Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The member profile you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/directory">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Directory
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <ShowcaseFooter />
      </div>
    )
  }

  const tierColors = {
    Enterprise: "bg-primary text-primary-foreground",
    Premium: "bg-secondary text-secondary-foreground", 
    Basic: "bg-accent text-accent-foreground",
  }

  const tierColor = tierColors[member["Membership Tier"]?.[0] as keyof typeof tierColors] || tierColors.Basic

  const socialLinks = member["Social Media Links"] ? JSON.parse(member["Social Media Links"]) : {}

  return (
    <div>
      <ShowcaseNavigation />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 bg-gradient-hero">
          {member["Business Images"]?.[0] && (
            <Image
              src={member["Business Images"][0].url}
              alt={`${member["Business Name"]} cover`}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link href="/directory">
              <Button variant="secondary" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
          </div>

          {/* Featured Badge */}
          {member["Featured Member"] && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent text-accent-foreground">
                <Star className="mr-1 h-3 w-3" />
                Featured Member
              </Badge>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                      <AvatarImage 
                        src={member.Logo?.[0]?.url || "/placeholder-logo.svg"} 
                        alt={`${member["Business Name"]} logo`} 
                      />
                      <AvatarFallback className="bg-gradient-primary text-white text-lg">
                        {member["Business Name"].substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold">{member["Business Name"]}</h1>
                        <Badge className={tierColor}>
                          {member["Membership Tier"]?.[0] || "Basic"}
                        </Badge>
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      
                      <p className="text-lg text-muted-foreground mb-3">
                        {member["Short Description"] || "Eco-conscious business"}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {member.City && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {member.City}, {member.State}
                          </div>
                        )}
                        {member["Member Since"] && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Member since {new Date(member["Member Since"]).getFullYear()}
                          </div>
                        )}
                        {member["Industry Category"] && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {member["Industry Category"][0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {member["Business Description"] || "No description available."}
                  </p>
                </CardContent>
              </Card>

              {/* Services */}
              {member["Services Offered"] && member["Services Offered"].length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Services & Specialties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {member["Services Offered"].map((service, index) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {member.Certifications && member.Certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Certifications & Awards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {member.Certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member.Website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={member.Website.startsWith('http') ? member.Website : `https://${member.Website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="ml-1 h-3 w-3 inline" />
                      </a>
                    </div>
                  )}
                  
                  {member.Email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${member.Email}`} className="text-primary hover:underline">
                        {member.Email}
                      </a>
                    </div>
                  )}
                  
                  {member.Phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${member.Phone}`} className="text-primary hover:underline">
                        {member.Phone}
                      </a>
                    </div>
                  )}
                  
                  {member["Business Address"] && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{member["Business Address"]}</p>
                        <p>{member.City}, {member.State} {member["ZIP Code"]}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Operating Hours */}
              {member["Operating Hours"] && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member["Operating Hours"]}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sustainability Score */}
              {member["Sustainability Score"] && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sustainability Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Environmental Impact</span>
                        <span className="font-semibold text-primary">
                          {member["Sustainability Score"]}%
                        </span>
                      </div>
                      <Progress value={member["Sustainability Score"]} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Based on certifications, practices, and community impact
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Connect Button */}
              <Card>
                <CardContent className="p-6">
                  <Button className="w-full" size="lg">
                    <Mail className="mr-2 h-4 w-4" />
                    Connect with {member["Business Name"]}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Send a message to explore partnership opportunities
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <ShowcaseFooter />
    </div>
  )
}

