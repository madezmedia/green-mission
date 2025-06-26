"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"
import { getDashboardConfig, ESSENTIAL_FIELDS } from "@/lib/config"
import ImageUpload from "@/components/ui/image-upload"
import ImageGallery from "@/components/ui/image-gallery"

interface BusinessListing {
  id?: string
  businessName: string
  description: string
  industry: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  sustainabilityPractices: string
  certifications: string
  membershipTier: string
  directoryVisibility: boolean
  status: "Active" | "Pending" | "Inactive"
  lastSynced?: string
  logo?: string
  businessImages?: string[]
}

interface BusinessListingFormProps {
  listing: BusinessListing | null
  onSave: (listing: BusinessListing) => Promise<void>
  onCancel: () => void
  onChange: () => void
}

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

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Other"
]

export default function BusinessListingForm({
  listing,
  onSave,
  onCancel,
  onChange
}: BusinessListingFormProps) {
  const [formData, setFormData] = useState<BusinessListing>({
    businessName: "",
    description: "",
    industry: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    sustainabilityPractices: "",
    certifications: "",
    membershipTier: "Basic",
    directoryVisibility: true,
    status: "Pending",
    logo: "",
    businessImages: [],
    ...listing
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Get dashboard configuration for feature flags
  const config = getDashboardConfig()

  useEffect(() => {
    if (listing) {
      setFormData({ ...listing })
    }
  }, [listing])

  const handleInputChange = (field: keyof BusinessListing, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    onChange()
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Business description is required"
    }
    
    if (!formData.industry) {
      newErrors.industry = "Industry is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    
    if (!formData.country) {
      newErrors.country = "Country is required"
    }

    if (formData.website && !formData.website.startsWith("http")) {
      newErrors.website = "Website URL must start with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error saving listing:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Complete your business profile to appear in the Green Mission directory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className={`grid w-full ${
            config.features.advancedImageFeatures
              ? (config.featureSettings.tabs.showSustainability && config.featureSettings.tabs.showSettings ? 'grid-cols-5' : 'grid-cols-3')
              : (config.featureSettings.tabs.showSustainability && config.featureSettings.tabs.showSettings ? 'grid-cols-4' : 'grid-cols-2')
          }`}>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            {/* Images tab - shown when advanced image features are enabled */}
            {config.features.advancedImageFeatures && (
              <TabsTrigger value="images">Images</TabsTrigger>
            )}
            {/* PHASE 2: Advanced tabs - hidden in simplified mode */}
            {config.featureSettings.tabs.showSustainability && (
              <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            )}
            {config.featureSettings.tabs.showSettings && (
              <TabsTrigger value="settings">Settings</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Green Solutions Inc."
                  className={errors.businessName ? "border-red-500" : ""}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => handleInputChange("industry", value)}
                >
                  <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
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
                {errors.industry && (
                  <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your business, products, and services..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
                className={errors.website ? "border-red-500" : ""}
              />
              {errors.website && (
                <p className="text-sm text-red-500 mt-1">{errors.website}</p>
              )}
            </div>

            {/* Logo Upload - Always show in simplified mode for better visibility */}
            {config.images.enabled && (
              <div className="space-y-2">
                <Label htmlFor="logo">Business Logo</Label>
                <p className="text-sm text-muted-foreground">
                  Upload your business logo to appear in the directory
                </p>
                <ImageUpload
                  value={formData.logo}
                  onChange={(url) => handleInputChange("logo", url || "")}
                  maxSize={config.images.maxSize}
                  acceptedTypes={config.images.acceptedTypes}
                  placeholder="Upload your business logo"
                  disabled={saving}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@business.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
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

            {/* PHASE 2: Advanced contact fields - hidden in simplified mode */}
            {!config.isSimplified && (
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Green Street"
                />
              </div>
            )}

            <div className={`grid gap-4 ${config.isSimplified ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="San Francisco"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
              
              {/* PHASE 2: State field - hidden in simplified mode */}
              {!config.isSimplified && (
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="California"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">{errors.country}</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Images Tab - shown when advanced image features are enabled */}
          {config.features.advancedImageFeatures && (
            <TabsContent value="images" className="space-y-6">
              {/* Logo Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Business Logo</Label>
                  <p className="text-sm text-muted-foreground">
                    Your logo will appear in directory listings and business profiles
                  </p>
                </div>
                <ImageUpload
                  value={formData.logo}
                  onChange={(url) => handleInputChange("logo", url || "")}
                  maxSize={config.images.maxSize}
                  acceptedTypes={config.images.acceptedTypes}
                  placeholder="Upload your business logo"
                  disabled={saving}
                />
              </div>

              {/* Divider */}
              <div className="border-t pt-6">
                <div>
                  <Label className="text-base font-semibold">Business Images</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add photos of your business, products, or services to showcase your work.
                    These images will appear in your business profile and help customers understand your offerings.
                  </p>
                </div>
                <ImageGallery
                  value={formData.businessImages || []}
                  onChange={(urls) => handleInputChange("businessImages", urls)}
                  maxImages={config.images.maxImages - 1} // Reserve 1 slot for logo
                  maxSize={config.images.maxSize}
                  disabled={saving}
                />
                
                {/* Image Management Tips */}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Image Tips:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use high-quality images that represent your business well</li>
                    <li>• The first image will be used as your primary business photo</li>
                    <li>• Recommended size: 1200x800 pixels or larger</li>
                    <li>• Supported formats: JPEG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          )}

          {/* PHASE 2: Sustainability Tab - hidden in simplified mode */}
          {config.featureSettings.tabs.showSustainability && (
            <TabsContent value="sustainability" className="space-y-4">
              <div>
                <Label htmlFor="sustainabilityPractices">Sustainability Practices</Label>
                <Textarea
                  id="sustainabilityPractices"
                  value={formData.sustainabilityPractices}
                  onChange={(e) => handleInputChange("sustainabilityPractices", e.target.value)}
                  placeholder="Describe your environmental initiatives, sustainable practices, and green policies..."
                  rows={5}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Share your commitment to sustainability and environmental responsibility
                </p>
              </div>

              <div>
                <Label htmlFor="certifications">Certifications & Awards</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange("certifications", e.target.value)}
                  placeholder="List any environmental certifications, awards, or recognitions..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Include B-Corp certification, LEED, Energy Star, or other sustainability credentials
                </p>
              </div>
            </TabsContent>
          )}

          {/* PHASE 2: Settings Tab - hidden in simplified mode */}
          {config.featureSettings.tabs.showSettings && (
            <TabsContent value="settings" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="directoryVisibility">Directory Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your business discoverable in the Green Mission directory
                  </p>
                </div>
                <Switch
                  id="directoryVisibility"
                  checked={formData.directoryVisibility}
                  onCheckedChange={(checked) => handleInputChange("directoryVisibility", checked)}
                />
              </div>

              <div>
                <Label>Membership Tier</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  Current tier: <span className="font-medium">{formData.membershipTier}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  To change your membership tier, visit the pricing page
                </p>
              </div>

              <div>
                <Label>Listing Status</Label>
                <div className="text-sm text-muted-foreground mt-1">
                  Status: <span className="font-medium">{formData.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  New listings are reviewed before going live
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Listing
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}