import { Leaf, Users, Award, BarChart3, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Verified Network",
    description: "Connect with 500+ verified sustainable businesses across 25+ industries worldwide.",
  },
  {
    icon: Award,
    title: "Sustainability Scoring",
    description: "Transparent sustainability ratings help you find the most eco-conscious partners.",
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description: "Track your environmental impact and see how your network contributes to sustainability goals.",
  },
  {
    icon: Shield,
    title: "Trusted Partnerships",
    description: "All members are verified for authenticity and commitment to sustainable practices.",
  },
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered recommendations connect you with the most relevant sustainable partners.",
  },
  {
    icon: Leaf,
    title: "Green Certification",
    description: "Showcase your environmental certifications and discover certified partners.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary md:text-4xl mb-4">Why Choose Green Mission?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're more than just a directory. We're a comprehensive platform designed to help sustainable businesses
            thrive and make meaningful connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl border border-border/50 bg-card hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
