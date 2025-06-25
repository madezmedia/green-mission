import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import HeroSection from "@/components/showcase/hero-section"
import StatsSection from "@/components/showcase/stats-section"
import FeaturedMembersSection from "@/components/showcase/featured-members-section"
import DirectoryPreviewSection from "@/components/showcase/directory-preview-section"
import MembershipSection from "@/components/showcase/membership-section"
import AboutSection from "@/components/showcase/about-section"
import ShowcaseFooter from "@/components/showcase/showcase-footer"
import TestimonialsSection from "@/components/showcase/testimonials-section"
import FeaturesSection from "@/components/showcase/features-section"

export default function ShowcasePage() {
  return (
    <>
      <ShowcaseNavigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedMembersSection />
        <DirectoryPreviewSection />
        <TestimonialsSection
          hidden={true}
          preserveData={true}
          futureImplementation={true}
        />
        <MembershipSection />
      </main>
      <ShowcaseFooter />
    </>
  )
}
