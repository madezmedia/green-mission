"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Star, Zap, Users, Shield, TrendingUp, Leaf, CheckCircle, Crown, Loader2 } from 'lucide-react'
import ShowcaseNavigation from '@/components/showcase/showcase-navigation'
import ShowcaseFooter from '@/components/showcase/showcase-footer'
import { GMCButton } from '@/components/ui/gmc-button'
import { GMCCard } from '@/components/ui/gmc-card'
import { GMCBadge } from '@/components/ui/gmc-badge'
import { usePageContent, usePageSections, useMembershipPlans } from '@/lib/hooks/use-cms-content'

// Icon mapping for features
const iconMap = {
  Leaf,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Zap,
  Check,
  Crown
}

interface PaymentLinks {
  [key: string]: {
    url: string
    id: string
  }
}

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
  isAnnual: boolean
  paymentLinks: PaymentLinks
}

function PlanCard({ plan, isAnnual, paymentLinks }: PlanCardProps) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
  const period = isAnnual ? 'year' : 'month'
  
  // Get payment link for this plan and billing period
  const linkKey = `${plan.id}_${isAnnual ? "yearly" : "monthly"}`
  const paymentLink = paymentLinks[linkKey]
  
  // Parse features from the string format - limit to 4 features for compact layout
  const allFeatures = plan.features.split('\n').filter(f => f.trim()).map(feature => {
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
  })
  
  // Limit to 4 features for compact layout
  const features = allFeatures.slice(0, 4)

  return (
    <GMCCard className={`relative transition-all duration-200 hover:shadow-lg ${
      plan.featured ? 'ring-2 ring-primary/50 scale-105 shadow-lg' : 'hover:ring-1 hover:ring-primary/20'
    }`} style={{ height: '50vh', minHeight: '400px' }}>
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <GMCBadge variant="default" className="bg-primary text-primary-foreground shadow-md">
            Most Popular
          </GMCBadge>
        </div>
      )}
      
      <div className="p-4 space-y-4 h-full flex flex-col">
        {/* Plan Header */}
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-foreground">
            {plan.planName}
          </h3>
          <p className="text-xs text-muted-foreground">
            {plan.planSubtitle}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-1">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-3xl font-bold text-foreground">
              ${price}
            </span>
            <span className="text-muted-foreground text-sm">
              /{period}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          {plan.planDescription}
        </p>

        {/* CTA Button */}
        <GMCButton
          className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          variant={plan.featured ? "gmc-primary" : "gmc-outline"}
          onClick={() => {
            if (paymentLink?.url) {
              window.location.href = paymentLink.url
            }
          }}
          disabled={!paymentLink?.url}
        >
          {paymentLink?.url ? "Get Started" : "Coming Soon"}
        </GMCButton>

        {/* Features - Compact */}
        <div className="space-y-2 flex-1">
          <h4 className="font-semibold text-foreground text-xs">
            What's included:
          </h4>
          <ul className="space-y-1" role="list">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">
                  {feature.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GMCCard>
  )
}


export default function MembershipPageClient() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinks>({})
  const [loading, setLoading] = useState(true)
  
  // Fetch CMS content
  const { pageContent, loading: pageLoading } = usePageContent('membership', true, true)
  const { plans, loading: plansLoading } = useMembershipPlans(true)

  // Fetch payment links
  useEffect(() => {
    async function fetchPaymentLinks() {
      try {
        const response = await fetch("/api/stripe/payment-links")
        const data = await response.json()

        if (data.success) {
          setPaymentLinks(data.paymentLinks)
        }
      } catch (error) {
        console.error("Failed to fetch payment links:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentLinks()
  }, [])

  // Fallback content
  const fallbackContent = {
    heroTitle: "Join the Green Mission",
    heroDescription: "Connect with like-minded sustainable businesses, showcase your eco-friendly practices, and grow your network in the green economy."
  }

  const fallbackPlans = [
    {
      id: "basic",
      planName: "Basic",
      planSubtitle: "Perfect for small sustainable businesses getting started",
      monthlyPrice: 29,
      annualPrice: 290,
      annualSavings: "Save $58 annually",
      planDescription: "Essential tools for small businesses starting their sustainability journey.",
      features: "🚀 Directory Listing\n🚀 Basic Business Profile\n🚀 Community Access\n🚀 Monthly Newsletter\n🚀 Sustainability Badge",
      featured: false
    },
    {
      id: "premium",
      planName: "Premium",
      planSubtitle: "Ideal for growing businesses ready to expand their reach",
      monthlyPrice: 59,
      annualPrice: 590,
      annualSavings: "Save $118 annually",
      planDescription: "Advanced features for established businesses ready to amplify their sustainable impact.",
      features: "🚀 Featured Directory Listing\n🚀 Enhanced Business Profile\n🚀 Priority Support\n🚀 Exclusive Content Access\n🚀 Event Invitations",
      featured: true
    },
    {
      id: "enterprise",
      planName: "Enterprise",
      planSubtitle: "Comprehensive solution for established sustainable companies",
      monthlyPrice: 99,
      annualPrice: 990,
      annualSavings: "Save $198 annually",
      planDescription: "Comprehensive solution for established sustainable companies.",
      features: "🚀 Spotlight Features\n🚀 Custom Branding Options\n🚀 Advanced Analytics\n🚀 Partnership Opportunities\n🚀 Dedicated Account Manager",
      featured: false
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ShowcaseNavigation />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading membership plans...</p>
          </div>
        </div>
        <ShowcaseFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <ShowcaseNavigation />
      
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              {pageContent?.heroTitle || fallbackContent.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {pageContent?.heroDescription || fallbackContent.heroDescription}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans - Compact 4-field layout */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {(plans.length > 0 ? plans : fallbackPlans).map((plan) => (
              <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} paymentLinks={paymentLinks} />
            ))}
          </div>
        </div>
      </section>

      <ShowcaseFooter />
    </div>
  )
}