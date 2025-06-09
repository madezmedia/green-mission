import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import HeroSection from "@/components/showcase/hero-section"
import StatsSection from "@/components/showcase/stats-section"
import FeaturedMembersSection from "@/components/showcase/featured-members-section"
import MembershipSection from "@/components/showcase/membership-section"
import AboutSection from "@/components/showcase/about-section"
import ShowcaseFooter from "@/components/showcase/showcase-footer"

export default function ShowcasePage() {
  return (
    <>
      <ShowcaseNavigation />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedMembersSection />
        <MembershipSection />
        <AboutSection />
      </main>
      <ShowcaseFooter />
    </>
  )
}
