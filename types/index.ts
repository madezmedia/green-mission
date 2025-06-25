export type Member = {
  id: number
  name: string
  slug: string
  tagline: string
  description: string
  logo: string
  coverImage: string
  location: string
  category: string
  tier: "Enterprise" | "Premium" | "Basic"
  rating: number
  reviews: number
  sustainabilityScore: number
  certifications: string[]
  specialties: string[]
  businessTags: string[]
  featured: boolean
  spotlight: boolean
  verified: boolean
  memberSince: string
  industryCategory: string
  greenMissionAlignment?: string
}

export type Category = {
  id: string
  name: string
  count: number
}
