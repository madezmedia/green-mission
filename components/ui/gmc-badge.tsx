import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Heart, Star, Leaf, Award, Shield, Globe } from "lucide-react"

const gmcBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gmc-transition uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        
        // GMC Brand Variants - Updated for theme consistency and better contrast
        "gmc-featured": "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary/50 shadow-gmc-sm hover:from-primary/90 hover:to-primary/80",
        "gmc-showcase": "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground border-secondary/50 shadow-gmc-sm hover:from-secondary/90 hover:to-secondary/80",
        "gmc-sustainable": "bg-muted text-muted-foreground border-border hover:bg-muted/80",
        "gmc-local": "bg-accent text-accent-foreground border-accent/50 hover:bg-accent/80",
        "gmc-bcorp": "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
        "gmc-women-owned": "bg-secondary/10 text-secondary-foreground border-secondary/30 hover:bg-secondary/20",
        "gmc-verified": "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        
        // Membership Tiers - Using theme-aware colors
        "tier-basic": "bg-muted text-muted-foreground border-border hover:bg-muted/80",
        "tier-professional": "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
        "tier-enterprise": "bg-secondary/10 text-secondary-foreground border-secondary/30 hover:bg-secondary/20",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5", 
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface GMCBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gmcBadgeVariants> {
  icon?: boolean
}

function GMCBadge({ className, variant, size, icon = true, children, ...props }: GMCBadgeProps) {
  const getIcon = () => {
    if (!icon) return null
    
    switch (variant) {
      case "gmc-featured":
        return <Heart className="h-3 w-3" />
      case "gmc-showcase":
        return <Star className="h-3 w-3" />
      case "gmc-sustainable":
        return <Leaf className="h-3 w-3" />
      case "gmc-local":
        return <Globe className="h-3 w-3" />
      case "gmc-bcorp":
        return <Award className="h-3 w-3" />
      case "gmc-women-owned":
        return <Shield className="h-3 w-3" />
      case "gmc-verified":
        return <Shield className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className={cn(gmcBadgeVariants({ variant, size }), className)} {...props}>
      {getIcon()}
      {children}
    </div>
  )
}

// Predefined badge components for common use cases
export function FeaturedBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-featured" className={className} {...props}>
      Featured
    </GMCBadge>
  )
}

export function ShowcaseBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-showcase" className={className} {...props}>
      Showcase
    </GMCBadge>
  )
}

export function SustainableBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-sustainable" className={className} {...props}>
      Sustainable
    </GMCBadge>
  )
}

export function LocalBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-local" className={className} {...props}>
      Local
    </GMCBadge>
  )
}

export function BCorpBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-bcorp" className={className} {...props}>
      B-Corp
    </GMCBadge>
  )
}

export function WomenOwnedBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-women-owned" className={className} {...props}>
      Women-Owned
    </GMCBadge>
  )
}

export function VerifiedBadge({ className, ...props }: Omit<GMCBadgeProps, 'variant'>) {
  return (
    <GMCBadge variant="gmc-verified" className={className} {...props}>
      Verified
    </GMCBadge>
  )
}

export { GMCBadge, gmcBadgeVariants }