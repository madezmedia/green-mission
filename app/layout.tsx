import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Green Mission - Membership Directory",
  description: "Connecting eco-conscious businesses for a sustainable future.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "antialiased")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="green-mission-theme"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
