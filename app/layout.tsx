import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/layout/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Green Mission Club - Sustainable Business Network",
  description: "Join the largest network of sustainable businesses committed to environmental responsibility and business success. Connect with eco-conscious leaders making a positive impact.",
  keywords: [
    "sustainable business",
    "eco-conscious",
    "environmental responsibility",
    "green business network",
    "sustainable networking",
    "eco-friendly companies",
    "environmental impact",
    "green mission",
    "sustainable directory"
  ],
  authors: [{ name: "Green Mission Club" }],
  creator: "Green Mission Club",
  publisher: "Green Mission Club",
  generator: "Next.js",
  applicationName: "Green Mission Club",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://greenmissionclub.com'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Green Mission Club - Sustainable Business Network",
    description: "Join the largest network of sustainable businesses committed to environmental responsibility and business success. Connect with eco-conscious leaders making a positive impact.",
    siteName: "Green Mission Club",
    images: [
      {
        url: "/gmc-logo-full.png",
        width: 1200,
        height: 630,
        alt: "Green Mission Club - Sustainable Business Network",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Mission Club - Sustainable Business Network",
    description: "Join the largest network of sustainable businesses committed to environmental responsibility and business success.",
    images: ["/gmc-logo-full.png"],
    creator: "@greenmissionclub",
    site: "@greenmissionclub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "hsl(174, 55%, 40%)",
          colorDanger: "hsl(0, 84.2%, 60.2%)",
          colorSuccess: "hsl(158, 70%, 40%)",
          colorWarning: "hsl(45, 90%, 50%)",
          colorNeutral: "hsl(195, 25%, 45%)",
          colorText: "hsl(195, 35%, 15%)",
          colorTextSecondary: "hsl(195, 25%, 45%)",
          colorBackground: "hsl(0, 0%, 100%)",
          colorInputBackground: "hsl(165, 15%, 96%)",
          colorInputText: "hsl(195, 35%, 15%)",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: "hsl(174, 55%, 40%)",
            "&:hover": {
              backgroundColor: "hsl(174, 55%, 35%)",
            },
          },
          card: {
            backgroundColor: "hsl(0, 0%, 100%)",
            borderColor: "hsl(165, 15%, 94%)",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Green Mission Club",
                "alternateName": "Green Mission",
                "url": process.env.NEXT_PUBLIC_APP_URL || "https://greenmissionclub.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${process.env.NEXT_PUBLIC_APP_URL || "https://greenmissionclub.com"}/gmc-logo-full.png`,
                  "width": 1200,
                  "height": 630
                },
                "description": "Join the largest network of sustainable businesses committed to environmental responsibility and business success. Connect with eco-conscious leaders making a positive impact.",
                "foundingDate": "2024",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+1-555-123-4567",
                  "contactType": "customer service",
                  "email": "hello@greenmission.com"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "San Francisco",
                  "addressRegion": "CA",
                  "addressCountry": "US"
                },
                "sameAs": [
                  "https://twitter.com/greenmissionclub",
                  "https://linkedin.com/company/greenmissionclub",
                  "https://facebook.com/greenmissionclub"
                ],
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://greenmissionclub.com"}/directory?search={search_term_string}`
                  },
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
        </head>
        <body className={cn(inter.className, "antialiased")}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
