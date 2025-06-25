"use client"

import { usePageContent } from "@/lib/hooks/use-cms-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Shield, Zap, Heart, Target, Globe, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"

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

  // Filter out unwanted sections from CMS content
  const filteredSections = pageContent?.sections?.filter((section: any) => {
    // Remove these sections completely
    const sectionsToRemove = ["differentiators", "audience"]
    return !sectionsToRemove.includes(section.sectionSlug)
  }).map((section: any) => {
    // For the values section, remove "Transparent Impact" item
    if (section.sectionSlug === "values" && section.sectionType === "grid") {
      try {
        const items = JSON.parse(section.sectionContent || "[]")
        const filteredItems = items.filter((item: any) => item.title !== "Transparent Impact")
        return {
          ...section,
          sectionContent: JSON.stringify(filteredItems)
        }
      } catch {
        return section
      }
    }
    return section
  }) || []

  // If no CMS content is available, show loading or error state
  if (loading) {
    return (
      <div>
        <ShowcaseNavigation />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading content...</p>
          </div>
        </main>
        <ShowcaseFooter />
      </div>
    )
  }

  if (error || !pageContent) {
    return (
      <div>
        <ShowcaseNavigation />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-destructive">Unable to load page content</p>
            <p className="text-sm text-muted-foreground mt-2">Please check your CMS configuration</p>
          </div>
        </main>
        <ShowcaseFooter />
      </div>
    )
  }

  return (
    <div>
      <ShowcaseNavigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold">About Green Mission Club</h1>
          </div>
        </section>

        {/* Dynamic Sections */}
        {filteredSections
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
                  <Link href="/membership" target="_self">
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