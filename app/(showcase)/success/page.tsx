"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, Building2, User, Mail, Phone, MapPin } from "lucide-react"
import ShowcaseNavigation from "@/components/showcase/showcase-navigation"
import ShowcaseFooter from "@/components/showcase/showcase-footer"

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Business Info
    businessName: "",
    businessDescription: "",
    website: "",
    industry: "",
    location: "",
    
    // Sustainability Info
    sustainabilityPractices: "",
    certifications: "",
  })

  const industries = [
    "Agriculture & Food",
    "Clean Technology",
    "Construction & Building",
    "Consumer Goods",
    "Energy & Utilities",
    "Fashion & Apparel",
    "Health & Wellness",
    "Manufacturing",
    "Professional Services",
    "Retail & E-commerce",
    "Technology",
    "Transportation",
    "Other"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Here you would typically:
      // 1. Create the user account
      // 2. Set up their business profile
      // 3. Redirect to dashboard
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error setting up account:", error)
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <>
        <ShowcaseNavigation />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Welcome to Green Mission!
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Your payment was successful. Let's set up your account and business profile 
                  to get you started in our sustainable business community.
                </p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Payment Confirmed
                </Badge>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Let's Get Started
                  </CardTitle>
                  <CardDescription>
                    We'll help you create your profile in just a few steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">1</span>
                        </div>
                        <span className="font-medium">Personal Information</span>
                      </div>
                      <Badge variant="outline">Next</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-500">2</span>
                        </div>
                        <span className="font-medium text-muted-foreground">Business Profile</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-500">3</span>
                        </div>
                        <span className="font-medium text-muted-foreground">Sustainability Info</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleNext} className="w-full mt-8" size="lg">
                    Start Setup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ShowcaseFooter />
      </>
    )
  }

  if (step === 2) {
    return (
      <>
        <ShowcaseNavigation />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Personal Information</h1>
                <p className="text-muted-foreground">Tell us about yourself</p>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-8 bg-green-600 rounded"></div>
                    <div className="h-2 w-8 bg-gray-300 rounded"></div>
                    <div className="h-2 w-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ShowcaseFooter />
      </>
    )
  }

  if (step === 3) {
    return (
      <>
        <ShowcaseNavigation />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Business Profile</h1>
                <p className="text-muted-foreground">Tell us about your business</p>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-8 bg-green-600 rounded"></div>
                    <div className="h-2 w-8 bg-green-600 rounded"></div>
                    <div className="h-2 w-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="Eco Solutions Inc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        value={formData.businessDescription}
                        onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                        placeholder="Brief description of your business and what you do..."
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select onValueChange={(value) => handleInputChange("industry", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="City, State/Province, Country"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ShowcaseFooter />
      </>
    )
  }

  if (step === 4) {
    return (
      <>
        <ShowcaseNavigation />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Sustainability Information</h1>
                <p className="text-muted-foreground">Share your green practices</p>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-8 bg-green-600 rounded"></div>
                    <div className="h-2 w-8 bg-green-600 rounded"></div>
                    <div className="h-2 w-8 bg-green-600 rounded"></div>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="sustainabilityPractices">Sustainability Practices</Label>
                      <Textarea
                        id="sustainabilityPractices"
                        value={formData.sustainabilityPractices}
                        onChange={(e) => handleInputChange("sustainabilityPractices", e.target.value)}
                        placeholder="Describe your sustainable business practices, environmental initiatives, etc..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="certifications">Certifications (Optional)</Label>
                      <Textarea
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange("certifications", e.target.value)}
                        placeholder="List any environmental certifications, awards, or recognitions..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Setting up your account...
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ShowcaseFooter />
      </>
    )
  }

  return null
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}