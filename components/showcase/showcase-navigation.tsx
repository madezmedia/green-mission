"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ShowcaseThemeSwitcher from "./showcase-theme-switcher"

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "Directory", href: "/directory" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
]

export default function ShowcaseNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-all duration-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">Green Mission</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <ShowcaseThemeSwitcher />
          <Button asChild>
            <Link href="/dashboard">Member Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/join">Join Now</Link>
          </Button>
        </nav>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <div className="p-6">
              <Link href="/" className="mb-8 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-primary">Green Mission</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-4">
                  <ShowcaseThemeSwitcher />
                  <Button asChild>
                    <Link href="/dashboard">Member Login</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href="/join">Join Now</Link>
                  </Button>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
