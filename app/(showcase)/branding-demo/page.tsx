import { GMCButton } from "@/components/ui/gmc-button"
import { GMCCard, GMCCardContent, GMCCardDescription, GMCCardFooter, GMCCardHeader, GMCCardTitle } from "@/components/ui/gmc-card"
import { GMCBadge, FeaturedBadge, ShowcaseBadge, SustainableBadge, LocalBadge, BCorpBadge, WomenOwnedBadge, VerifiedBadge } from "@/components/ui/gmc-badge"
import { BasicThemeSwitcher } from "@/components/basic-theme-switcher"
import { Separator } from "@/components/ui/separator"
import { Leaf, Heart, Star, Award, Globe, Shield } from "lucide-react"

export default function BrandingDemoPage() {
  return (
    <div className="min-h-screen bg-background gmc-geometric-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="gmc-heading-md font-bold text-foreground">
              Green Mission Club
            </h1>
            <span className="gmc-body-sm text-muted-foreground">
              Branding Demo
            </span>
          </div>
          <BasicThemeSwitcher />
        </div>
      </header>

      <div className="container max-w-screen-2xl mx-auto px-4 py-8 space-y-12">
        
        {/* Typography Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="gmc-heading-lg text-foreground">Typography System</h2>
            <p className="gmc-body-md text-muted-foreground">
              Clean, geometric typography reflecting our sustainable mission.
            </p>
          </div>
          
          <GMCCard variant="gmc-feature" accent>
            <GMCCardContent className="space-y-4">
              <h1 className="gmc-heading-xl text-foreground">Extra Large Heading</h1>
              <h2 className="gmc-heading-lg text-foreground">Large Heading</h2>
              <h3 className="gmc-heading-md text-foreground">Medium Heading</h3>
              <h4 className="gmc-heading-sm text-foreground">Small Heading</h4>
              <h5 className="gmc-heading-xs text-foreground">Extra Small Heading</h5>
              <Separator />
              <p className="gmc-body-lg text-foreground">Large body text for important content and hero sections.</p>
              <p className="gmc-body-md text-foreground">Medium body text for general content and descriptions.</p>
              <p className="gmc-body-sm text-muted-foreground">Small body text for captions and secondary information.</p>
              <p className="gmc-body-xs text-muted-foreground">Extra small text for fine print and metadata.</p>
            </GMCCardContent>
          </GMCCard>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="gmc-heading-lg text-foreground">Color Palettes</h2>
            <p className="gmc-body-md text-muted-foreground">
              Four distinct palettes representing different aspects of sustainability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Forest Theme */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-gmc-forest-600" />
                  Forest Green
                </GMCCardTitle>
                <GMCCardDescription>
                  Primary brand palette representing growth and nature.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent className="space-y-2">
                <div className="grid grid-cols-5 gap-1">
                  <div className="h-8 bg-gmc-forest-50 rounded border"></div>
                  <div className="h-8 bg-gmc-forest-200 rounded"></div>
                  <div className="h-8 bg-gmc-forest-400 rounded"></div>
                  <div className="h-8 bg-gmc-forest-600 rounded"></div>
                  <div className="h-8 bg-gmc-forest-800 rounded"></div>
                </div>
              </GMCCardContent>
            </GMCCard>

            {/* Ocean Theme */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gmc-ocean-600" />
                  Ocean Blue
                </GMCCardTitle>
                <GMCCardDescription>
                  Trust and reliability, representing clean water initiatives.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent className="space-y-2">
                <div className="grid grid-cols-5 gap-1">
                  <div className="h-8 bg-gmc-ocean-50 rounded border"></div>
                  <div className="h-8 bg-gmc-ocean-200 rounded"></div>
                  <div className="h-8 bg-gmc-ocean-400 rounded"></div>
                  <div className="h-8 bg-gmc-ocean-600 rounded"></div>
                  <div className="h-8 bg-gmc-ocean-800 rounded"></div>
                </div>
              </GMCCardContent>
            </GMCCard>

            {/* Earth Theme */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gmc-earth-600" />
                  Earth Tone
                </GMCCardTitle>
                <GMCCardDescription>
                  Grounded and natural, representing soil and agriculture.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent className="space-y-2">
                <div className="grid grid-cols-5 gap-1">
                  <div className="h-8 bg-gmc-earth-50 rounded border"></div>
                  <div className="h-8 bg-gmc-earth-200 rounded"></div>
                  <div className="h-8 bg-gmc-earth-400 rounded"></div>
                  <div className="h-8 bg-gmc-earth-600 rounded"></div>
                  <div className="h-8 bg-gmc-earth-800 rounded"></div>
                </div>
              </GMCCardContent>
            </GMCCard>

            {/* Sunset Theme */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gmc-sunset-600" />
                  Sunset Orange
                </GMCCardTitle>
                <GMCCardDescription>
                  Energy and growth, representing renewable energy.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent className="space-y-2">
                <div className="grid grid-cols-5 gap-1">
                  <div className="h-8 bg-gmc-sunset-50 rounded border"></div>
                  <div className="h-8 bg-gmc-sunset-200 rounded"></div>
                  <div className="h-8 bg-gmc-sunset-400 rounded"></div>
                  <div className="h-8 bg-gmc-sunset-600 rounded"></div>
                  <div className="h-8 bg-gmc-sunset-800 rounded"></div>
                </div>
              </GMCCardContent>
            </GMCCard>
          </div>
        </section>

        {/* Button Variants Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="gmc-heading-lg text-foreground">Button System</h2>
            <p className="gmc-body-md text-muted-foreground">
              Consistent button styles with subtle hover animations and geometric design.
            </p>
          </div>
          
          <GMCCard variant="gmc-feature" accent>
            <GMCCardContent className="space-y-8">
              {/* Primary Buttons */}
              <div className="space-y-4">
                <h3 className="gmc-heading-sm text-foreground">Primary Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <GMCButton variant="gmc-primary" size="sm">Small Primary</GMCButton>
                  <GMCButton variant="gmc-primary" size="md">Medium Primary</GMCButton>
                  <GMCButton variant="gmc-primary" size="lg">Large Primary</GMCButton>
                  <GMCButton variant="gmc-primary" size="xl">Extra Large</GMCButton>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-4">
                <h3 className="gmc-heading-sm text-foreground">Secondary Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <GMCButton variant="gmc-secondary">Secondary</GMCButton>
                  <GMCButton variant="gmc-outline">Outline</GMCButton>
                  <GMCButton variant="gmc-minimal">Minimal</GMCButton>
                  <GMCButton variant="gmc-accent">Accent</GMCButton>
                </div>
              </div>

              {/* Theme Variants */}
              <div className="space-y-4">
                <h3 className="gmc-heading-sm text-foreground">Theme Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <GMCButton variant="ocean-primary">Ocean Theme</GMCButton>
                  <GMCButton variant="earth-primary">Earth Theme</GMCButton>
                  <GMCButton variant="sunset-primary">Sunset Theme</GMCButton>
                </div>
              </div>
            </GMCCardContent>
          </GMCCard>
        </section>

        {/* Badge System Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="gmc-heading-lg text-foreground">Badge System</h2>
            <p className="gmc-body-md text-muted-foreground">
              Semantic badges for business classifications and achievements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Member Status Badges */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle>Member Status</GMCCardTitle>
                <GMCCardDescription>
                  Recognition badges for member achievements and features.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <FeaturedBadge />
                  <ShowcaseBadge />
                  <VerifiedBadge />
                </div>
              </GMCCardContent>
            </GMCCard>

            {/* Business Tags */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle>Business Tags</GMCCardTitle>
                <GMCCardDescription>
                  Sustainability and business practice indicators.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <SustainableBadge />
                  <LocalBadge />
                  <BCorpBadge />
                  <WomenOwnedBadge />
                </div>
              </GMCCardContent>
            </GMCCard>
          </div>
        </section>

        {/* Card Variants Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="gmc-heading-lg text-foreground">Card Components</h2>
            <p className="gmc-body-md text-muted-foreground">
              Geometric card designs with subtle shadows and hover effects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Default Card */}
            <GMCCard variant="gmc-default">
              <GMCCardHeader>
                <GMCCardTitle>Default Card</GMCCardTitle>
                <GMCCardDescription>
                  Standard card with subtle border and hover effects.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent>
                <p className="gmc-body-sm text-muted-foreground">
                  Perfect for general content and member listings.
                </p>
              </GMCCardContent>
              <GMCCardFooter>
                <GMCButton variant="gmc-outline" size="sm">Learn More</GMCButton>
              </GMCCardFooter>
            </GMCCard>

            {/* Feature Card */}
            <GMCCard variant="gmc-feature" accent>
              <GMCCardHeader>
                <GMCCardTitle>Feature Card</GMCCardTitle>
                <GMCCardDescription>
                  Enhanced card with gradient background and accent line.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent>
                <p className="gmc-body-sm text-muted-foreground">
                  Ideal for highlighting important features and announcements.
                </p>
              </GMCCardContent>
              <GMCCardFooter>
                <GMCButton variant="gmc-primary" size="sm">Get Started</GMCButton>
              </GMCCardFooter>
            </GMCCard>

            {/* Showcase Card */}
            <GMCCard variant="gmc-showcase">
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gmc-forest-600" />
                  Showcase Card
                </GMCCardTitle>
                <GMCCardDescription>
                  Premium card design for featured members.
                </GMCCardDescription>
              </GMCCardHeader>
              <GMCCardContent>
                <p className="gmc-body-sm text-muted-foreground">
                  Special highlighting for showcase members and premium content.
                </p>
              </GMCCardContent>
              <GMCCardFooter className="gap-2">
                <ShowcaseBadge size="sm" />
                <FeaturedBadge size="sm" />
              </GMCCardFooter>
            </GMCCard>
          </div>
        </section>

        {/* Brand Philosophy Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="gmc-heading-lg text-foreground">Brand Philosophy</h2>
            <p className="gmc-body-md text-muted-foreground">
              Our design principles reflect our commitment to sustainability and community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GMCCard variant="gmc-feature" accent>
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-gmc-forest-600" />
                  Geometric Minimalism
                </GMCCardTitle>
              </GMCCardHeader>
              <GMCCardContent className="space-y-4">
                <p className="gmc-body-md text-foreground">
                  Clean lines and subtle polygon patterns reflect the precision of sustainable practices.
                </p>
                <div className="h-16 bg-gradient-to-r from-gmc-forest-100 to-gmc-forest-200 rounded-gmc gmc-geometric-pattern"></div>
              </GMCCardContent>
            </GMCCard>

            <GMCCard variant="gmc-feature" accent>
              <GMCCardHeader>
                <GMCCardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-gmc-forest-600" />
                  Professional Sustainability
                </GMCCardTitle>
              </GMCCardHeader>
              <GMCCardContent className="space-y-4">
                <p className="gmc-body-md text-foreground">
                  Sophisticated green-focused design that maintains business credibility.
                </p>
                <div className="flex gap-2">
                  <div className="h-4 flex-1 bg-gmc-forest-600 rounded"></div>
                  <div className="h-4 flex-1 bg-gmc-forest-500 rounded"></div>
                  <div className="h-4 flex-1 bg-gmc-forest-400 rounded"></div>
                </div>
              </GMCCardContent>
            </GMCCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-8">
          <Separator className="mb-8" />
          <div className="text-center space-y-4">
            <p className="gmc-body-lg font-semibold text-foreground">
              Green Mission Club
            </p>
            <p className="gmc-body-sm text-muted-foreground">
              Connecting eco-conscious businesses for a sustainable future.
            </p>
            <div className="flex justify-center gap-2">
              <SustainableBadge size="sm" />
              <LocalBadge size="sm" />
              <BCorpBadge size="sm" />
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}