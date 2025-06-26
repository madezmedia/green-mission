"use client" // Keep this as it uses client-side state for navigation

import type React from "react"
import { useState } from "react"
import AppHeader from "@/components/layout/app-header"
import AppSidebar from "@/components/layout/app-sidebar"
import SimpleHeader from "@/components/layout/simple-header"
import AuthGuard from "@/components/auth/auth-guard"
import { getDashboardConfig } from "@/lib/config"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState("dashboard") // Default to dashboard
  const config = getDashboardConfig()

  return (
    <AuthGuard requireAuth={true}>
      {config.layout.showSidebar ? (
        // Advanced Layout: Sidebar + AppHeader
        <div className="flex h-screen bg-[hsl(var(--color-gm-background))]">
          <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </div>
      ) : (
        // Simplified Layout: SimpleHeader + Single Column
        <div className="min-h-screen bg-[hsl(var(--color-gm-background))]">
          <SimpleHeader />
          <main className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      )}
    </AuthGuard>
  )
}

{/*
PRESERVED ADVANCED LAYOUT FUNCTIONALITY:
The original complex layout with sidebar and advanced header is preserved above
and will be used when config.layout.showSidebar is true. This includes:
- AppSidebar with navigation state management
- AppHeader with search, notifications, and mobile sidebar
- Full-screen flex layout with overflow handling
- All existing responsive design and styling

SIMPLIFIED LAYOUT:
When config.layout.showSidebar is false, the simplified layout provides:
- SimpleHeader with minimal navigation and branding
- Single-column container layout with consistent max-width
- Clean, focused design without sidebar complexity
- Mobile-responsive navigation in the header
*/}
