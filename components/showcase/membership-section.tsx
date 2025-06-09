import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

const tiers = [
  {
    name: "Basic",
    price: "$29",
    period: "/month",
    features: ["Directory Listing", "Basic Profile", "Community Access", "Monthly Newsletter"],
    color: "bg-accent text-accent-foreground",
    borderColor: "border-accent",
    popular: false,
  },
  {
    name: "Premium",
    price: "$59",
    period: "/month",
    features: ["Featured Listing", "Enhanced Profile", "Priority Support", "Exclusive Content", "Event Access"],
    color: "bg-secondary text-secondary-foreground",
    borderColor: "border-secondary",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Spotlight Features",
      "Custom Branding",
      "Analytics Dashboard",
      "Partnership Opportunities",
      "Dedicated Support",
    ],
    color: "bg-primary text-primary-foreground",
    borderColor: "border-primary",
    popular: false,
  },
]

export default function MembershipSection() {
  return (
    <section id="pricing" className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Choose Your Membership</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join the Green Mission community and connect with like-minded sustainable businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-xl border bg-card p-8 shadow-lg transition-all ${
                tier.popular ? `${tier.borderColor} ring-4 ring-offset-2 ring-accent scale-105` : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary">
                  Most Popular
                </div>
              )}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-semibold text-primary">{tier.name}</h3>
                <div className="mt-2">
                  <span className={`text-4xl font-bold ${tier.color.split(" ")[0].replace("bg-", "text-")}`}>
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
              </div>
              <ul className="mb-8 flex-grow space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${tier.color.split(" ")[0].replace("bg-", "bg-")}/20`}
                    >
                      <Check className={`h-3.5 w-3.5 ${tier.color.split(" ")[0].replace("bg-", "text-")}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className={`w-full ${tier.color}`}>
                <Link href="/join">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
