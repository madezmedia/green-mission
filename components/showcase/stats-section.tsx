import { Users, Award, MapPin, Star } from "lucide-react"

const stats = [
  { number: "500+", label: "Eco-Conscious Businesses", icon: Users },
  { number: "50+", label: "Industry Categories", icon: Award },
  { number: "25", label: "Cities Worldwide", icon: MapPin },
  { number: "4.9", label: "Average Rating", icon: Star },
]

export default function StatsSection() {
  return (
    <section id="features" className="bg-muted/30 py-16 md:py-24 transition-all duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl mb-4">Trusted by Sustainable Leaders</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a thriving community of environmentally conscious businesses making a real impact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center p-6 rounded-xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
