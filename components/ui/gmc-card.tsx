import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gmcCardVariants = cva(
  "rounded-gmc border bg-card text-card-foreground shadow-gmc-sm gmc-transition",
  {
    variants: {
      variant: {
        default: "border-border hover:shadow-gmc-hover hover:-translate-y-0.5",
        elevated: "shadow-gmc-md hover:shadow-gmc-lg hover:-translate-y-1",
        minimal: "border-transparent bg-transparent shadow-none hover:bg-muted/50",
        featured: "border-primary/20 bg-gradient-to-br from-background to-muted/30 shadow-gmc-md hover:shadow-gmc-lg hover:-translate-y-1",
        
        // GMC Brand Variants - Updated for theme consistency
        "gmc-default": "border-border hover:border-border/80 hover:shadow-gmc-hover hover:-translate-y-0.5",
        "gmc-feature": "bg-gradient-to-br from-muted/50 to-muted border-border shadow-gmc-md hover:shadow-gmc-lg hover:-translate-y-1 relative overflow-hidden",
        "gmc-member": "border-border bg-card hover:border-accent hover:shadow-gmc-hover hover:-translate-y-1 gmc-transition-all",
        "gmc-showcase": "border-2 border-accent bg-gradient-to-br from-background via-muted/30 to-muted/50 shadow-gmc-md hover:shadow-gmc-lg hover:-translate-y-1",
        "gmc-minimal": "border-transparent bg-muted/30 hover:bg-muted/50 shadow-none hover:shadow-gmc-sm",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-6", 
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "gmc-default",
      padding: "md",
    },
  }
)

export interface GMCCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gmcCardVariants> {
  accent?: boolean
}

const GMCCard = React.forwardRef<HTMLDivElement, GMCCardProps>(
  ({ className, variant, padding, accent = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(gmcCardVariants({ variant, padding, className }))}
        {...props}
      >
        {accent && variant === "gmc-feature" && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
        )}
        {children}
      </div>
    )
  }
)
GMCCard.displayName = "GMCCard"

const GMCCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
GMCCardHeader.displayName = "GMCCardHeader"

const GMCCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("gmc-heading-sm font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
))
GMCCardTitle.displayName = "GMCCardTitle"

const GMCCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("gmc-body-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
GMCCardDescription.displayName = "GMCCardDescription"

const GMCCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
GMCCardContent.displayName = "GMCCardContent"

const GMCCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
))
GMCCardFooter.displayName = "GMCCardFooter"

export {
  GMCCard,
  GMCCardHeader,
  GMCCardFooter,
  GMCCardTitle,
  GMCCardDescription,
  GMCCardContent,
  gmcCardVariants,
}