import { Users, Award, MapPin, Star } from "lucide-react"

const stats = [
  { number: "500+", label: "Eco-Conscious Businesses", icon: Users },
  { number: "50+", label: "Industry Categories", icon: Award },
  { number: "25", label: "Cities Worldwide", icon: MapPin },
  { number: "4.9", label: "Average Rating", icon: Star },
]

export default function StatsSection() {
  return (
    <section id="features" className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">{stat.number}</div>
              <div className="mt-1 text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
