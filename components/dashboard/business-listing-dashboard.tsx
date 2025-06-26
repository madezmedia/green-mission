"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Edit3,
  Eye,
  Globe,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Save,
  ChevronDown
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BusinessListingForm from "./business-listing-form"
import BusinessImageDisplay from "./business-image-display"
import { toast } from "sonner"
import { getDashboardConfig } from "@/lib/config"

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

interface BusinessListingDashboardProps {
  initialListings?: BusinessListing[]
}

export default function BusinessListingDashboard({ initialListings = [] }: BusinessListingDashboardProps) {
  const { user } = useUser()
  const [listings, setListings] = useState<BusinessListing[]>(initialListings)
  const [selectedListingIndex, setSelectedListingIndex] = useState(0)
  const [loading, setLoading] = useState(initialListings.length === 0)
  const [syncing, setSyncing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Get the currently selected listing
  const listing = listings.length > 0 ? listings[selectedListingIndex] : null
  
  // Get dashboard configuration based on feature flags
  const config = getDashboardConfig()

  useEffect(() => {
    // Only fetch if we don't have initial listings
    if (initialListings.length === 0) {
      fetchBusinessListings()
    }
  }, [user, initialListings])

  const fetchBusinessListings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/business-listing")
      const data = await response.json()
      
      if (data.success) {
        setListings([data.listing])
      } else if (data.error === "not_found") {
        // No listings exist yet
        setListings([])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching business listings:", error)
      toast.error("Failed to load business listings")
    } finally {
      setLoading(false)
    }
  }

  // PHASE 2: Airtable sync functionality - preserved for future activation
  const syncWithAirtable = async () => {
    try {
      setSyncing(true)
      const response = await fetch("/api/business-listing/sync", {
        method: "POST"
      })
      const data = await response.json()
      
      if (data.success) {
        // Update the specific listing in the array
        const updatedListings = [...listings]
        updatedListings[selectedListingIndex] = data.listing
        setListings(updatedListings)
        toast.success("Successfully synced with Airtable")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error syncing with Airtable:", error)
      toast.error("Failed to sync with Airtable")
    } finally {
      setSyncing(false)
    }
  }

  const saveListing = async (updatedListing: BusinessListing) => {
    try {
      const response = await fetch("/api/business-listing", {
        method: "POST", // Always use POST since it handles upsert
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedListing)
      })
      const data = await response.json()
      
      if (data.success) {
        // Update the specific listing in the array
        const updatedListings = [...listings]
        updatedListings[selectedListingIndex] = data.listing
        setListings(updatedListings)
        setHasUnsavedChanges(false)
        setIsEditing(false)
        toast.success(data.message || "Listing saved successfully")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving listing:", error)
      toast.error("Failed to save listing")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "Inactive":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Inactive":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!listing && !isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Listing</h1>
          <p className="text-muted-foreground">Manage your business profile in the Green Mission directory</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Create Your Business Listing</CardTitle>
            <CardDescription>
              Get discovered by sustainable partners and customers. Your listing will appear in our directory
              and help build your green network.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setIsEditing(true)} size="lg">
              Create Listing
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {listing ? "Edit Business Listing" : "Create Business Listing"}
            </h1>
            <p className="text-muted-foreground">Update your business information and sustainability practices</p>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>

        {hasUnsavedChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Make sure to save before leaving this page.
            </AlertDescription>
          </Alert>
        )}

        <BusinessListingForm
          listing={listing}
          onSave={saveListing}
          onCancel={() => setIsEditing(false)}
          onChange={() => setHasUnsavedChanges(true)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Listings</h1>
          <p className="text-muted-foreground">Manage your business profiles in the Green Mission directory</p>
        </div>
        <div className="flex gap-2">
          {/* PHASE 2: Airtable sync button - hidden in simplified mode */}
          {config.featureSettings.airtable.enabled && (
            <Button
              variant="outline"
              onClick={syncWithAirtable}
              disabled={syncing}
            >
              {syncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync with Airtable
                </>
              )}
            </Button>
          )}
          <Button onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Listing
          </Button>
        </div>
      </div>

      {/* Business Listing Selector - show when multiple listings exist */}
      {listings.length > 1 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Select Business:</span>
          </div>
          <Select
            value={selectedListingIndex.toString()}
            onValueChange={(value) => setSelectedListingIndex(parseInt(value))}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {listings.map((listing, index) => (
                <SelectItem key={listing.id} value={index.toString()}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{listing.businessName}</span>
                    <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                      {listing.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            {listings.length} business{listings.length !== 1 ? 'es' : ''} found
          </div>
        </div>
      )}

      <div className={`grid gap-6 ${config.isSimplified ? 'md:grid-cols-1' : 'md:grid-cols-3'}`}>
        {/* Status card - always visible */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {listing && getStatusIcon(listing.status)}
          </CardHeader>
          <CardContent>
            {listing && (
              <>
                <Badge className={getStatusColor(listing.status)}>
                  {listing.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {listing.status === "Active" && "Your listing is live in the directory"}
                  {listing.status === "Pending" && "Your listing is under review"}
                  {listing.status === "Inactive" && "Your listing is not visible"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* PHASE 2: Directory Visibility card - hidden in simplified mode */}
        {config.featureSettings.directory.showVisibilityControls && listing && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Directory Visibility</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {listing.directoryVisibility ? "Visible" : "Hidden"}
              </div>
              <p className="text-xs text-muted-foreground">
                {listing.directoryVisibility
                  ? "Your business appears in search results"
                  : "Your business is hidden from the directory"
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* PHASE 2: Last Synced card - hidden in simplified mode */}
        {config.featureSettings.airtable.showSyncStatus && listing && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Synced</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {listing.lastSynced
                  ? new Date(listing.lastSynced).toLocaleDateString()
                  : "Never"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Last synchronized with Airtable
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          {/* Images tab - shown when image management is enabled */}
          {config.features.imageManagement && (
            <TabsTrigger value="images">Images</TabsTrigger>
          )}
          {/* PHASE 2: Sustainability tab - hidden in simplified mode */}
          {config.featureSettings.tabs.showSustainability && (
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {listing?.businessName}
              </CardTitle>
              <CardDescription>{listing?.industry}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{listing?.description}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{listing?.city}, {listing?.state}, {listing?.country}</span>
              </div>
              
              {listing?.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {listing.website}
                  </a>
                </div>
              )}
              
              <Badge variant="secondary">{listing?.membershipTier} Member</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How customers can reach your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{listing?.email}</span>
                </div>
                
                {listing?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.phone}</span>
                  </div>
                )}
              </div>
              
              {listing?.address && (
                <div>
                  <h4 className="font-medium mb-2">Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {listing.address}<br />
                    {listing.city}, {listing.state}<br />
                    {listing.country}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PHASE 2: Sustainability tab content - hidden in simplified mode */}
        {config.featureSettings.tabs.showSustainability && (
          <TabsContent value="sustainability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Practices</CardTitle>
                <CardDescription>Your environmental initiatives and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing && listing.sustainabilityPractices && (
                  <div>
                    <h4 className="font-medium mb-2">Practices</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {listing.sustainabilityPractices}
                    </p>
                  </div>
                )}
                
                {listing && listing.certifications && (
                  <div>
                    <h4 className="font-medium mb-2">Certifications</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {listing.certifications}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Images tab content - shown when image management is enabled */}
        {config.features.imageManagement && (
          <TabsContent value="images" className="space-y-4">
            <BusinessImageDisplay
              logo={listing?.logo}
              businessImages={listing?.businessImages}
              businessName={listing?.businessName}
              onEditClick={() => setIsEditing(true)}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}