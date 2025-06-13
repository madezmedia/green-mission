"use client"

import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"
import { usePrimaryLogo } from "@/lib/hooks/use-cms-content"
import Image from "next/image"

export default function ShowcaseFooter() {
  const { logoUrl, altText, loading: logoLoading } = usePrimaryLogo()
  return (
    <footer className="bg-card border-t transition-all duration-500">
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              {logoUrl && !logoLoading ? (
                <Link
                  href="/"
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg p-1 transition-all duration-200"
                  aria-label="Green Mission Club Home"
                >
                  <Image
                    src={logoUrl}
                    alt={altText || "Green Mission Club Logo"}
                    width={120}
                    height={40}
                    className="gmc-logo-adaptive h-8 w-auto sm:h-10 object-contain transition-all duration-200"
                    sizes="(max-width: 640px) 120px, 140px"
                  />
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-primary">Green Mission</span>
                </div>
              )}
            </div>
            <p className="mb-6 text-muted-foreground max-w-md">
              Connecting eco-conscious businesses for a sustainable future. Join our community of environmental leaders
              making a positive impact through responsible business practices.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@greenmission.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/directory" className="text-muted-foreground hover:text-primary transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-primary">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Green Mission. All rights reserved. Building a sustainable future
            together.
          </p>
        </div>
      </div>
    </footer>
  )
}
