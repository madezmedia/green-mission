"use client"

import { cn } from "@/lib/utils"
import { Leaf, TreePine } from "lucide-react"
import { usePrimaryLogo } from "@/lib/hooks/use-cms-content"
import Image from "next/image"

interface LogoVariationProps {
  variant?: "default" | "bonsai-tree" | "leaf" | "text-only"
  capitalization?: "uppercase" | "lowercase" | "mixed" | "title"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showText?: boolean
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
}

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl", 
  xl: "text-2xl"
}

export function LogoVariation({
  variant = "default",
  capitalization = "mixed",
  size = "md",
  className,
  showText = true
}: LogoVariationProps) {
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
      default:
        return "Green Mission CLUB"
    }
  }

  const renderIcon = () => {
    const iconClass = cn(
      sizeClasses[size],
      "text-primary"
    )

    switch (variant) {
      case "bonsai-tree":
        return <TreePine className={iconClass} />
      case "leaf":
        return <Leaf className={iconClass} />
      case "text-only":
        return null
      case "default":
      default:
        if (logoUrl && !logoLoading) {
          return (
            <div className={cn("relative", sizeClasses[size])}>
              <Image
                src={logoUrl}
                alt={altText || "Green Mission Club Logo"}
                fill
                className="object-contain"
                sizes={`${size === "sm" ? "24px" : size === "md" ? "32px" : size === "lg" ? "48px" : "64px"}`}
              />
            </div>
          )
        }
        return <Leaf className={iconClass} />
    }
  }

  return (
    <div className={cn(
      "flex items-center gap-3 gmc-transition",
      className
    )}>
      {variant !== "text-only" && (
        <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary p-2">
          <div className="text-white">
            {renderIcon()}
          </div>
        </div>
      )}
      
      {showText && (
        <span className={cn(
          "font-bold text-foreground",
          textSizeClasses[size]
        )}>
          {formatText("Green Mission Club")}
        </span>
      )}
    </div>
  )
}