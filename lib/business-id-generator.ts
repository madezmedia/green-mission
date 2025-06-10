// Business ID and Slug Generation System
import { greenMissionClient } from './airtable/green-mission-client'

/**
 * Generate a unique business ID in format: GM-YYYYMMDD-XXXX
 * Where XXXX is a 4-digit incremental number
 */
export async function generateBusinessId(): Promise<string> {
  const today = new Date()
  const datePrefix = today.getFullYear().toString() + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + 
                    today.getDate().toString().padStart(2, '0')
  
  // Get existing business IDs for today to find next increment
  try {
    const existingMembers = await greenMissionClient.getMembers({
      limit: 1000
    })
    
    const todayPrefix = `GM-${datePrefix}`
    const todayIds = existingMembers
      .map((member: any) => member.fields?.["Business ID"])
      .filter((id: string) => id?.startsWith(todayPrefix))
      .map((id: string) => {
        const parts = id.split('-')
        return parseInt(parts[2] || '0')
      })
      .filter((num: number) => !isNaN(num))
    
    const nextIncrement = todayIds.length > 0 ? Math.max(...todayIds) + 1 : 1
    
    return `${todayPrefix}-${nextIncrement.toString().padStart(4, '0')}`
  } catch (error) {
    // Fallback to timestamp-based ID
    return `GM-${datePrefix}-${Date.now().toString().slice(-4)}`
  }
}

/**
 * Generate a URL-safe slug from business name with collision handling
 */
export async function generateUniqueSlug(businessName: string, businessId?: string): Promise<string> {
  // Create base slug from business name
  let baseSlug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')        // Remove leading/trailing hyphens
    .trim()
  
  // Ensure minimum length
  if (baseSlug.length < 3) {
    baseSlug = businessId ? `business-${businessId.toLowerCase()}` : `business-${Date.now()}`
  }
  
  // Check for existing slugs and handle collisions
  try {
    const existingMembers = await greenMissionClient.getMembers({
      limit: 1000
    })
    
    const existingSlugs = existingMembers
      .map((member: any) => member.fields?.["Slug"])
      .filter((slug: string) => slug && slug.startsWith(baseSlug))
    
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug
    }
    
    // Handle collision by appending number
    let counter = 1
    let uniqueSlug = baseSlug
    
    while (existingSlugs.includes(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`
      counter++
      
      // Safety check to prevent infinite loop
      if (counter > 999) {
        uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-6)}`
        break
      }
    }
    
    return uniqueSlug
  } catch (error) {
    // Fallback: append timestamp
    return `${baseSlug}-${Date.now().toString().slice(-6)}`
  }
}

/**
 * Validate business ID format
 */
export function isValidBusinessId(businessId: string): boolean {
  const pattern = /^GM-\d{8}-\d{4}$/
  return pattern.test(businessId)
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return pattern.test(slug) && slug.length >= 3 && slug.length <= 100
}

/**
 * Generate both Business ID and Slug for a new business
 */
export async function generateBusinessIdentifiers(businessName: string): Promise<{
  businessId: string
  slug: string
}> {
  const businessId = await generateBusinessId()
  const slug = await generateUniqueSlug(businessName, businessId)
  
  return {
    businessId,
    slug
  }
}