"use client"

import { cn } from "@/lib/utils"
import { Leaf, TreePine } from "lucide-react"
import { usePrimaryLogo } from "@/lib/hooks/use-cms-content"
import Image from "next/image"

interface LogoProps {
  variant?: "primary" | "stacked" | "horizontal" | "icon-only" | "text-only"
  capitalization?: "default" | "uppercase" | "lowercase" | "title" | "mixed"
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
  showBackground?: boolean
  iconType?: "cms" | "bonsai" | "leaf"
}

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6", 
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20"
}

const textSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl", 
  xl: "text-2xl",
  "2xl": "text-3xl"
}

const gapClasses = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-5",
  "2xl": "gap-6"
}

export function Logo({
  variant = "primary",
  capitalization = "default",
  size = "md",
  className,
  showBackground = true,
  iconType = "cms"
}: LogoProps) {
  const { logoUrl, altText, loading: logoLoading } = usePrimaryLogo()

  const formatText = (text: string) => {
    switch (capitalization) {
      case "uppercase":
        return text.toUpperCase()
      case "lowercase":
        return text.toLowerCase()
      case "title":
        return text.split(" ").map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(" ")
      case "mixed":
        return "Green Mission CLUB"
      case "default":
      default:
        return "Green Mission Club"
    }
  }

  const renderIcon = () => {
    const iconClass = cn(
      sizeClasses[size],
      "text-white"
    )

    switch (iconType) {
      case "bonsai":
        return <TreePine className={iconClass} />
      case "leaf":
        return <Leaf className={iconClass} />
      case "cms":
      default:
        if (logoUrl && !logoLoading) {
          return (
            <div className={cn("relative", sizeClasses[size])}>
              <Image
                src={logoUrl}
                alt={altText || "Green Mission Club Logo"}
                fill
                className="object-contain"
                sizes={`${size === "xs" ? "16px" : size === "sm" ? "24px" : size === "md" ? "32px" : size === "lg" ? "48px" : size === "xl" ? "64px" : "80px"}`}
              />
            </div>
          )
        }
        return <Leaf className={iconClass} />
    }
  }

  const renderContent = () => {
    const textElement = (
      <span className={cn(
        "font-bold text-foreground",
        textSizeClasses[size]
      )}>
        {formatText("Green Mission Club")}
      </span>
    )

    const iconElement = showBackground ? (
      <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary p-2">
        {renderIcon()}
      </div>
    ) : (
      <div className={cn("text-primary", sizeClasses[size])}>
        {renderIcon()}
      </div>
    )

    switch (variant) {
      case "icon-only":
        return iconElement

      case "text-only":
        return textElement

      case "stacked":
        return (
          <div className="flex flex-col items-center gap-2">
            {iconElement}
            {textElement}
          </div>
        )

      case "horizontal":
        return (
          <div className={cn("flex items-center", gapClasses[size])}>
            {iconElement}
            {textElement}
          </div>
        )

      case "primary":
      default:
        return (
          <div className={cn("flex items-center", gapClasses[size])}>
            {iconElement}
            {textElement}
          </div>
        )
    }
  }

  return (
    <div className={cn(
      "gmc-transition",
      variant === "stacked" ? "flex flex-col items-center" : "flex items-center",
      className
    )}>
      {renderContent()}
    </div>
  )
}

// Predefined logo components for common use cases
export function PrimaryLogo({ className, ...props }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="primary" className={className} {...props} />
}

export function StackedLogo({ className, ...props }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="stacked" className={className} {...props} />
}

export function HorizontalLogo({ className, ...props }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="horizontal" className={className} {...props} />
}

export function IconOnlyLogo({ className, ...props }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="icon-only" className={className} {...props} />
}

export function TextOnlyLogo({ className, ...props }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="text-only" className={className} {...props} />
}

// Capitalization variants
export function UppercaseLogo({ className, ...props }: Omit<LogoProps, 'capitalization'>) {
  return <Logo capitalization="uppercase" className={className} {...props} />
}

export function LowercaseLogo({ className, ...props }: Omit<LogoProps, 'capitalization'>) {
  return <Logo capitalization="lowercase" className={className} {...props} />
}

export function TitleCaseLogo({ className, ...props }: Omit<LogoProps, 'capitalization'>) {
  return <Logo capitalization="title" className={className} {...props} />
}

export function MixedCaseLogo({ className, ...props }: Omit<LogoProps, 'capitalization'>) {
  return <Logo capitalization="mixed" className={className} {...props} />
}