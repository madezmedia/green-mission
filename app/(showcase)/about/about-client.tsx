"use client"

import { usePageContent } from "@/lib/hooks/use-cms-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Shield, Zap, Heart, Target, Globe, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"

// Fallback content structure
const fallbackContent = {
  pageTitle: "About Green Mission Club",
  metaDescription: "Learn about Green Mission Club's mission to connect sustainable businesses and drive environmental impact through community-driven growth and innovation.",
  heroTitle: "Connecting Sustainable Businesses for Shared Success",
  heroDescription: "Green Mission Club is more than a business directory—we're a thriving community of environmentally conscious entrepreneurs, innovators, and leaders working together to build a sustainable future.",
  sections: [
    {
      sectionSlug: "mission",
      sectionTitle: "Our Mission",
      sectionContent: "To create a powerful network where sustainable businesses can connect, collaborate, and grow together while making a positive environmental impact. We believe that by bringing together like-minded entrepreneurs and organizations, we can accelerate the transition to a more sustainable economy.",
      sectionType: "text" as const,
      sectionOrder: 1
    },
    {
      sectionSlug: "differentiators",
      sectionTitle: "What Sets Us Apart",
      sectionContent: JSON.stringify([
        {
          icon: "Shield",
          title: "Professional & Sustainable",
          description: "Every member is vetted for both business credibility and genuine environmental commitment."
        },
        {
          icon: "Users",
          title: "Community-Driven Growth",
          description: "Our platform facilitates meaningful connections that lead to real business partnerships and collaborations."
        },
        {
          icon: "CheckCircle",
          title: "Credible & Trustworthy",
          description: "Transparent verification processes ensure you're connecting with legitimate, committed sustainable businesses."
        },
        {
          icon: "Zap",
          title: "Forward-Thinking Technology",
          description: "Modern tools and features designed specifically for the unique needs of sustainable businesses."
        }
      ]),
      sectionType: "grid" as const,
      sectionOrder: 2
    },
    {
      sectionSlug: "audience",
      sectionTitle: "Who We Serve",
      sectionContent: "Green Mission Club welcomes sustainable businesses of all sizes—from innovative startups pioneering green technologies to established enterprises implementing comprehensive sustainability programs. Whether you're a B-Corp certified company, a renewable energy provider, sustainable product manufacturer, eco-friendly service provider, or any business with a genuine commitment to environmental responsibility, you'll find your community here.",
      sectionType: "text" as const,
      sectionOrder: 3
    },
    {
      sectionSlug: "values",
      sectionTitle: "Our Values",
      sectionContent: JSON.stringify([
        {
          icon: "Leaf",
          title: "Sustainability First",
          description: "Environmental responsibility is at the core of everything we do and every business we welcome."
        },
        {
          icon: "TrendingUp",
          title: "Business Growth",
          description: "We're committed to helping sustainable businesses thrive and scale their positive impact."
        },
        {
          icon: "Heart",
          title: "Community Connection",
          description: "Building genuine relationships and fostering collaboration among our members."
        },
        {
          icon: "Globe",
          title: "Accessible Innovation",
          description: "Making sustainable business practices and technologies accessible to businesses of all sizes."
        },
        {
          icon: "Target",
          title: "Transparent Impact",
          description: "Measuring and sharing the real environmental and economic impact of our community."
        }
      ]),
      sectionType: "grid" as const,
      sectionOrder: 4
    },
    {
      sectionSlug: "difference",
      sectionTitle: "The Green Mission Difference",
      sectionContent: "Unlike traditional business directories, Green Mission Club is built specifically for the sustainable business ecosystem. We understand the unique challenges and opportunities that come with running an environmentally conscious business. Our platform provides not just visibility, but meaningful connections, resources, and support systems that help sustainable businesses succeed.",
      sectionType: "text" as const,
      sectionOrder: 5
    },
    {
      sectionSlug: "future",
      sectionTitle: "Looking Forward",
      sectionContent: "As we grow, we're continuously developing new features and programs to better serve our community. From sustainability impact tracking to collaborative project platforms, we're building the infrastructure that sustainable businesses need to thrive in the 21st century.",
      sectionType: "text" as const,
      sectionOrder: 6
    }
  ]
}

const iconMap = {
  Leaf,
  Users,
  Shield,
  Zap,
  Heart,
  Target,
  Globe,
  TrendingUp,
  CheckCircle,
  ArrowRight
}

interface SectionProps {
  section: {
    sectionSlug: string
    sectionTitle: string
    sectionContent: string
    sectionType: "text" | "list" | "grid" | "cta"
    sectionOrder: number
  }
}

function SectionRenderer({ section }: SectionProps) {
  const { sectionTitle, sectionContent, sectionType } = section

  if (sectionType === "grid") {
    let items = []
    try {
      items = JSON.parse(sectionContent)
    } catch {
      return null
    }

    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{sectionTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item: any, index: number) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || CheckCircle
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8">{sectionTitle}</h2>
        <div className="prose prose-lg mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed">{sectionContent}</p>
        </div>
      </div>
    </section>
  )
}

export default function AboutPageClient() {
  const { pageContent, loading, error } = usePageContent("about", true, true)

  // Use CMS content if available, otherwise fallback
  const content = pageContent || fallbackContent
  const sections = content.sections || fallbackContent.sections

  return (
    <div>
      <ShowcaseNavigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              About Green Mission Club
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {content.heroDescription}
            </p>
          </div>
        </section>

        {/* Dynamic Sections */}
        {sections
          .sort((a: any, b: any) => a.sectionOrder - b.sectionOrder)
          .map((section: any, index: number) => (
            <div key={section.sectionSlug} className={index % 2 === 1 ? "bg-muted/30" : ""}>
              <SectionRenderer section={section} />
            </div>
          ))}

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Connect with like-minded sustainable businesses and start making a greater impact together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/join">
                    Become a Member
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                  <Link href="/directory">
                    Explore Directory
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading and Error States */}
        {loading && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-4 shadow-lg">
            <p className="text-sm text-muted-foreground">Loading content from CMS...</p>
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4 shadow-lg">
            <p className="text-sm text-destructive">Using fallback content</p>
          </div>
        )}
      </main>
      <ShowcaseFooter />
    </div>
  )
}