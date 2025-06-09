"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, MapPin, Star, ArrowRight, Users, Building2 } from "lucide-react"

export default function DirectoryPreviewSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-primary md:text-4xl mb-4">
            Discover Sustainable Businesses
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore our comprehensive directory of eco-conscious businesses. Find partners, suppliers, 
            and collaborators who share your commitment to sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Directory Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                <p className="text-muted-foreground">
                  Find businesses by name, location, industry, or sustainability focus with our intelligent search.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
                <p className="text-muted-foreground">
                  Filter by membership tier, certifications, services, and sustainability scores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
                <p className="text-muted-foreground">
                  Discover local sustainable businesses in your area or explore opportunities globally.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Profiles</h3>
                <p className="text-muted-foreground">
                  All businesses are verified with detailed profiles, sustainability scores, and certifications.
                </p>
              </div>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="space-y-4">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">EcoBuild Construction</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Asheville, NC</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  Sustainable construction and LEED-certified building services
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Verified Sustainable
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Green Growth Consulting</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Portland, OR</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  Sustainability consulting and ESG strategy development
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    B-Corp Certified
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                And many more sustainable businesses waiting to connect...
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" asChild className="group">
            <Link href="/directory">
              Browse Full Directory
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}