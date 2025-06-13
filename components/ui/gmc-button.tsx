import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gmcButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-gmc text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gmc-transition [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-gmc-sm hover:shadow-gmc-hover hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-secondary text-secondary-foreground shadow-gmc-sm hover:shadow-gmc-hover hover:-translate-y-0.5 border border-border",
        outline: "border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground shadow-gmc-sm hover:shadow-gmc-hover hover:-translate-y-0.5",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground gmc-hover-lift",
        link: "text-primary underline-offset-4 hover:underline gmc-transition",
        
        // GMC Brand Variants - Updated for better contrast
        "gmc-primary": "bg-primary text-primary-foreground shadow-gmc-md hover:bg-primary/90 hover:shadow-gmc-lg hover:-translate-y-1 active:translate-y-0 font-semibold",
        "gmc-secondary": "bg-secondary text-secondary-foreground border-2 border-border hover:bg-secondary/90 hover:border-border/80 hover:-translate-y-0.5 shadow-gmc-sm hover:shadow-gmc-hover",
        "gmc-accent": "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-gmc-md hover:from-primary/90 hover:to-primary/80 hover:shadow-gmc-lg hover:-translate-y-1 font-semibold",
        "gmc-outline": "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground shadow-gmc-sm hover:shadow-gmc-hover hover:-translate-y-0.5",
        "gmc-minimal": "text-foreground hover:bg-accent hover:text-accent-foreground gmc-hover-lift rounded-gmc-lg",
        
        // Theme-specific variants - Using CSS variables for theme consistency
        "ocean-primary": "bg-primary text-primary-foreground shadow-gmc-md hover:bg-primary/90 hover:shadow-gmc-lg hover:-translate-y-1",
        "earth-primary": "bg-primary text-primary-foreground shadow-gmc-md hover:bg-primary/90 hover:shadow-gmc-lg hover:-translate-y-1",
        "sunset-primary": "bg-primary text-primary-foreground shadow-gmc-md hover:bg-primary/90 hover:shadow-gmc-lg hover:-translate-y-1",
      },
      size: {
        sm: "h-8 rounded-gmc-sm px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 rounded-gmc-lg px-8 text-base",
        xl: "h-14 rounded-gmc-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "gmc-primary",
      size: "md",
    },
  }
)

export interface GMCButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gmcButtonVariants> {
  asChild?: boolean
}

const GMCButton = React.forwardRef<HTMLButtonElement, GMCButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(gmcButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GMCButton.displayName = "GMCButton"

export { GMCButton, gmcButtonVariants }