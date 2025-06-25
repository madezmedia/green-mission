"use client"

import { cn } from "@/lib/utils"
import { Download, Share2, Copy, Check } from "lucide-react"
import { Logo } from "./logo"
import { GMCButton } from "./gmc-button"
import { useState } from "react"

interface DigitalBadgeProps {
  type?: "member-badge" | "supporter-badge" | "partner-badge" | "verified-badge"
  text?: string
  memberName?: string
  memberSince?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "minimal" | "premium" | "eco"
  downloadable?: boolean
  embeddable?: boolean
  formats?: ("PDF" | "PNG" | "SVG")[]
  className?: string
  onDownload?: (format: string, data: string) => void
}

const sizeClasses = {
  sm: "w-64 h-32",
  md: "w-80 h-40", 
  lg: "w-96 h-48",
  xl: "w-[28rem] h-56"
}

const badgeVariants = {
  default: "bg-gradient-to-br from-primary to-secondary text-white",
  minimal: "bg-card border-2 border-primary text-foreground",
  premium: "bg-gradient-to-br from-primary via-secondary to-accent text-white",
  eco: "bg-gradient-to-br from-accent to-primary text-white"
}

const badgeTexts = {
  "member-badge": "Proud Member of Green Mission Club",
  "supporter-badge": "Supporting Green Mission Club",
  "partner-badge": "Official Partner of Green Mission Club", 
  "verified-badge": "Verified Green Mission Club Member"
}

export function DigitalBadge({
  type = "member-badge",
  text,
  memberName,
  memberSince,
  size = "md",
  variant = "default",
  downloadable = true,
  embeddable = true,
  formats = ["PDF", "PNG", "SVG"],
  className,
  onDownload
}: DigitalBadgeProps) {
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const badgeId = `digital-badge-${Date.now()}`

  const displayText = text || badgeTexts[type]

  const generateSVGBadge = () => {
    const width = size === "sm" ? 256 : size === "lg" ? 384 : size === "xl" ? 448 : 320
    const height = size === "sm" ? 128 : size === "lg" ? 192 : size === "xl" ? 224 : 160
    
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(150, 60%, 25%);stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(150, 45%, 55%);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="12" fill="url(#badgeGradient)"/>
      <text x="${width/2}" y="${height * 0.35}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
        Green Mission Club
      </text>
      <text x="${width/2}" y="${height * 0.55}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">
        ${displayText}
      </text>
      ${memberName ? `<text x="${width/2}" y="${height * 0.75}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${memberName}</text>` : ''}
      ${memberSince ? `<text x="${width/2}" y="${height * 0.9}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">Member since ${memberSince}</text>` : ''}
    </svg>`
  }

  const downloadAsSVG = () => {
    const svgContent = generateSVGBadge()
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `green-mission-club-${type}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (onDownload) onDownload('SVG', svgContent)
  }

  const downloadAsHTML = () => {
    const element = document.getElementById(badgeId)
    if (!element) return

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Green Mission Club Badge</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .badge { ${element.style.cssText} }
    </style>
</head>
<body>
    <div class="badge">${element.innerHTML}</div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `green-mission-club-${type}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (onDownload) onDownload('HTML', htmlContent)
  }

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.origin}/api/badges/embed?type=${type}&name=${encodeURIComponent(memberName || '')}&since=${encodeURIComponent(memberSince || '')}" width="320" height="160" frameborder="0"></iframe>`
    
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopiedEmbed(true)
      setTimeout(() => setCopiedEmbed(false), 2000)
    })
  }

  const handleDownload = (format: string) => {
    switch (format) {
      case 'SVG':
        downloadAsSVG()
        break
      case 'HTML':
        downloadAsHTML()
        break
      case 'PNG':
      case 'PDF':
        // For now, redirect to SVG download with a note
        alert(`${format} download will be available once dependencies are installed. Using SVG instead.`)
        downloadAsSVG()
        break
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Badge Display */}
      <div
        id={badgeId}
        className={cn(
          "relative rounded-gmc-lg p-6 flex flex-col items-center justify-center text-center shadow-gmc-lg",
          sizeClasses[size],
          badgeVariants[variant]
        )}
      >
        {/* Logo */}
        <div className="mb-3">
          <Logo 
            variant="horizontal" 
            size={size === "sm" ? "sm" : size === "xl" ? "lg" : "md"}
            showBackground={false}
            iconType="leaf"
            className={variant === "minimal" ? "text-primary" : "text-white"}
          />
        </div>

        {/* Badge Text */}
        <div className="space-y-2">
          <p className={cn(
            "font-semibold leading-tight",
            size === "sm" ? "text-xs" : size === "xl" ? "text-lg" : "text-sm"
          )}>
            {displayText}
          </p>
          
          {memberName && (
            <p className={cn(
              "font-bold",
              size === "sm" ? "text-sm" : size === "xl" ? "text-xl" : "text-base"
            )}>
              {memberName}
            </p>
          )}
          
          {memberSince && (
            <p className={cn(
              "opacity-90",
              size === "sm" ? "text-xs" : "text-sm"
            )}>
              Member since {memberSince}
            </p>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2 opacity-20">
          <Logo variant="icon-only" size="sm" showBackground={false} />
        </div>
      </div>

      {/* Download Controls */}
      {(downloadable || embeddable) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {downloadable && (
            <>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => handleDownload('SVG')}
                className="min-w-[80px]"
              >
                <Download className="h-3 w-3" />
                SVG
              </GMCButton>
              <GMCButton
                variant="gmc-outline"
                size="sm"
                onClick={() => handleDownload('HTML')}
                className="min-w-[80px]"
              >
                <Download className="h-3 w-3" />
                HTML
              </GMCButton>
            </>
          )}
          
          {embeddable && (
            <GMCButton
              variant="gmc-secondary"
              size="sm"
              onClick={copyEmbedCode}
              className="min-w-[100px]"
            >
              {copiedEmbed ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Embed
                </>
              )}
            </GMCButton>
          )}
        </div>
      )}
    </div>
  )
}

// Predefined badge components
export function MemberBadge({ className, ...props }: Omit<DigitalBadgeProps, 'type'>) {
  return <DigitalBadge type="member-badge" className={className} {...props} />
}

export function SupporterBadge({ className, ...props }: Omit<DigitalBadgeProps, 'type'>) {
  return <DigitalBadge type="supporter-badge" className={className} {...props} />
}

export function PartnerBadge({ className, ...props }: Omit<DigitalBadgeProps, 'type'>) {
  return <DigitalBadge type="partner-badge" className={className} {...props} />
}

export function VerifiedBadge({ className, ...props }: Omit<DigitalBadgeProps, 'type'>) {
  return <DigitalBadge type="verified-badge" className={className} {...props} />
}