"use client"

import Link from "next/link"
import { GMCButton } from "@/components/ui/gmc-button"
import { ChevronRight, Sparkles, ArrowDown, Leaf } from "lucide-react"
import { useSettingValue } from "@/lib/hooks/use-cms-content"

export default function HeroSection() {
  const { value: heroTitle, loading: titleLoading } = useSettingValue("hero_title")
  const { value: heroDescription, loading: descLoading } = useSettingValue("hero_description")
  const { value: heroBadgeText, loading: badgeLoading } = useSettingValue("hero_badge_text")

  const displayTitle = heroTitle || "Connect with Eco-Conscious Businesses"
  const displayDescription = heroDescription || "Join the largest network of sustainable businesses committed to environmental responsibility and business success. Build meaningful connections that drive positive change for our planet."
  const displayBadgeText = heroBadgeText || "Join 500+ sustainable businesses"

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="gmc-geometric-pattern absolute inset-0"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-gmc-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-gmc-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/20 rounded-full blur-lg animate-gmc-pulse delay-500"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Badge */}
          <div className="flex justify-center animate-gmc-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted border border-border px-6 py-3 text-sm font-medium gmc-transition hover:bg-accent/50">
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">
                {badgeLoading ? "Loading..." : displayBadgeText}
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 animate-gmc-fade-in delay-200">
            <h1 className="gmc-heading-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              {titleLoading ? (
                "Loading..."
              ) : (
                <>
                  Connect with{" "}
                  <span className="relative inline-block">
                    <span className="text-primary">Eco-Conscious</span>
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
                  </span>{" "}
                  Businesses
                </>
              )}
            </h1>
          </div>

          {/* Description */}
          <div className="animate-gmc-fade-in delay-400">
            <p className="gmc-body-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed">
              {descLoading ? "Loading..." : displayDescription}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-gmc-fade-in delay-600">
            <GMCButton
              variant="gmc-primary"
              size="lg"
              className="group gmc-hover-lift"
              asChild
            >
              <Link href="/join">
                Join Network
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 gmc-transition" />
              </Link>
            </GMCButton>
            
            <GMCButton
              variant="gmc-outline"
              size="lg"
              className="group gmc-hover-lift"
              asChild
            >
              <Link href="/directory">
                Explore Directory
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 gmc-transition" />
              </Link>
            </GMCButton>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center pt-8 animate-gmc-fade-in delay-800">
            <GMCButton
              variant="gmc-minimal"
              size="sm"
              className="group text-muted-foreground hover:text-foreground"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              <ArrowDown className="h-4 w-4 group-hover:translate-y-1 gmc-transition animate-bounce" />
              <span className="ml-2">Discover Features</span>
            </GMCButton>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm text-muted-foreground animate-gmc-fade-in delay-1000">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-gmc-pulse"></div>
              <span>500+ Active Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-gmc-pulse delay-300"></div>
              <span>25+ Industries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-gmc-pulse delay-600"></div>
              <span>95% Satisfaction Rate</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
