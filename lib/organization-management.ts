// lib/organization-management.ts

import { clerkClient } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"
import { generateBusinessIdentifiers } from "@/lib/business-id-generator"

export interface CreateOrganizationParams {
  businessName: string
  adminUserId: string
  businessData?: {
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
}

export interface OrganizationResult {
  success: boolean
  organizationId: string
  businessId: string
  businessName: string
  slug: string
  airtableRecordId: string
  clerkOrganization: any
  airtableRecord: any
  error?: string
}

/**
 * Complete organization creation with Clerk API and Airtable sync
 */
export async function createCompleteOrganization(
  params: CreateOrganizationParams
): Promise<OrganizationResult> {
  const { businessName, adminUserId, businessData = {} } = params
  
  try {
    console.log(`Creating organization for: ${businessName}`)
    
    // Step 1: Generate unique business identifiers
    const { businessId, slug } = await generateBusinessIdentifiers(businessName)
    console.log(`Generated Business ID: ${businessId}, Slug: ${slug}`)
    
    // Step 2: Create Clerk Organization via API
    const clerkOrganization = await clerkClient.organizations.createOrganization({
      name: businessName,
      slug: slug,
      createdBy: adminUserId,
      publicMetadata: {
        businessId: businessId,
        businessType: "green_mission_member",
        createdAt: new Date().toISOString(),
      },
      privateMetadata: {
        airtableRecordId: null, // Will be updated after Airtable creation
        businessTier: "Basic",
      }
    })
    
    console.log(`Created Clerk organization: ${clerkOrganization.id}`)
    
    // Step 3: Create Airtable record with organization data
    const airtableData = {
      "Business Name": businessName,
      "Business ID": businessId,
      "Slug": slug,
      "Organization ID": clerkOrganization.id,
      "User ID": adminUserId, // Keep for backward compatibility
      "Business Description": businessData.description || "",
      "Website": businessData.website || "",
      "Email": businessData.email || "",
      "Phone": businessData.phone || "",
      "Business Address": businessData.address || "",
      "City": businessData.city || "",
      "State": businessData.state || "",
      "ZIP Code": businessData.zipCode || "",
      "Industry Category": businessData.industry ? [businessData.industry] : [],
      "Services Offered": businessData.services || [],
      "Sustainability Practices": businessData.sustainabilityPractices || "",
      "Certifications": businessData.certifications || [],
      "Business Tags": ["Sustainable", "Local"],
      "Membership Status": "Active",
      "Membership Tier": ["Basic"],
      "Featured Member": false,
      "Directory Visibility": true,
      "Directory Spotlight": false,
      "Newsletter Subscription": true,
      "Member Since": new Date().toISOString().split('T')[0],
      "Last Updated": new Date().toISOString(),
    }
    
    const airtableRecord = await greenMissionClient.createMember(airtableData)
    console.log(`Created Airtable record: ${airtableRecord.id}`)
    
    // Step 4: Update Clerk organization with Airtable record ID
    await clerkClient.organizations.updateOrganization(clerkOrganization.id, {
      privateMetadata: {
        airtableRecordId: airtableRecord.id,
        businessTier: "Basic",
      }
    })
    
    // Step 5: Set the user as admin of the organization
    await clerkClient.organizations.createOrganizationMembership({
      organizationId: clerkOrganization.id,
      userId: adminUserId,
      role: "admin"
    })
    
    console.log(`Successfully created complete organization system`)
    
    return {
      success: true,
      organizationId: clerkOrganization.id,
      businessId,
      businessName,
      slug,
      airtableRecordId: airtableRecord.id,
      clerkOrganization,
      airtableRecord,
    }
    
  } catch (error) {
    console.error("Error creating complete organization:", error)
    
    return {
      success: false,
      organizationId: "",
      businessId: "",
      businessName,
      slug: "",
      airtableRecordId: "",
      clerkOrganization: null,
      airtableRecord: null,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Update organization across Clerk and Airtable
 */
export async function updateCompleteOrganization(
  organizationId: string,
  updates: {
    businessName?: string
    businessData?: Partial<CreateOrganizationParams['businessData']>
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Updating organization: ${organizationId}`)
    
    // Get current organization
    const organization = await clerkClient.organizations.getOrganization({ organizationId })
    const airtableRecordId = organization.privateMetadata?.airtableRecordId as string
    
    if (!airtableRecordId) {
      throw new Error("Organization not linked to Airtable record")
    }
    
    // Update Clerk organization if name changed
    if (updates.businessName && updates.businessName !== organization.name) {
      const newSlug = updates.businessName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      await clerkClient.organizations.updateOrganization(organizationId, {
        name: updates.businessName,
        slug: newSlug,
      })
    }
    
    // Update Airtable record
    if (updates.businessData || updates.businessName) {
      const airtableUpdates: any = {
        "Last Updated": new Date().toISOString(),
      }
      
      if (updates.businessName) {
        airtableUpdates["Business Name"] = updates.businessName
      }
      
      if (updates.businessData) {
        const data = updates.businessData
        if (data.description !== undefined) airtableUpdates["Business Description"] = data.description
        if (data.website !== undefined) airtableUpdates["Website"] = data.website
        if (data.email !== undefined) airtableUpdates["Email"] = data.email
        if (data.phone !== undefined) airtableUpdates["Phone"] = data.phone
        if (data.address !== undefined) airtableUpdates["Business Address"] = data.address
        if (data.city !== undefined) airtableUpdates["City"] = data.city
        if (data.state !== undefined) airtableUpdates["State"] = data.state
        if (data.zipCode !== undefined) airtableUpdates["ZIP Code"] = data.zipCode
        if (data.industry !== undefined) airtableUpdates["Industry Category"] = [data.industry]
        if (data.services !== undefined) airtableUpdates["Services Offered"] = data.services
        if (data.sustainabilityPractices !== undefined) airtableUpdates["Sustainability Practices"] = data.sustainabilityPractices
        if (data.certifications !== undefined) airtableUpdates["Certifications"] = data.certifications
      }
      
      await greenMissionClient.updateMember(airtableRecordId, airtableUpdates)
    }
    
    console.log(`Successfully updated organization: ${organizationId}`)
    return { success: true }
    
  } catch (error) {
    console.error("Error updating organization:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get complete organization data from Clerk and Airtable
 */
export async function getCompleteOrganization(organizationId: string) {
  try {
    // Get Clerk organization
    const organization = await clerkClient.organizations.getOrganization({ organizationId })
    const airtableRecordId = organization.privateMetadata?.airtableRecordId as string
    
    if (!airtableRecordId) {
      throw new Error("Organization not linked to Airtable record")
    }
    
    // Get Airtable data
    const airtableRecords = await greenMissionClient.getMembers({
      filterByFormula: `{Organization ID} = "${organizationId}"`
    })
    
    if (airtableRecords.length === 0) {
      throw new Error("No Airtable record found for organization")
    }
    
    // Get organization members
    const members = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId,
      limit: 100
    })
    
    return {
      success: true,
      organization,
      businessData: airtableRecords[0].fields,
      businessId: organization.publicMetadata?.businessId as string,
      members: members,
      airtableRecordId,
    }
    
  } catch (error) {
    console.error("Error getting complete organization:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get all organizations for a user
 */
export async function getUserCompleteOrganizations(userId: string) {
  try {
    // Get user's organization memberships
    const memberships = await clerkClient.users.getOrganizationMembershipList({ 
      userId,
      limit: 50 
    })
    
    // Get complete data for each organization
    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        try {
          const orgData = await getCompleteOrganization(membership.organization.id)
          return {
            membership,
            ...orgData
          }
        } catch (error) {
          console.error(`Error getting data for organization ${membership.organization.id}:`, error)
          return {
            membership,
            organization: membership.organization,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )
    
    return {
      success: true,
      organizations,
      count: organizations.length
    }
    
  } catch (error) {
    console.error("Error getting user organizations:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      organizations: [],
      count: 0
    }
  }
}

/**
 * Add member to organization
 */
export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role: "admin" | "basic_member" = "basic_member"
) {
  try {
    const membership = await clerkClient.organizations.createOrganizationMembership({
      organizationId,
      userId,
      role
    })
    
    return {
      success: true,
      membership
    }
    
  } catch (error) {
    console.error("Error adding organization member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Remove member from organization
 */
export async function removeOrganizationMember(
  organizationId: string,
  userId: string
) {
  try {
    await clerkClient.organizations.deleteOrganizationMembership({
      organizationId,
      userId
    })
    
    return { success: true }
    
  } catch (error) {
    console.error("Error removing organization member:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Delete organization and associated data
 */
export async function deleteCompleteOrganization(organizationId: string) {
  try {
    // Get organization data first
    const orgData = await getCompleteOrganization(organizationId)
    
    if (orgData.success && orgData.airtableRecordId) {
      // Soft delete in Airtable (don't actually delete, just mark inactive)
      await greenMissionClient.updateMember(orgData.airtableRecordId, {
        "Membership Status": "Inactive",
        "Directory Visibility": false,
        "Last Updated": new Date().toISOString(),
      })
    }
    
    // Delete Clerk organization
    await clerkClient.organizations.deleteOrganization({ organizationId })
    
    return { success: true }
    
  } catch (error) {
    console.error("Error deleting organization:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}