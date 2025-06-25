import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "member-badge"
    const name = searchParams.get("name") || ""
    const since = searchParams.get("since") || ""

    const badgeTexts = {
      "member-badge": "Proud Member of Green Mission Club",
      "supporter-badge": "Supporting Green Mission Club",
      "partner-badge": "Official Partner of Green Mission Club", 
      "verified-badge": "Verified Green Mission Club Member"
    }

    const displayText = badgeTexts[type as keyof typeof badgeTexts] || badgeTexts["member-badge"]

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Green Mission Club Badge</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: transparent;
            overflow: hidden;
        }
        .badge {
            width: 320px;
            height: 160px;
            background: linear-gradient(135deg, hsl(150, 60%, 25%) 0%, hsl(150, 45%, 55%) 100%);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            padding: 20px;
            position: relative;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }
        .logo-icon {
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo-text {
            font-size: 16px;
            font-weight: bold;
        }
        .badge-text {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
            line-height: 1.3;
        }
        .member-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .member-since {
            font-size: 10px;
            opacity: 0.9;
        }
        .decorative {
            position: absolute;
            top: 8px;
            right: 8px;
            opacity: 0.2;
            width: 16px;
            height: 16px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <div class="badge">
        <div class="logo">
            <div class="logo-icon">🌱</div>
            <div class="logo-text">Green Mission Club</div>
        </div>
        <div class="badge-text">${displayText}</div>
        ${name ? `<div class="member-name">${name}</div>` : ''}
        ${since ? `<div class="member-since">Member since ${since}</div>` : ''}
        <div class="decorative"></div>
    </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Frame-Options': 'ALLOWALL',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error("Error generating badge embed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate badge embed" },
      { status: 500 }
    )
  }
}