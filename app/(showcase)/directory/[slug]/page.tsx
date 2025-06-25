import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"
import MemberTag from "@/components/directory/member-tag"
import MemberSince from "@/components/directory/member-since"
import IndustryTag from "@/components/directory/industry-tag"
import AlignmentToGreenMission from "@/components/directory/alignment-to-green-mission"
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

interface TeamMember {
  name: string
  role: string
  image: string
  bio?: string
}

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
  "Team Members"?: TeamMember[]
  "Gallery Images"?: { url: string; caption?: string }[]
  "Green Mission Alignment"?: string
}

export default async function MemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Server-side data fetching
  let member: MemberProfile | null = null
  let error: string | null = null
  
  try {
    // Try to fetch from Airtable first (core functionality)
    try {
      const { getGreenMissionMemberBusinesses } = await import("@/lib/airtable/green-mission-client")
      const members = await getGreenMissionMemberBusinesses({
        slug: slug,
      })
      const foundMember = members[0]
      if (foundMember && foundMember.id) {
        // Add team members and gallery to Airtable data if not present
        const memberWithExtras = foundMember as MemberProfile
        
        // Add sample team members if not present in Airtable
        if (!memberWithExtras["Team Members"]) {
          memberWithExtras["Team Members"] = [
            {
              name: "Sarah Johnson",
              role: "CEO & Founder",
              image: "/placeholder-avatar-1.jpg",
              bio: "Passionate about sustainable business practices with 15+ years of industry experience."
            },
            {
              name: "Michael Chen",
              role: "Head of Operations",
              image: "/placeholder-avatar-2.jpg",
              bio: "Expert in green technology implementation and supply chain optimization."
            },
            {
              name: "Emily Rodriguez",
              role: "Sustainability Director",
              image: "/placeholder-avatar-3.jpg",
              bio: "Environmental scientist dedicated to creating measurable positive impact."
            }
          ]
        }
        
        // Add sample gallery if not present in Airtable
        if (!memberWithExtras["Gallery Images"]) {
          memberWithExtras["Gallery Images"] = [
            { url: "/placeholder-gallery-1.jpg", caption: "Our state-of-the-art facility" },
            { url: "/placeholder-gallery-2.jpg", caption: "Team collaboration in action" },
            { url: "/placeholder-gallery-3.jpg", caption: "Sustainable production process" },
            { url: "/placeholder-gallery-4.jpg", caption: "Community engagement event" },
            { url: "/placeholder-gallery-5.jpg", caption: "Award ceremony recognition" },
            { url: "/placeholder-gallery-6.jpg", caption: "Innovation lab workspace" }
          ]
        }
        
        member = memberWithExtras
      }
    } catch (airtableError) {
      console.warn("Airtable not available, using sample data fallback:", airtableError)

      // Fallback to sample data only when Airtable fails
      const { sampleMembers } = await import("@/lib/data")
      
      // Helper function to create slug from name
      const createSlug = (name: string) =>
        name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
      
      // First try to find by existing slug property
      let sampleMember = sampleMembers.find((m) => m.slug === slug)
      
      // If not found, try by generated slug
      if (!sampleMember) {
        sampleMember = sampleMembers.find((m) => createSlug(m.name) === slug)
      }
      
      if (sampleMember) {
        // Generate sample team members
        const teamMembers: TeamMember[] = [
          {
            name: "Sarah Johnson",
            role: "CEO & Founder",
            image: "/placeholder-avatar-1.jpg",
            bio: "Passionate about sustainable business practices with 15+ years of industry experience."
          },
          {
            name: "Michael Chen",
            role: "Head of Operations",
            image: "/placeholder-avatar-2.jpg",
            bio: "Expert in green technology implementation and supply chain optimization."
          },
          {
            name: "Emily Rodriguez",
            role: "Sustainability Director",
            image: "/placeholder-avatar-3.jpg",
            bio: "Environmental scientist dedicated to creating measurable positive impact."
          }
        ]

        // Generate sample gallery images
        const galleryImages = [
          { url: "/placeholder-gallery-1.jpg", caption: "Our state-of-the-art facility" },
          { url: "/placeholder-gallery-2.jpg", caption: "Team collaboration in action" },
          { url: "/placeholder-gallery-3.jpg", caption: "Sustainable production process" },
          { url: "/placeholder-gallery-4.jpg", caption: "Community engagement event" },
          { url: "/placeholder-gallery-5.jpg", caption: "Award ceremony recognition" },
          { url: "/placeholder-gallery-6.jpg", caption: "Innovation lab workspace" }
        ]

        // Transform sample member to expected API format
        member = {
          id: sampleMember.id.toString(),
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
          "Team Members": teamMembers,
          "Gallery Images": galleryImages,
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
                        <MemberTag
                          type={member["Featured Member"] ? "Featured Member" : "Member"}
                          color={member["Featured Member"] ? "green-accent" : "green-base"}
                          icon={member["Featured Member"] ? "star" : "check"}
                        />
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
                          <MemberSince
                            date={member["Member Since"]}
                            format="Month YYYY"
                            className="text-sm"
                          />
                        )}
                        {member["Industry Category"] && (
                          <IndustryTag
                            category={member["Industry Category"][0]}
                            position="after-member-since"
                            className="text-sm"
                          />
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

              {/* Alignment to Green Mission */}
              <AlignmentToGreenMission
                content={member["Green Mission Alignment"] || ""}
              />

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


              {/* Image Gallery */}
              {member["Gallery Images"] && member["Gallery Images"].length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {member["Gallery Images"].map((image, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-lg">
                          <Image
                            src={image.url}
                            alt={image.caption || `Gallery image ${index + 1}`}
                            width={300}
                            height={200}
                            className="object-cover w-full h-48 transition-transform group-hover:scale-105"
                          />
                          {image.caption && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-white text-sm font-medium">{image.caption}</p>
                              </div>
                            </div>
                          )}
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


              {/* Connect Button - Hidden but preserved for future implementation */}
              {false && (
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
              )}
            </div>
          </div>
        </div>
      </main>
      <ShowcaseFooter />
    </div>
  )
}

