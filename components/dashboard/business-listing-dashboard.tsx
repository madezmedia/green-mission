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
  Save
} from "lucide-react"
import BusinessListingForm from "./business-listing-form"
import { toast } from "sonner"

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
}

interface BusinessListingDashboardProps {
  initialListing?: BusinessListing | null
}

export default function BusinessListingDashboard({ initialListing }: BusinessListingDashboardProps) {
  const { user } = useUser()
  const [listing, setListing] = useState<BusinessListing | null>(initialListing || null)
  const [loading, setLoading] = useState(!initialListing)
  const [syncing, setSyncing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    // Only fetch if we don't have an initial listing
    if (!initialListing) {
      fetchBusinessListing()
    }
  }, [user, initialListing])

  const fetchBusinessListing = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/business-listing")
      const data = await response.json()
      
      if (data.success) {
        setListing(data.listing)
      } else if (data.error === "not_found") {
        // No listing exists yet
        setListing(null)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching business listing:", error)
      toast.error("Failed to load business listing")
    } finally {
      setLoading(false)
    }
  }

  const syncWithAirtable = async () => {
    try {
      setSyncing(true)
      const response = await fetch("/api/business-listing/sync", {
        method: "POST"
      })
      const data = await response.json()
      
      if (data.success) {
        setListing(data.listing)
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
        setListing(data.listing)
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Listing</h1>
          <p className="text-muted-foreground">Manage your business profile in the Green Mission directory</p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={() => setIsEditing(true)}>
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Listing
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {getStatusIcon(listing.status)}
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {listing.status === "Active" && "Your listing is live in the directory"}
              {listing.status === "Pending" && "Your listing is under review"}
              {listing.status === "Inactive" && "Your listing is not visible"}
            </p>
          </CardContent>
        </Card>

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
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {listing.businessName}
              </CardTitle>
              <CardDescription>{listing.industry}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{listing.description}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{listing.city}, {listing.state}, {listing.country}</span>
              </div>
              
              {listing.website && (
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
              
              <Badge variant="secondary">{listing.membershipTier} Member</Badge>
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
                  <span>{listing.email}</span>
                </div>
                
                {listing.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.phone}</span>
                  </div>
                )}
              </div>
              
              {listing.address && (
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

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Practices</CardTitle>
              <CardDescription>Your environmental initiatives and certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.sustainabilityPractices && (
                <div>
                  <h4 className="font-medium mb-2">Practices</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {listing.sustainabilityPractices}
                  </p>
                </div>
              )}
              
              {listing.certifications && (
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
      </Tabs>
    </div>
  )
}