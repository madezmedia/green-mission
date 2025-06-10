// hooks/use-organizations.ts

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

interface BusinessData {
  description?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  industry?: string
  sustainabilityPractices?: string
  certifications?: string[]
  services?: string[]
}

interface Organization {
  membership: any
  organization: any
  businessData: any
  businessId: string
  members: any[]
  airtableRecordId: string
  success: boolean
  error?: string
}

interface CreateOrganizationResult {
  organizationId: string
  businessId: string
  businessName: string
  slug: string
  airtableRecordId: string
}

export function useOrganizations() {
  const { isLoaded, user } = useUser()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's complete organizations
  const fetchOrganizations = async () => {
    if (!isLoaded || !user) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/organizations/complete")
      const data = await response.json()

      if (data.success) {
        setOrganizations(data.organizations || [])
      } else {
        setError(data.error || "Failed to fetch organizations")
        setOrganizations([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      setOrganizations([])
    } finally {
      setLoading(false)
    }
  }

  // Create new complete organization
  const createOrganization = async (
    businessName: string, 
    businessData?: BusinessData
  ): Promise<CreateOrganizationResult> => {
    try {
      setError(null)

      const response = await fetch("/api/organizations/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessName: businessName.trim(), 
          businessData: businessData || {} 
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchOrganizations() // Refresh the list
        return data.organization
      } else {
        throw new Error(data.error || "Failed to create organization")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Update organization
  const updateOrganization = async (
    organizationId: string, 
    businessName?: string, 
    businessData?: Partial<BusinessData>
  ) => {
    try {
      setError(null)

      const response = await fetch("/api/organizations/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          organizationId, 
          businessName, 
          businessData,
          action: "update"
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchOrganizations() // Refresh the list
        return true
      } else {
        throw new Error(data.error || "Failed to update organization")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Add member to organization
  const addMember = async (organizationId: string, userId: string, role: "admin" | "basic_member" = "basic_member") => {
    try {
      setError(null)

      const response = await fetch("/api/organizations/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          organizationId, 
          targetUserId: userId,
          role,
          action: "add_member"
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchOrganizations() // Refresh the list
        return true
      } else {
        throw new Error(data.error || "Failed to add member")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Remove member from organization
  const removeMember = async (organizationId: string, userId: string) => {
    try {
      setError(null)

      const response = await fetch("/api/organizations/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          organizationId, 
          targetUserId: userId,
          action: "remove_member"
        })
      })

      const data = await response.json()

      if (data.success) {
        await fetchOrganizations() // Refresh the list
        return true
      } else {
        throw new Error(data.error || "Failed to remove member")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Delete organization
  const deleteOrganization = async (organizationId: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/organizations/complete?organizationId=${organizationId}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (data.success) {
        await fetchOrganizations() // Refresh the list
        return true
      } else {
        throw new Error(data.error || "Failed to delete organization")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Get primary organization (first admin role or first organization)
  const getPrimaryOrganization = () => {
    if (organizations.length === 0) return null
    
    // Find first organization where user is admin
    const adminOrg = organizations.find(org => 
      org.success && org.membership?.role === "admin"
    )
    
    return adminOrg || organizations.find(org => org.success) || null
  }

  // Get organization by ID
  const getOrganization = (organizationId: string) => {
    return organizations.find(org => 
      org.success && org.organization?.id === organizationId
    )
  }

  // Check if user has any organizations
  const hasOrganizations = organizations.some(org => org.success)

  // Check if user is admin of any organization
  const isAdminOfAny = organizations.some(org => 
    org.success && org.membership?.role === "admin"
  )

  // Get only successful organizations
  const validOrganizations = organizations.filter(org => org.success)

  useEffect(() => {
    fetchOrganizations()
  }, [isLoaded, user])

  return {
    organizations: validOrganizations,
    allOrganizations: organizations, // Include failed ones for debugging
    loading,
    error,
    hasOrganizations,
    isAdminOfAny,
    primaryOrganization: getPrimaryOrganization(),
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    addMember,
    removeMember,
    deleteOrganization,
    getOrganization,
  }
}