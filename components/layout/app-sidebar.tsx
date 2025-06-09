"use client"

import { Home, Building, Users, Calendar, MessageSquare, Crown, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"

interface AppSidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function AppSidebar({ currentPage, setCurrentPage }: AppSidebarProps) {
  const mainNav = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "directory", icon: Building, label: "Directory" },
    { id: "network", icon: Users, label: "My Network" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "messages", icon: MessageSquare, label: "Messages" },
  ]

  return (
    <aside className="hidden w-72 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Green Mission</h1>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          <h3 className="px-4 pt-2 pb-1 text-xs font-semibold uppercase text-muted-foreground">Main</h3>
          {mainNav.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "secondary" : "ghost"}
              className="justify-start gap-3 px-4"
              onClick={() => setCurrentPage(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
        <nav className="flex flex-col gap-1">
          <h3 className="px-4 pt-4 pb-1 text-xs font-semibold uppercase text-muted-foreground">Categories</h3>
          {categories.slice(1, 6).map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className="justify-between gap-3 px-4 font-normal"
              onClick={() => setCurrentPage("directory")}
            >
              <span className="flex items-center gap-3">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.count}</span>
            </Button>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <div className="rounded-lg bg-muted p-4 text-center">
            <Crown className="mx-auto mb-3 h-8 w-8 text-accent" />
            <h4 className="mb-1 text-sm font-semibold">Upgrade to Premium</h4>
            <p className="mb-4 text-xs text-muted-foreground">Unlock advanced features and get priority support.</p>
            <Button size="sm" className="w-full">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
