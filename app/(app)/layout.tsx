"use client" // Keep this as it uses client-side state for navigation

import type React from "react"
import { useState } from "react"
import AppHeader from "@/components/layout/app-header"
import AppSidebar from "@/components/layout/app-sidebar"
import AuthGuard from "@/components/auth/auth-guard"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState("dashboard") // Default to dashboard

  return (
    <AuthGuard requireAuth={true}>
      <div className="flex h-screen bg-[hsl(var(--color-gm-background))]">
        <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
