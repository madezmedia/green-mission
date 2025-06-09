import { Leaf, Award, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sections = [
  {
    title: "Our Mission",
    content:
      "To connect environmentally conscious businesses and foster a community where sustainability and profitability go hand in hand.",
    icon: Leaf,
  },
  {
    title: "Our Vision",
    content:
      "A world where every business operates with environmental stewardship at its core, creating positive impact for future generations.",
    icon: Award,
  },
  {
    title: "Our Community",
    content:
      "Over 500 verified sustainable businesses across 25+ industries, all committed to making a difference through their operations.",
    icon: Users,
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">About Green Mission</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            We're building the largest network of eco-conscious businesses committed to environmental responsibility and
            sustainable business practices.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border bg-card p-8 text-center shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <section.icon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-primary">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-muted p-12 text-center">
          <h2 className="text-2xl font-bold text-primary md:text-3xl">Ready to Join Our Mission?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Become part of a community that's reshaping business for a sustainable future. Connect, collaborate, and
            grow with like-minded organizations.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/join">
              Start Your Journey <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
