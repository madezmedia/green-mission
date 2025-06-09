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
