"use client"

import { BasicThemeSwitcher } from "@/components/basic-theme-switcher"
import { GMCButton } from "@/components/ui/gmc-button"
import { GMCCard, GMCCardContent, GMCCardHeader, GMCCardTitle, GMCCardDescription } from "@/components/ui/gmc-card"
import { GMCBadge, FeaturedBadge, SustainableBadge, LocalBadge } from "@/components/ui/gmc-badge"
import { useState } from "react"

export default function ThemeTestPage() {
  const [currentTheme, setCurrentTheme] = useState('gmc-forest-light')

  const applyTheme = (theme: string) => {
    setCurrentTheme(theme)
    document.documentElement.className = theme
  }

  return (
    <div className="min-h-screen p-8 bg-background text-foreground gmc-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="gmc-heading-xl">GMC Brand Design System</h1>
          <p className="gmc-body-lg text-muted-foreground">Testing the Green Mission Club brand-aligned theme system with improved contrast and accessibility</p>
        </div>

        {/* Theme Switcher */}
        <GMCCard variant="gmc-feature" className="text-center">
          <GMCCardHeader>
            <GMCCardTitle>Theme Switcher</GMCCardTitle>
            <GMCCardDescription>Test all theme variants with the new GMC brand colors</GMCCardDescription>
          </GMCCardHeader>
          <GMCCardContent>
            <div className="flex justify-center mb-4">
              <BasicThemeSwitcher />
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Current theme: <code className="bg-muted px-2 py-1 rounded font-mono">{currentTheme}</code></div>
              <div>HTML classes: <code className="bg-muted px-2 py-1 rounded font-mono">{typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}</code></div>
            </div>
          </GMCCardContent>
        </GMCCard>

        {/* Typography Test */}
        <GMCCard variant="gmc-showcase">
          <GMCCardHeader>
            <GMCCardTitle>GMC Typography Hierarchy</GMCCardTitle>
            <GMCCardDescription>Brand-aligned typography with proper contrast ratios</GMCCardDescription>
          </GMCCardHeader>
          <GMCCardContent className="space-y-4">
            <div className="gmc-heading-xl">Heading XL - Brand Headlines</div>
            <div className="gmc-heading-lg">Heading Large - Section Titles</div>
            <div className="gmc-heading-md">Heading Medium - Subsections</div>
            <div className="gmc-heading-sm">Heading Small - Card Titles</div>
            <div className="gmc-heading-xs">Heading XSmall - Component Headers</div>
            <div className="gmc-body-lg">Body Large - Important content with enhanced readability</div>
            <div className="gmc-body-md">Body Medium - Standard paragraph text for optimal reading experience</div>
            <div className="gmc-body-sm">Body Small - Secondary information and captions</div>
            <div className="gmc-body-xs">Body XSmall - Fine print and metadata</div>
          </GMCCardContent>
        </GMCCard>

        {/* Color & Component Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Theme Colors */}
          <GMCCard variant="gmc-default">
            <GMCCardHeader>
              <GMCCardTitle>Theme Colors</GMCCardTitle>
              <GMCCardDescription>Semantic colors with improved contrast</GMCCardDescription>
            </GMCCardHeader>
            <GMCCardContent className="space-y-3">
              <div className="h-10 bg-primary rounded flex items-center px-3 text-primary-foreground text-sm font-medium">Primary - Main brand color</div>
              <div className="h-10 bg-secondary rounded flex items-center px-3 text-secondary-foreground text-sm font-medium">Secondary - Supporting color</div>
              <div className="h-10 bg-accent rounded flex items-center px-3 text-accent-foreground text-sm font-medium">Accent - Highlight color</div>
              <div className="h-10 bg-muted rounded flex items-center px-3 text-muted-foreground text-sm font-medium">Muted - Subtle backgrounds</div>
            </GMCCardContent>
          </GMCCard>

          {/* GMC Brand Colors */}
          <GMCCard variant="gmc-default">
            <GMCCardHeader>
              <GMCCardTitle>GMC Brand Palette</GMCCardTitle>
              <GMCCardDescription>Core brand colors from the logo</GMCCardDescription>
            </GMCCardHeader>
            <GMCCardContent className="space-y-2">
              <div className="h-8 bg-gmc-forest-600 rounded flex items-center px-3 text-white text-xs font-medium">Forest Dark #2d4a3a</div>
              <div className="h-8 bg-gmc-forest-500 rounded flex items-center px-3 text-white text-xs font-medium">Forest Medium #4a6b5c</div>
              <div className="h-8 bg-gmc-forest-400 rounded flex items-center px-3 text-white text-xs font-medium">Sage Light #7ba688</div>
              <div className="h-8 bg-gmc-forest-300 rounded flex items-center px-3 text-gmc-forest-700 text-xs font-medium">Mint Soft #a8c8b3</div>
              <div className="h-8 bg-gmc-forest-100 rounded flex items-center px-3 text-gmc-forest-700 text-xs font-medium">Cream Warm #f4f2ef</div>
              <div className="h-8 bg-gmc-forest-50 rounded flex items-center px-3 text-gmc-forest-700 text-xs font-medium">Cream BG #f8f6f3</div>
            </GMCCardContent>
          </GMCCard>

          {/* Buttons */}
          <GMCCard variant="gmc-default">
            <GMCCardHeader>
              <GMCCardTitle>GMC Buttons</GMCCardTitle>
              <GMCCardDescription>Brand-aligned button variants</GMCCardDescription>
            </GMCCardHeader>
            <GMCCardContent className="space-y-3">
              <GMCButton variant="gmc-primary" className="w-full">Primary Action</GMCButton>
              <GMCButton variant="gmc-secondary" className="w-full">Secondary Action</GMCButton>
              <GMCButton variant="gmc-outline" className="w-full">Outline Style</GMCButton>
              <GMCButton variant="gmc-minimal" className="w-full">Minimal Style</GMCButton>
            </GMCCardContent>
          </GMCCard>

          {/* Badges */}
          <GMCCard variant="gmc-default">
            <GMCCardHeader>
              <GMCCardTitle>GMC Badges</GMCCardTitle>
              <GMCCardDescription>Brand badges with geometric styling</GMCCardDescription>
            </GMCCardHeader>
            <GMCCardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <FeaturedBadge />
                <SustainableBadge />
                <LocalBadge />
                <GMCBadge variant="gmc-verified">Verified</GMCBadge>
                <GMCBadge variant="tier-professional">Professional</GMCBadge>
              </div>
            </GMCCardContent>
          </GMCCard>

          {/* Card Variants */}
          <GMCCard variant="gmc-feature" accent>
            <GMCCardHeader>
              <GMCCardTitle>Featured Card</GMCCardTitle>
              <GMCCardDescription>Enhanced card with accent border</GMCCardDescription>
            </GMCCardHeader>
            <GMCCardContent>
              <p className="gmc-body-sm">This card demonstrates the featured variant with gradient background and accent border.</p>
            </GMCCardContent>
          </GMCCard>

          {/* Accessibility Info */}
          <GMCCard variant="gmc-showcase">
            <GMCCardHeader>
              <GMCCardTitle>Accessibility</GMCCardTitle>
              <GMCCardDescription>WCAG compliant contrast ratios</GMCCardDescription>
            </GMCCardHeader>
            <GMCCardContent className="space-y-2">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Primary on Background:</span>
                  <span className="font-mono text-xs">AA+ ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Secondary on Background:</span>
                  <span className="font-mono text-xs">AA+ ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Muted Text:</span>
                  <span className="font-mono text-xs">AA ✓</span>
                </div>
              </div>
            </GMCCardContent>
          </GMCCard>

        </div>

        {/* CSS Variables Test */}
        <GMCCard variant="gmc-minimal">
          <GMCCardHeader>
            <GMCCardTitle>CSS Variables Test</GMCCardTitle>
            <GMCCardDescription>Direct CSS variable usage for theme consistency</GMCCardDescription>
          </GMCCardHeader>
          <GMCCardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-foreground">--primary</div>
                <div className="h-12 bg-[hsl(var(--primary))] rounded border border-border flex items-center justify-center">
                  <span className="text-[hsl(var(--primary-foreground))] text-xs font-medium">Primary</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--secondary</div>
                <div className="h-12 bg-[hsl(var(--secondary))] rounded border border-border flex items-center justify-center">
                  <span className="text-[hsl(var(--secondary-foreground))] text-xs font-medium">Secondary</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--accent</div>
                <div className="h-12 bg-[hsl(var(--accent))] rounded border border-border flex items-center justify-center">
                  <span className="text-[hsl(var(--accent-foreground))] text-xs font-medium">Accent</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--muted</div>
                <div className="h-12 bg-[hsl(var(--muted))] rounded border border-border flex items-center justify-center">
                  <span className="text-[hsl(var(--muted-foreground))] text-xs font-medium">Muted</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--background</div>
                <div className="h-12 bg-[hsl(var(--background))] rounded border border-border flex items-center justify-center">
                  <span className="text-[hsl(var(--foreground))] text-xs font-medium">Background</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--card</div>
                <div className="h-12 bg-[hsl(var(--card))] rounded border border-border flex items-center justify-center">
                  <span className="text-[hsl(var(--card-foreground))] text-xs font-medium">Card</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--border</div>
                <div className="h-12 bg-[hsl(var(--border))] rounded border-2 border-[hsl(var(--border))] flex items-center justify-center">
                  <span className="text-foreground text-xs font-medium">Border</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-foreground">--ring</div>
                <div className="h-12 bg-background rounded border border-border flex items-center justify-center ring-2 ring-[hsl(var(--ring))] ring-offset-2 ring-offset-background">
                  <span className="text-foreground text-xs font-medium">Ring</span>
                </div>
              </div>
            </div>
          </GMCCardContent>
        </GMCCard>

        {/* Theme Comparison */}
        <GMCCard variant="gmc-default">
          <GMCCardHeader>
            <GMCCardTitle>Theme Switching Test</GMCCardTitle>
            <GMCCardDescription>Quick theme switching buttons for testing</GMCCardDescription>
          </GMCCardHeader>
          <GMCCardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-forest-light')}
                className="w-full"
              >
                Forest Light
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-forest-dark')}
                className="w-full"
              >
                Forest Dark
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-ocean-light')}
                className="w-full"
              >
                Ocean Light
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-ocean-dark')}
                className="w-full"
              >
                Ocean Dark
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-earth-light')}
                className="w-full"
              >
                Earth Light
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-earth-dark')}
                className="w-full"
              >
                Earth Dark
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-sunset-light')}
                className="w-full"
              >
                Sunset Light
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => applyTheme('gmc-sunset-dark')}
                className="w-full"
              >
                Sunset Dark
              </GMCButton>
            </div>
          </GMCCardContent>
        </GMCCard>

      </div>
    </div>
  )
}