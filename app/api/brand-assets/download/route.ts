import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "logo"
    const variant = searchParams.get("variant") || "primary"
    const format = searchParams.get("format") || "svg"
    const size = searchParams.get("size") || "md"
    const capitalization = searchParams.get("capitalization") || "default"

    if (type === "logo") {
      return generateLogoDownload(variant, format, size, capitalization)
    } else if (type === "badge") {
      const badgeType = searchParams.get("badgeType") || "member-badge"
      const memberName = searchParams.get("memberName") || ""
      const memberSince = searchParams.get("memberSince") || ""
      const badgeVariant = searchParams.get("badgeVariant") || "default"
      
      return generateBadgeDownload(badgeType, format, size, badgeVariant, memberName, memberSince)
    }

    return NextResponse.json(
      { success: false, error: "Invalid asset type" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Error generating download:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate download" },
      { status: 500 }
    )
  }
}

function generateLogoDownload(variant: string, format: string, size: string, capitalization: string) {
  const sizeMap = {
    xs: { width: 16, height: 16, fontSize: 12 },
    sm: { width: 24, height: 24, fontSize: 14 },
    md: { width: 32, height: 32, fontSize: 16 },
    lg: { width: 48, height: 48, fontSize: 20 },
    xl: { width: 64, height: 64, fontSize: 24 },
    "2xl": { width: 80, height: 80, fontSize: 28 }
  }

  const dimensions = sizeMap[size as keyof typeof sizeMap] || sizeMap.md

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

  const logoText = formatText("Green Mission Club")

  if (format === "svg") {
    let svgContent = ""
    
    switch (variant) {
      case "icon-only":
        svgContent = `
          <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:hsl(150, 60%, 25%);stop-opacity:1" />
                <stop offset="100%" style="stop-color:hsl(150, 45%, 55%);stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="${dimensions.width/2}" cy="${dimensions.height/2}" r="${dimensions.width/2 - 2}" fill="url(#iconGradient)"/>
            <text x="${dimensions.width/2}" y="${dimensions.height/2 + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${dimensions.fontSize}">🌱</text>
          </svg>`
        break
        
      case "text-only":
        svgContent = `
          <svg width="${dimensions.width * 4}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="${dimensions.height/2 + 6}" fill="hsl(150, 60%, 25%)" font-family="Arial, sans-serif" font-size="${dimensions.fontSize}" font-weight="bold">${logoText}</text>
          </svg>`
        break
        
      case "stacked":
        svgContent = `
          <svg width="${dimensions.width * 3}" height="${dimensions.height * 2}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:hsl(150, 60%, 25%);stop-opacity:1" />
                <stop offset="100%" style="stop-color:hsl(150, 45%, 55%);stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="${dimensions.width * 1.5}" cy="${dimensions.height/2}" r="${dimensions.width/2 - 2}" fill="url(#iconGradient)"/>
            <text x="${dimensions.width * 1.5}" y="${dimensions.height/2 + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${dimensions.fontSize}">🌱</text>
            <text x="${dimensions.width * 1.5}" y="${dimensions.height * 1.5}" text-anchor="middle" fill="hsl(150, 60%, 25%)" font-family="Arial, sans-serif" font-size="${dimensions.fontSize}" font-weight="bold">${logoText}</text>
          </svg>`
        break
        
      case "horizontal":
      case "primary":
      default:
        svgContent = `
          <svg width="${dimensions.width * 5}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:hsl(150, 60%, 25%);stop-opacity:1" />
                <stop offset="100%" style="stop-color:hsl(150, 45%, 55%);stop-opacity:1" />
              </linearGradient>
            </defs>
            <circle cx="${dimensions.height/2}" cy="${dimensions.height/2}" r="${dimensions.height/2 - 2}" fill="url(#iconGradient)"/>
            <text x="${dimensions.height/2}" y="${dimensions.height/2 + 4}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${dimensions.fontSize}">🌱</text>
            <text x="${dimensions.height + 12}" y="${dimensions.height/2 + 6}" fill="hsl(150, 60%, 25%)" font-family="Arial, sans-serif" font-size="${dimensions.fontSize}" font-weight="bold">${logoText}</text>
          </svg>`
        break
    }

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="green-mission-club-logo-${variant}-${size}.svg"`,
      },
    })
  }

  // For other formats, return a simple response
  return NextResponse.json({
    success: true,
    message: `${format.toUpperCase()} download would be generated here`,
    variant,
    size,
    capitalization
  })
}

function generateBadgeDownload(badgeType: string, format: string, size: string, variant: string, memberName: string, memberSince: string) {
  const sizeMap = {
    sm: { width: 256, height: 128 },
    md: { width: 320, height: 160 },
    lg: { width: 384, height: 192 },
    xl: { width: 448, height: 224 }
  }

  const dimensions = sizeMap[size as keyof typeof sizeMap] || sizeMap.md

  const badgeTexts = {
    "member-badge": "Proud Member of Green Mission Club",
    "supporter-badge": "Supporting Green Mission Club",
    "partner-badge": "Official Partner of Green Mission Club", 
    "verified-badge": "Verified Green Mission Club Member"
  }

  const displayText = badgeTexts[badgeType as keyof typeof badgeTexts] || badgeTexts["member-badge"]

  if (format === "svg") {
    const svgContent = `
      <svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(150, 60%, 25%);stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(150, 45%, 55%);stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${dimensions.width}" height="${dimensions.height}" rx="12" fill="url(#badgeGradient)"/>
        <text x="${dimensions.width/2}" y="${dimensions.height * 0.35}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">
          Green Mission Club
        </text>
        <text x="${dimensions.width/2}" y="${dimensions.height * 0.55}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">
          ${displayText}
        </text>
        ${memberName ? `<text x="${dimensions.width/2}" y="${dimensions.height * 0.75}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${memberName}</text>` : ''}
        ${memberSince ? `<text x="${dimensions.width/2}" y="${dimensions.height * 0.9}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">Member since ${memberSince}</text>` : ''}
      </svg>`

    return new NextResponse(svgContent, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="green-mission-club-${badgeType}-${size}.svg"`,
      },
    })
  }

  // For other formats, return a simple response
  return NextResponse.json({
    success: true,
    message: `${format.toUpperCase()} download would be generated here`,
    badgeType,
    variant,
    size,
    memberName,
    memberSince
  })
}