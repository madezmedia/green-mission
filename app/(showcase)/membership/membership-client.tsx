"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Check, Star, Zap, Users, Shield, TrendingUp, Leaf, CheckCircle } from 'lucide-react'
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
  Check
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
}

function PlanCard({ plan, isAnnual }: PlanCardProps) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
  const period = isAnnual ? 'year' : 'month'
  
  // Parse features from the string format
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
  })

  return (
    <GMCCard className={`relative h-full transition-all duration-200 hover:shadow-lg ${
      plan.featured ? 'ring-2 ring-primary/50 scale-105 shadow-lg' : 'hover:ring-1 hover:ring-primary/20'
    }`}>
      {plan.featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <GMCBadge variant="default" className="bg-primary text-primary-foreground shadow-md">
            Most Popular
          </GMCBadge>
        </div>
      )}
      
      <div className="p-6 space-y-6">
        {/* Plan Header */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            {plan.planName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {plan.planSubtitle}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center space-y-2">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-4xl font-bold text-foreground">
              ${price}
            </span>
            <span className="text-muted-foreground">
              /{period}
            </span>
          </div>
          {isAnnual && plan.annualSavings && (
            <p className="text-sm text-primary font-medium">
              {plan.annualSavings}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {plan.planDescription}
        </p>

        {/* CTA Button */}
        <GMCButton
          className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          variant={plan.featured ? "gmc-primary" : "gmc-outline"}
          asChild
        >
          <Link href="/join" aria-label={`Get started with ${plan.planName} plan`}>
            Get Started
          </Link>
        </GMCButton>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-sm">
            What's included:
          </h4>
          <ul className="space-y-2" role="list">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="text-sm">
                  <span className="font-medium text-foreground">
                    {feature.title}
                  </span>
                  {feature.description && (
                    <p className="text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GMCCard>
  )
}

function SpecialFeaturesSection({ features }: { features: any[] }) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Special Features Available to All Members
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every membership tier includes access to these powerful features designed to amplify your sustainability impact.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || CheckCircle
            
            return (
              <div
                key={index}
                className="text-center space-y-4 p-6 rounded-lg bg-card border border-border hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <IconComponent className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FAQSection({ faqs }: { faqs: any[] }) {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Get answers to common questions about our membership plans and features.
          </p>
        </div>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-border pb-6 last:border-b-0"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {faq.question}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ title, content }: { title: string; content: string }) {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">
          {title}
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
          {content}
        </p>
        <GMCButton
          variant="gmc-secondary"
          size="lg"
          className="focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary"
          asChild
        >
          <Link href="/join" aria-label="Start your sustainability journey today">
            Start Your Journey Today
          </Link>
        </GMCButton>
      </div>
    </section>
  )
}

export default function MembershipPageClient() {
  const [isAnnual, setIsAnnual] = useState(false)
  
  // Fetch CMS content
  const { pageContent, loading: pageLoading } = usePageContent('membership', true, true)
  const { sections, loading: sectionsLoading } = usePageSections('membership')
  const { plans, loading: plansLoading } = useMembershipPlans(true)

  // Parse sections
  const specialFeaturesSection = sections.find(s => s.sectionSlug === 'special-features')
  const faqSection = sections.find(s => s.sectionSlug === 'faq')
  const ctaSection = sections.find(s => s.sectionSlug === 'pricing-cta')

  let specialFeatures: any[] = []
  let faqs: any[] = []

  try {
    if (specialFeaturesSection?.sectionContent) {
      specialFeatures = JSON.parse(specialFeaturesSection.sectionContent)
    }
    if (faqSection?.sectionContent) {
      faqs = JSON.parse(faqSection.sectionContent)
    }
  } catch (error) {
    console.error('Error parsing section content:', error)
  }

  // Fallback content
  const fallbackContent = {
    heroTitle: "Choose Your Membership Plan",
    heroDescription: "Join thousands of businesses making a positive environmental impact. Select the plan that fits your sustainability goals.",
    specialFeatures: [
      {
        icon: "Leaf",
        title: "Sustainability Scoring",
        description: "Track and showcase your environmental impact with our proprietary scoring system."
      },
      {
        icon: "Shield",
        title: "Certification Showcase",
        description: "Display your sustainability certifications and environmental awards."
      },
      {
        icon: "Users",
        title: "Community Connection",
        description: "Connect with like-minded businesses for partnerships and knowledge sharing."
      }
    ],
    faqs: [
      {
        question: "Can I switch between plans?",
        answer: "Yes! You can upgrade or downgrade your membership at any time."
      },
      {
        question: "Is there a setup fee?",
        answer: "No setup fees ever. Your membership includes everything you need to get started."
      }
    ]
  }

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
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseNavigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            {pageContent?.heroTitle || fallbackContent.heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {pageContent?.heroDescription || fallbackContent.heroDescription}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <label htmlFor="billing-toggle" className="sr-only">
              Switch between monthly and annual billing
            </label>
            <span className={`text-sm transition-colors ${
              !isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              Monthly
            </span>
            <button
              id="billing-toggle"
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={isAnnual}
              aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm transition-colors ${
              isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              Annual
            </span>
            <GMCBadge variant="secondary" className="ml-2">
              Save up to 20%
            </GMCBadge>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(plans.length > 0 ? plans : fallbackPlans).map((plan) => (
              <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Features */}
      {(specialFeatures.length > 0 || fallbackContent.specialFeatures.length > 0) && (
        <SpecialFeaturesSection 
          features={specialFeatures.length > 0 ? specialFeatures : fallbackContent.specialFeatures} 
        />
      )}

      {/* FAQ Section */}
      {(faqs.length > 0 || fallbackContent.faqs.length > 0) && (
        <FAQSection 
          faqs={faqs.length > 0 ? faqs : fallbackContent.faqs} 
        />
      )}

      {/* CTA Section */}
      {ctaSection && (
        <CTASection 
          title={ctaSection.sectionTitle}
          content={ctaSection.sectionContent || ''}
        />
      )}

      <ShowcaseFooter />
    </div>
  )
}