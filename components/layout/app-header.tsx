"use client"

import { Search, Bell, Leaf, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserButton, useUser } from "@clerk/nextjs"
import AppSidebar from "./app-sidebar"
import { useState } from "react"

export default function AppHeader() {
  const { user } = useUser()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <AppSidebar currentPage="dashboard" setCurrentPage={() => setMobileSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Green Mission</h1>
        </div>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search businesses..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-muted/50 border-muted-foreground/20 focus:bg-background"
            />
          </div>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] flex items-center justify-center text-white">
                2
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
              <div className="font-medium">New connection request</div>
              <div className="text-sm text-muted-foreground">EcoTech Solutions wants to connect</div>
              <div className="text-xs text-muted-foreground">2 minutes ago</div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
              <div className="font-medium">Event reminder</div>
              <div className="text-sm text-muted-foreground">Green Tech Summit starts tomorrow</div>
              <div className="text-xs text-muted-foreground">1 hour ago</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Use Clerk's UserButton for user menu */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
              userButtonPopoverCard: "bg-card border border-border",
              userButtonPopoverActionButton: "text-foreground hover:bg-muted",
            },
          }}
        />
      </div>
    </header>
  )
}
