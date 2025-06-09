import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Chen",
    company: "EcoTech Solutions",
    role: "CEO",
    content:
      "Green Mission has been instrumental in connecting us with like-minded sustainable businesses. The quality of partnerships we've formed through this platform is exceptional.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60&text=SC",
  },
  {
    name: "Marcus Rodriguez",
    company: "Sustainable Packaging Co.",
    role: "Founder",
    content:
      "The verification process gives us confidence that we're partnering with genuinely committed sustainable businesses. It's exactly what the industry needed.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60&text=MR",
  },
  {
    name: "Emily Watson",
    company: "Green Energy Partners",
    role: "Director of Partnerships",
    content:
      "The platform's sustainability scoring system helps us quickly identify the best partners for our renewable energy projects. Highly recommended!",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60&text=EW",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary md:text-4xl mb-4">What Our Members Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from sustainable business leaders who are making a difference through our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
