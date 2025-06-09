"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Building, User, MapPin, Tag } from "lucide-react"

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    website: "",
    businessDescription: "",
    shortDescription: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    industryCategory: "",
    businessTags: "",
    servicesOffered: "",
    newsletterSubscription: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/member-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "Business Name": formData.businessName,
          "Owner Name": formData.ownerName,
          Email: formData.email,
          Phone: formData.phone,
          Website: formData.website,
          "Business Description": formData.businessDescription,
          "Short Description": formData.shortDescription,
          "Business Address": formData.businessAddress,
          City: formData.city,
          State: formData.state,
          "ZIP Code": formData.zipCode,
          "Industry Category": formData.industryCategory,
          "Business Tags": formData.businessTags.split(",").map((tag) => tag.trim()),
          "Services Offered": formData.servicesOffered.split(",").map((service) => service.trim()),
          "Newsletter Subscription": formData.newsletterSubscription,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update user metadata to indicate onboarding is complete
        await user?.update({
          publicMetadata: {
            ...user.publicMetadata,
            onboardingComplete: true,
            airtableRecordId: data.recordId,
          },
        })

        router.push("/dashboard?welcome=true")
      } else {
        throw new Error(data.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Welcome to Green Mission!</CardTitle>
          <p className="text-muted-foreground">
            Let's set up your business profile to connect with our sustainable community.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Building className="h-5 w-5" />
                Business Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input
                  id="shortDescription"
                  placeholder="Brief tagline for your business"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Describe your business, mission, and sustainable practices"
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <User className="h-5 w-5" />
                Contact Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} disabled />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <MapPin className="h-5 w-5" />
                Location
              </div>

              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Tag className="h-5 w-5" />
                Business Details
              </div>

              <div>
                <Label htmlFor="industryCategory">Industry Category</Label>
                <Select
                  value={formData.industryCategory}
                  onValueChange={(value) => setFormData({ ...formData, industryCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Energy & Environment">Energy & Environment</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessTags">Business Tags</Label>
                <Input
                  id="businessTags"
                  placeholder="sustainable, eco-friendly, renewable (comma-separated)"
                  value={formData.businessTags}
                  onChange={(e) => setFormData({ ...formData, businessTags: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="servicesOffered">Services Offered</Label>
                <Input
                  id="servicesOffered"
                  placeholder="consulting, installation, maintenance (comma-separated)"
                  value={formData.servicesOffered}
                  onChange={(e) => setFormData({ ...formData, servicesOffered: e.target.value })}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletterSubscription}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, newsletterSubscription: checked as boolean })
                  }
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Subscribe to our newsletter for sustainability tips and community updates
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
