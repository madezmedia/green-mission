"use client"

import { useState } from "react"
import { Logo, PrimaryLogo, StackedLogo, HorizontalLogo, IconOnlyLogo, TextOnlyLogo, UppercaseLogo, LowercaseLogo, TitleCaseLogo, MixedCaseLogo } from "@/components/ui/logo"
import { DigitalBadge, MemberBadge, SupporterBadge, PartnerBadge, VerifiedBadge } from "@/components/ui/digital-badge"
import { GMCCard, GMCCardHeader, GMCCardTitle, GMCCardContent } from "@/components/ui/gmc-card"
import { GMCButton } from "@/components/ui/gmc-button"
import { GMCBadge } from "@/components/ui/gmc-badge"
import { Copy, Download, Eye, Palette } from "lucide-react"

export default function BrandAssetsPage() {
  const [selectedTheme, setSelectedTheme] = useState("default")
  const [copiedCode, setCopiedCode] = useState("")

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(""), 2000)
  }

  const logoVariations = [
    { name: "Primary", component: <PrimaryLogo size="lg" />, code: '<Logo variant="primary" size="lg" />' },
    { name: "Horizontal", component: <HorizontalLogo size="lg" />, code: '<Logo variant="horizontal" size="lg" />' },
    { name: "Stacked", component: <StackedLogo size="lg" />, code: '<Logo variant="stacked" size="lg" />' },
    { name: "Icon Only", component: <IconOnlyLogo size="lg" />, code: '<Logo variant="icon-only" size="lg" />' },
    { name: "Text Only", component: <TextOnlyLogo size="lg" />, code: '<Logo variant="text-only" size="lg" />' },
  ]

  const capitalizationVariations = [
    { name: "Default", component: <Logo size="md" capitalization="default" />, code: '<Logo capitalization="default" />' },
    { name: "Uppercase", component: <UppercaseLogo size="md" />, code: '<Logo capitalization="uppercase" />' },
    { name: "Lowercase", component: <LowercaseLogo size="md" />, code: '<Logo capitalization="lowercase" />' },
    { name: "Title Case", component: <TitleCaseLogo size="md" />, code: '<Logo capitalization="title" />' },
    { name: "Mixed Case", component: <MixedCaseLogo size="md" />, code: '<Logo capitalization="mixed" />' },
  ]

  const sizeVariations = [
    { name: "Extra Small", component: <Logo size="xs" />, code: '<Logo size="xs" />' },
    { name: "Small", component: <Logo size="sm" />, code: '<Logo size="sm" />' },
    { name: "Medium", component: <Logo size="md" />, code: '<Logo size="md" />' },
    { name: "Large", component: <Logo size="lg" />, code: '<Logo size="lg" />' },
    { name: "Extra Large", component: <Logo size="xl" />, code: '<Logo size="xl" />' },
    { name: "2X Large", component: <Logo size="2xl" />, code: '<Logo size="2xl" />' },
  ]

  const badgeTypes = [
    { name: "Member Badge", component: <MemberBadge memberName="John Doe" memberSince="2024" />, code: '<MemberBadge memberName="John Doe" memberSince="2024" />' },
    { name: "Supporter Badge", component: <SupporterBadge memberName="Jane Smith" />, code: '<SupporterBadge memberName="Jane Smith" />' },
    { name: "Partner Badge", component: <PartnerBadge memberName="Eco Company" memberSince="2023" />, code: '<PartnerBadge memberName="Eco Company" memberSince="2023" />' },
    { name: "Verified Badge", component: <VerifiedBadge memberName="Green Business" />, code: '<VerifiedBadge memberName="Green Business" />' },
  ]

  const badgeVariants = [
    { name: "Default", component: <DigitalBadge variant="default" memberName="Sample Member" />, code: '<DigitalBadge variant="default" />' },
    { name: "Minimal", component: <DigitalBadge variant="minimal" memberName="Sample Member" />, code: '<DigitalBadge variant="minimal" />' },
    { name: "Premium", component: <DigitalBadge variant="premium" memberName="Sample Member" />, code: '<DigitalBadge variant="premium" />' },
    { name: "Eco", component: <DigitalBadge variant="eco" memberName="Sample Member" />, code: '<DigitalBadge variant="eco" />' },
  ]

  const badgeSizes = [
    { name: "Small", component: <DigitalBadge size="sm" memberName="Small Badge" />, code: '<DigitalBadge size="sm" />' },
    { name: "Medium", component: <DigitalBadge size="md" memberName="Medium Badge" />, code: '<DigitalBadge size="md" />' },
    { name: "Large", component: <DigitalBadge size="lg" memberName="Large Badge" />, code: '<DigitalBadge size="lg" />' },
    { name: "Extra Large", component: <DigitalBadge size="xl" memberName="XL Badge" />, code: '<DigitalBadge size="xl" />' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Brand Assets</h1>
              <p className="text-muted-foreground">
                Comprehensive logo variations and digital badges for Green Mission Club
              </p>
            </div>
            <div className="flex items-center gap-3">
              <GMCBadge variant="gmc-featured">Brand System</GMCBadge>
              <GMCButton variant="gmc-primary">
                <Download className="h-4 w-4" />
                Download All
              </GMCButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Logo Variations Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Logo Variations</h2>
            <p className="text-muted-foreground">
              Different layout options for the Green Mission Club logo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {logoVariations.map((variation, index) => (
              <GMCCard key={index} variant="gmc-default" className="p-6">
                <GMCCardHeader>
                  <GMCCardTitle className="text-center">{variation.name}</GMCCardTitle>
                </GMCCardHeader>
                <GMCCardContent>
                  <div className="flex items-center justify-center min-h-[120px] mb-4 bg-muted/30 rounded-gmc">
                    {variation.component}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded text-muted-foreground">
                      {variation.code}
                    </code>
                    <GMCButton
                      variant="gmc-minimal"
                      size="sm"
                      onClick={() => copyToClipboard(variation.code, `logo-${index}`)}
                    >
                      {copiedCode === `logo-${index}` ? "✓" : <Copy className="h-3 w-3" />}
                    </GMCButton>
                  </div>
                </GMCCardContent>
              </GMCCard>
            ))}
          </div>
        </section>

        {/* Capitalization Variations */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Text Capitalization</h2>
            <p className="text-muted-foreground">
              Different text formatting options for the logo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capitalizationVariations.map((variation, index) => (
              <GMCCard key={index} variant="gmc-default" className="p-6">
                <GMCCardHeader>
                  <GMCCardTitle className="text-center">{variation.name}</GMCCardTitle>
                </GMCCardHeader>
                <GMCCardContent>
                  <div className="flex items-center justify-center min-h-[80px] mb-4 bg-muted/30 rounded-gmc">
                    {variation.component}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded text-muted-foreground">
                      {variation.code}
                    </code>
                    <GMCButton
                      variant="gmc-minimal"
                      size="sm"
                      onClick={() => copyToClipboard(variation.code, `cap-${index}`)}
                    >
                      {copiedCode === `cap-${index}` ? "✓" : <Copy className="h-3 w-3" />}
                    </GMCButton>
                  </div>
                </GMCCardContent>
              </GMCCard>
            ))}
          </div>
        </section>

        {/* Size Variations */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Size Variations</h2>
            <p className="text-muted-foreground">
              Different size options for various use cases
            </p>
          </div>

          <GMCCard variant="gmc-default" className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {sizeVariations.map((variation, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="flex items-center justify-center min-h-[60px]">
                    {variation.component}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{variation.name}</p>
                    <code className="text-xs text-muted-foreground">{variation.code}</code>
                  </div>
                </div>
              ))}
            </div>
          </GMCCard>
        </section>

        {/* Digital Badges Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Digital Badges</h2>
            <p className="text-muted-foreground">
              Downloadable and embeddable member badges for marketing and recognition
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {badgeTypes.map((badge, index) => (
              <GMCCard key={index} variant="gmc-feature" className="p-6">
                <GMCCardHeader>
                  <GMCCardTitle className="text-center">{badge.name}</GMCCardTitle>
                </GMCCardHeader>
                <GMCCardContent>
                  <div className="flex items-center justify-center mb-4">
                    {badge.component}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded text-muted-foreground">
                      {badge.code}
                    </code>
                    <GMCButton
                      variant="gmc-minimal"
                      size="sm"
                      onClick={() => copyToClipboard(badge.code, `badge-${index}`)}
                    >
                      {copiedCode === `badge-${index}` ? "✓" : <Copy className="h-3 w-3" />}
                    </GMCButton>
                  </div>
                </GMCCardContent>
              </GMCCard>
            ))}
          </div>
        </section>

        {/* Badge Variants */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Badge Variants</h2>
            <p className="text-muted-foreground">
              Different visual styles for digital badges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {badgeVariants.map((variant, index) => (
              <GMCCard key={index} variant="gmc-default" className="p-6">
                <GMCCardHeader>
                  <GMCCardTitle className="text-center">{variant.name}</GMCCardTitle>
                </GMCCardHeader>
                <GMCCardContent>
                  <div className="flex items-center justify-center mb-4">
                    {variant.component}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded text-muted-foreground">
                      {variant.code}
                    </code>
                    <GMCButton
                      variant="gmc-minimal"
                      size="sm"
                      onClick={() => copyToClipboard(variant.code, `variant-${index}`)}
                    >
                      {copiedCode === `variant-${index}` ? "✓" : <Copy className="h-3 w-3" />}
                    </GMCButton>
                  </div>
                </GMCCardContent>
              </GMCCard>
            ))}
          </div>
        </section>

        {/* Badge Sizes */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Badge Sizes</h2>
            <p className="text-muted-foreground">
              Different size options for various contexts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {badgeSizes.map((size, index) => (
              <GMCCard key={index} variant="gmc-default" className="p-6">
                <GMCCardHeader>
                  <GMCCardTitle className="text-center">{size.name}</GMCCardTitle>
                </GMCCardHeader>
                <GMCCardContent>
                  <div className="flex items-center justify-center mb-4">
                    {size.component}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded text-muted-foreground">
                      {size.code}
                    </code>
                    <GMCButton
                      variant="gmc-minimal"
                      size="sm"
                      onClick={() => copyToClipboard(size.code, `size-${index}`)}
                    >
                      {copiedCode === `size-${index}` ? "✓" : <Copy className="h-3 w-3" />}
                    </GMCButton>
                  </div>
                </GMCCardContent>
              </GMCCard>
            ))}
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Usage Guidelines</h2>
            <p className="text-muted-foreground">
              Best practices for using Green Mission Club brand assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GMCCard variant="gmc-feature" className="p-6">
              <GMCCardHeader>
                <GMCCardTitle>Logo Usage</GMCCardTitle>
              </GMCCardHeader>
              <GMCCardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use the primary logo for headers and main branding</li>
                  <li>• Use horizontal layout for wide spaces</li>
                  <li>• Use stacked layout for square or tall spaces</li>
                  <li>• Use icon-only for small spaces or favicons</li>
                  <li>• Maintain clear space around the logo</li>
                  <li>• Don't modify colors or proportions</li>
                </ul>
              </GMCCardContent>
            </GMCCard>

            <GMCCard variant="gmc-feature" className="p-6">
              <GMCCardHeader>
                <GMCCardTitle>Badge Usage</GMCCardTitle>
              </GMCCardHeader>
              <GMCCardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Member badges for official members</li>
                  <li>• Supporter badges for community supporters</li>
                  <li>• Partner badges for business partners</li>
                  <li>• Verified badges for authenticated accounts</li>
                  <li>• Download in appropriate format for use case</li>
                  <li>• Use embed code for websites</li>
                </ul>
              </GMCCardContent>
            </GMCCard>
          </div>
        </section>
      </div>
    </div>
  )
}