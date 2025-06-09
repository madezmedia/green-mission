import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    description: "Perfect for small sustainable businesses getting started",
    features: ["Directory Listing", "Basic Profile", "Community Access", "Monthly Newsletter"],
    popular: false,
  },
  {
    name: "Premium",
    price: "$59",
    period: "/month",
    description: "Ideal for growing businesses ready to expand their network",
    features: ["Featured Listing", "Enhanced Profile", "Priority Support", "Exclusive Content", "Event Access"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For established companies leading sustainability initiatives",
    features: [
      "Spotlight Features",
      "Custom Branding",
      "Analytics Dashboard",
      "Partnership Opportunities",
      "Dedicated Support",
    ],
    popular: false,
  },
]

export default function MembershipSection() {
  return (
    <section id="pricing" className="bg-muted/20 py-16 md:py-24 transition-all duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl mb-4">Choose Your Membership</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join the Green Mission community and connect with like-minded sustainable businesses. Every plan includes
            access to our growing network of eco-conscious partners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                tier.popular
                  ? "border-primary ring-4 ring-primary/10 scale-105"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-white shadow-lg">
                  <Star className="inline w-4 h-4 mr-1" />
                  Most Popular
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-primary mb-2">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-primary">{tier.price}</span>
                  <span className="text-muted-foreground text-lg">{tier.period}</span>
                </div>
              </div>

              <ul className="mb-8 flex-grow space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full transition-all ${
                  tier.popular
                    ? "bg-gradient-primary hover:shadow-lg hover:scale-105"
                    : "hover:bg-primary hover:scale-105"
                }`}
                asChild
              >
                <Link href="/join">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
