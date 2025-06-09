import Link from "next/link"
import { Leaf } from "lucide-react"

export default function ShowcaseFooter() {
  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="container mx-auto px-4 text-center md:px-6">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Leaf className="h-7 w-7" />
          <span className="text-2xl font-bold">Green Mission</span>
        </div>
        <p className="mb-6 text-sm text-primary-foreground/80">
          Connecting eco-conscious businesses for a sustainable future.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
          <Link href="/support" className="hover:underline">
            Support
          </Link>
        </div>
        <p className="mt-8 text-xs text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Green Mission. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
