"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BasicThemeSwitcher } from "@/components/basic-theme-switcher"
import { usePrimaryLogo } from "@/lib/hooks/use-cms-content"
import Image from "next/image"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Directory", href: "/directory" },
  { name: "About", href: "/about" },
  { name: "Membership", href: "/membership" },
]

export default function ShowcaseNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logoUrl, altText, loading: logoLoading } = usePrimaryLogo()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-all duration-500">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo - Optimized for all screen sizes and themes */}
        <Link
          href="/"
          className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg p-1 gmc-transition"
          aria-label="Green Mission Club Home"
        >
          {logoUrl && !logoLoading ? (
            <div className="relative h-8 w-auto sm:h-10 md:h-12 lg:h-14">
              <Image
                src={logoUrl}
                alt={altText || "Green Mission Club Logo"}
                width={200}
                height={56}
                className="gmc-logo-adaptive h-8 w-auto sm:h-10 md:h-12 lg:h-14 object-contain gmc-transition"
                sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, (max-width: 1024px) 48px, 56px"
                priority
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary gmc-transition">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
            </div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <BasicThemeSwitcher />
          <Button asChild>
            <Link href="/dashboard">Member Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/join">Join Now</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs">
            <div className="p-6">
              {/* Mobile Logo */}
              <Link
                href="/"
                className="mb-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg p-1 gmc-transition"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Green Mission Club Home"
              >
                {logoUrl && !logoLoading ? (
                  <div className="relative h-10 w-auto">
                    <Image
                      src={logoUrl}
                      alt={altText || "Green Mission Club Logo"}
                      width={160}
                      height={40}
                      className="gmc-logo-adaptive h-10 w-auto object-contain gmc-transition"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary gmc-transition">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                )}
              </Link>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-4">
                  <BasicThemeSwitcher />
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
