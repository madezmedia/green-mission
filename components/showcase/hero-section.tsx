import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-primary py-20 text-white md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 text-center md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Join 500+ sustainable businesses</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Connect with{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Eco-Conscious
            </span>{" "}
            Businesses
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
            Join the largest network of sustainable businesses committed to environmental responsibility and business
            success. Build meaningful connections that drive positive change.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg" asChild>
              <Link href="/dashboard">
                Explore Directory <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
              asChild
            >
              <Link href="/join">Join Network</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
