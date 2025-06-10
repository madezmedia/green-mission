// components/dashboard/organization-manager.tsx

"use client"

import { useState } from "react"
import { useOrganizations } from "@/hooks/use-organizations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Loader2, Plus, Building, Users, ExternalLink } from "lucide-react"

export default function OrganizationManager() {
  const {
    organizations,
    loading,
    error,
    hasOrganizations,
    isAdminOfAny,
    primaryOrganization,
    createOrganization,
    updateOrganization,
  } = useOrganizations()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [businessName, setBusinessName] = useState("")
  const [businessData, setBusinessData] = useState({
    description: "",
    website: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  })

  const handleCreateOrganization = async () => {
    if (!businessName.trim()) return

    try {
      setCreating(true)
      await createOrganization(businessName.trim(), businessData)
      setCreateDialogOpen(false)
      setBusinessName("")
      setBusinessData({
        description: "",
        website: "",
        email: "",
        phone: "",
        city: "",
        state: "",
      })
    } catch (error) {
      console.error("Failed to create organization:", error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading organizations...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading organizations: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Organizations</h2>
          <p className="text-muted-foreground">
            Manage your business organizations and listings
          </p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={businessData.description}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief business description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={businessData.website}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessData.email}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={businessData.city}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={businessData.state}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateOrganization}
                  disabled={!businessName.trim() || creating}
                >
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organizations List */}
      {!hasOrganizations ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Organizations</h3>
            <p className="text-muted-foreground mb-4">
              Create your first organization to start managing your business listing
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.organization?.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {org.organization?.name || "Unnamed Organization"}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={org.membership?.role === "admin" ? "default" : "secondary"}>
                        {org.membership?.role || "member"}
                      </Badge>
                      {org.businessId && (
                        <Badge variant="outline" className="text-xs">
                          {org.businessId}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {org.businessData?.Website && (
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={org.businessData.Website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {org.businessData?.["Business Description"] && (
                  <p className="text-sm text-muted-foreground">
                    {org.businessData["Business Description"]}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  {org.businessData?.Email && (
                    <div>
                      <span className="font-medium">Email: </span>
                      <span className="text-muted-foreground">{org.businessData.Email}</span>
                    </div>
                  )}
                  
                  {(org.businessData?.City || org.businessData?.State) && (
                    <div>
                      <span className="font-medium">Location: </span>
                      <span className="text-muted-foreground">
                        {[org.businessData.City, org.businessData.State].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  
                  {org.businessData?.["Membership Status"] && (
                    <div>
                      <span className="font-medium">Status: </span>
                      <Badge variant="outline" className="text-xs">
                        {org.businessData["Membership Status"]}
                      </Badge>
                    </div>
                  )}
                </div>

                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{org.members?.length || 0} members</span>
                  </div>
                  
                  {org.membership?.role === "admin" && (
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Primary Organization Summary */}
      {primaryOrganization && (
        <Card>
          <CardHeader>
            <CardTitle>Primary Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{primaryOrganization.organization?.name}</p>
              <p className="text-sm text-muted-foreground">
                Business ID: {primaryOrganization.businessId}
              </p>
              <p className="text-sm text-muted-foreground">
                Role: {primaryOrganization.membership?.role}
              </p>
              {primaryOrganization.businessData?.Slug && (
                <p className="text-sm text-muted-foreground">
                  Directory URL: /directory/{primaryOrganization.businessData.Slug}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}