"use client"

import { useState, useEffect } from "react"
import { Check, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { GMCButton } from "@/components/ui/gmc-button"
import { GMCCard } from "@/components/ui/gmc-card"
import { GMCBadge } from "@/components/ui/gmc-badge"
import { useMembershipPlans } from "@/lib/hooks/use-cms-content"

interface PlanCardProps {
  plan: {
    id: string
    planName: string
    planSubtitle: string
    monthlyPrice: number
    annualPrice: number
    annualSavings: string
    planDescription: string
    features: string
    featured?: boolean
  }
}

function PlanCard({ plan }: PlanCardProps) {
  // Parse features from the string format and limit to top 3 for homepage preview
  const features = plan.features.split('\n').filter(f => f.trim()).map(feature => {
    const match = feature.match(/🚀\s*(.+):\s*(.+)/)
    if (match) {
      return {
        title: match[1].trim(),
        description: match[2].trim()
      }
    }
    return {
      title: feature.replace(/🚀\s*/, '').trim(),
      description: ''
    }
  }).slice(0, 3) // Limit to 3 features for homepage preview

  return (
    <GMCCard className={`relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
      plan.featured
        ? "border-primary ring-4 ring-primary/10 scale-105 shadow-lg"
        : "border-border hover:border-primary/30"
    }`}>
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <GMCBadge variant="default" className="bg-primary text-primary-foreground shadow-md">
            <Star className="inline w-3 h-3 mr-1" />
            Most Popular
          </GMCBadge>
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {/* Plan Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            {plan.planName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {plan.planSubtitle}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-2">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-3xl font-bold text-foreground">
              ${plan.monthlyPrice}
            </span>
            <span className="text-muted-foreground text-sm">
              /month
            </span>
          </div>
          {plan.annualSavings && (
            <p className="text-xs text-primary font-medium">
              {plan.annualSavings}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {plan.planDescription}
        </p>

        {/* Top Features Preview */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-sm">
            Key Features:
          </h4>
          <ul className="space-y-2" role="list">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">
                  {feature.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <GMCButton
          className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          variant={plan.featured ? "gmc-primary" : "gmc-outline"}
          asChild
        >
          <Link href="/membership" aria-label={`Learn more about ${plan.planName} plan`}>
            Learn More
          </Link>
        </GMCButton>
      </div>
    </GMCCard>
  )
}

export default function MembershipSection() {
  const { plans, loading, error } = useMembershipPlans(true)
  
  // Fallback plans for when CMS is not available
  const fallbackPlans = [
    {
      id: "basic",
      planName: "Basic Membership",
      planSubtitle: "Perfect for Small Businesses",
      monthlyPrice: 29,
      annualPrice: 290,
      annualSavings: "Save $58 annually",
      planDescription: "Essential tools for small businesses starting their sustainability journey.",
      features: "🚀 Business Profile: Professional listing in our sustainable business directory\n🚀 Basic Analytics: Track your environmental impact and business growth\n🚀 Community Access: Join discussions and connect with other sustainable businesses",
      featured: false
    },
    {
      id: "professional",
      planName: "Professional Membership",
      planSubtitle: "Most Popular for Growing Companies",
      monthlyPrice: 79,
      annualPrice: 790,
      annualSavings: "Save $158 annually",
      planDescription: "Advanced features for established businesses ready to amplify their sustainable impact.",
      features: "🚀 Enhanced Profile: Priority placement in search results and featured listings\n🚀 Advanced Analytics: Detailed sustainability metrics and impact reporting\n🚀 Marketing Tools: Downloadable certificates, badges, and promotional materials",
      featured: true
    },
    {
      id: "enterprise",
      planName: "Enterprise Membership",
      planSubtitle: "For Industry Leaders",
      monthlyPrice: 149,
      annualPrice: 1490,
      annualSavings: "Save $298 annually",
      planDescription: "Comprehensive solutions for organizations leading sustainability initiatives.",
      features: "🚀 Custom Branding: Showcase your brand with custom profile themes\n🚀 Partnership Network: Access exclusive partnership opportunities\n🚀 Dedicated Support: Priority support with dedicated account management",
      featured: false
    }
  ]

  // Use CMS plans if available, otherwise fallback
  const displayPlans = plans.length > 0 ? plans : fallbackPlans
  
  // Limit to 4 plans for homepage preview (updated from 3 to 4)
  const previewPlans = displayPlans.slice(0, 4)

  return (
    <section id="pricing" className="bg-muted/20 py-8 md:py-12 transition-all duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl mb-4">
            Choose Your Membership
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join the Green Mission community and connect with like-minded sustainable businesses.
            Every plan includes access to our growing network of eco-conscious partners.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-2xl h-96"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Unable to load pricing plans at the moment.
            </p>
            <GMCButton variant="gmc-outline" asChild>
              <Link href="/membership">
                View Membership Plans
              </Link>
            </GMCButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {previewPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center space-y-4">
          <GMCButton size="lg" variant="gmc-outline" asChild>
            <Link href="/membership" className="inline-flex items-center gap-2">
              Compare All Plans & Features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </GMCButton>
          <p className="text-sm text-muted-foreground">
            See detailed feature comparisons, pricing options, and member benefits
          </p>
        </div>
      </div>
    </section>
  )
}
