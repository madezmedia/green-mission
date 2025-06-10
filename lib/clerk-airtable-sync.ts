// lib/clerk-airtable-sync.ts

import { clerkClient } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"
import { generateBusinessIdentifiers } from "@/lib/business-id-generator"

export interface OrganizationSyncData {
  organizationId: string
  businessId: string
  businessName: string
  slug: string
  adminUserId: string
  createdAt: string
}

/**
 * Creates a Clerk organization and syncs it with Airtable
 */
export async function createOrganizationWithSync(
  businessName: string,
  adminUserId: string,
  businessData: any
): Promise<OrganizationSyncData> {
  try {
    // 1. Generate business identifiers
    const { businessId, slug } = await generateBusinessIdentifiers(businessName)
    
    // 2. Create Clerk organization
    const organization = await clerkClient.organizations.createOrganization({
      name: businessName,
      slug: slug,
      createdBy: adminUserId,
      publicMetadata: {
        businessId: businessId,
        airtableRecordId: null, // Will be updated after Airtable creation
      }
    })
    
    // 3. Create Airtable record
    const airtableData = {
      ...businessData,
      "Business Name": businessName,
      "Business ID": businessId,
      "Slug": slug,
      "Organization ID": organization.id,
      "User ID": adminUserId, // Keep for backward compatibility
      "Membership Status": "Active",
      "Directory Visibility": true,
    }
    
    const airtableRecord = await greenMissionClient.createMember(airtableData)
    
    // 4. Update Clerk organization with Airtable record ID
    await clerkClient.organizations.updateOrganization(organization.id, {
      publicMetadata: {
        businessId: businessId,
        airtableRecordId: airtableRecord.id,
      }
    })
    
    // 5. Make the user an admin of the organization
    await clerkClient.organizations.createOrganizationMembership({
      organizationId: organization.id,
      userId: adminUserId,
      role: "admin"
    })
    
    return {
      organizationId: organization.id,
      businessId,
      businessName,
      slug,
      adminUserId,
      createdAt: organization.createdAt.toString()
    }
    
  } catch (error) {
    console.error("Error creating organization with sync:", error)
    throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Updates both Clerk organization and Airtable record
 */
export async function updateOrganizationWithSync(
  organizationId: string,
  updates: {
    businessName?: string
    businessData?: any
  }
): Promise<void> {
  try {
    // 1. Get current organization
    const organization = await clerkClient.organizations.getOrganization({ organizationId })
    const airtableRecordId = organization.publicMetadata?.airtableRecordId as string
    
    if (!airtableRecordId) {
      throw new Error("Organization not linked to Airtable record")
    }
    
    // 2. Update Clerk organization if name changed
    if (updates.businessName && updates.businessName !== organization.name) {
      const newSlug = updates.businessName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
      
      await clerkClient.organizations.updateOrganization(organizationId, {
        name: updates.businessName,
        slug: newSlug,
      })
    }
    
    // 3. Update Airtable record
    if (updates.businessData) {
      const airtableUpdates = {
        ...updates.businessData,
        ...(updates.businessName && { "Business Name": updates.businessName }),
      }
      
      await greenMissionClient.updateMember(airtableRecordId, airtableUpdates)
    }
    
  } catch (error) {
    console.error("Error updating organization with sync:", error)
    throw new Error(`Failed to update organization: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Gets organization data from both Clerk and Airtable
 */
export async function getOrganizationWithData(organizationId: string) {
  try {
    // 1. Get Clerk organization
    const organization = await clerkClient.organizations.getOrganization({ organizationId })
    const airtableRecordId = organization.publicMetadata?.airtableRecordId as string
    
    if (!airtableRecordId) {
      throw new Error("Organization not linked to Airtable record")
    }
    
    // 2. Get Airtable data
    const airtableRecords = await greenMissionClient.getMembers({
      filterByFormula: `{Organization ID} = "${organizationId}"`
    })
    
    if (airtableRecords.length === 0) {
      throw new Error("No Airtable record found for organization")
    }
    
    return {
      organization,
      businessData: airtableRecords[0],
      businessId: organization.publicMetadata?.businessId as string,
    }
    
  } catch (error) {
    console.error("Error getting organization with data:", error)
    throw new Error(`Failed to get organization data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Gets user's organization memberships and associated business data
 */
export async function getUserOrganizations(userId: string) {
  try {
    // 1. Get user's organization memberships
    const memberships = await clerkClient.users.getOrganizationMembershipList({ userId })
    
    // 2. Get business data for each organization
    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        try {
          const orgData = await getOrganizationWithData(membership.organization.id)
          return {
            membership,
            ...orgData
          }
        } catch (error) {
          console.error(`Error getting data for organization ${membership.organization.id}:`, error)
          return {
            membership,
            organization: membership.organization,
            businessData: null,
            businessId: null,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )
    
    return organizations
    
  } catch (error) {
    console.error("Error getting user organizations:", error)
    throw new Error(`Failed to get user organizations: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Webhook handler for Clerk organization events
 */
export async function handleClerkOrganizationWebhook(
  eventType: string,
  organizationData: any
) {
  try {
    switch (eventType) {
      case 'organization.updated':
        // Sync name changes to Airtable
        const airtableRecordId = organizationData.public_metadata?.airtableRecordId
        if (airtableRecordId) {
          await greenMissionClient.updateMember(airtableRecordId, {
            "Business Name": organizationData.name,
            "Slug": organizationData.slug,
          })
        }
        break
        
      case 'organization.deleted':
        // Handle organization deletion (soft delete in Airtable)
        const recordId = organizationData.public_metadata?.airtableRecordId
        if (recordId) {
          await greenMissionClient.updateMember(recordId, {
            "Membership Status": "Inactive",
            "Directory Visibility": false,
          })
        }
        break
        
      default:
        console.log(`Unhandled organization event: ${eventType}`)
    }
    
  } catch (error) {
    console.error("Error handling Clerk organization webhook:", error)
    throw error
  }
}