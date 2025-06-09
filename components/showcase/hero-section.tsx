"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sparkles, ArrowDown, Play } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-hero py-20 text-white md:py-32 lg:py-40">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.3" />
              <circle cx="10" cy="10" r="1" fill="white" fillOpacity="0.2" />
              <circle cx="50" cy="50" r="1" fill="white" fillOpacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full blur-lg animate-pulse delay-500"></div>

      <div className="container relative mx-auto px-4 text-center md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex justify-center animate-fade-in">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm backdrop-blur-sm border border-white/20 transition-all hover:bg-white/15 hover:scale-105">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Join 500+ sustainable businesses</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl animate-fade-in-up">
            Connect with{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Eco-Conscious
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-white/50 to-transparent rounded-full animate-pulse"></div>
            </span>{" "}
            Businesses
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg text-white/90 md:text-xl lg:text-2xl leading-relaxed animate-fade-in-up delay-200">
            Join the largest network of sustainable businesses committed to environmental responsibility and business
            success. Build meaningful connections that drive positive change for our planet.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row animate-fade-in-up delay-400">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105 px-8 py-6 text-lg font-semibold group"
              asChild
            >
              <Link href="/directory">
                Explore Directory
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm hover:border-white/50 transition-all px-8 py-6 text-lg font-semibold group"
              asChild
            >
              <Link href="/sign-up">
                Join Network
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="mt-16 flex justify-center items-center gap-6 animate-fade-in-up delay-600">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white transition-all group"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform animate-bounce" />
              <span className="ml-2">Discover Features</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-white/60 text-sm">
              <Play className="h-4 w-4" />
              <span>Watch Demo</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm animate-fade-in-up delay-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>500+ Active Members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>25+ Industries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
              <span>95% Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .delay-400 {
          animation-delay: 0.4s;
          animation-fill-mode: both;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }
        
        .delay-800 {
          animation-delay: 0.8s;
          animation-fill-mode: both;
        }
      `}</style>
    </section>
  )
}
