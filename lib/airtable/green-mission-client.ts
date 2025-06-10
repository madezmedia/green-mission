// lib/airtable/green-mission-client.ts

import Airtable, { type Record, type FieldSet } from "airtable"
import type { Base as AirtableBase } from "airtable/lib/base"

// Types for the three-base architecture
export type GreenMissionBaseType = "cms" | "directory" | "branding"

interface AirtableConfig {
  apiKey: string
  baseId: string
  configured: boolean
}

export interface GreenMissionMultiBaseConfig {
  cms: AirtableConfig
  directory: AirtableConfig
  branding: AirtableConfig
}

// Interface definitions for each base
export interface BlogPost extends FieldSet {
  id: string
  Title: string // Field names match Airtable
  Slug: string
  Content?: string
  Excerpt?: string
  "Featured Image"?: { url: string }[]
  Author?: readonly string[] // Link to Authors table (array of record IDs)
  Categories?: readonly string[] // Link to Content Categories table
  Tags?: string[]
  Status: "Draft" | "Review" | "Published" | "Archived"
  "Published Date"?: string
  Featured?: boolean
  "SEO Title"?: string
  "Meta Description"?: string
  "Read Time"?: number
  "View Count"?: number
  "Member Only"?: boolean
  "Tier Access"?: string[]
}

export interface MemberBusiness extends FieldSet {
  id: string
  "Business Name": string
  Slug: string
  "Owner Name"?: string
  Email: string
  Phone?: string
  Website?: string
  "Business Description"?: string
  "Short Description"?: string
  Logo?: { url: string }[]
  "Business Images"?: { url: string }[]
  "Business Address"?: string
  City?: string
  State?: string
  "ZIP Code"?: string
  Country?: string
  Coordinates?: string // "latitude,longitude"
  "Industry Category"?: readonly string[] // Link to Directory Categories
  "Business Tags"?: string[]
  "Services Offered"?: string[]
  "Sustainability Practices"?: string
  "Membership Tier"?: readonly string[] // Link to Membership Tiers
  "Member Since"?: string // Date
  "Membership Status": "Active" | "Pending" | "Suspended" | "Expired"
  "Featured Member"?: boolean
  "Directory Spotlight"?: boolean
  "Sustainability Score"?: number // Rating 1-5
  Certifications?: string[]
  "Social Media Links"?: string // JSON string
  "Operating Hours"?: string
  "Contact Preferences"?: string[]
  "Newsletter Subscription"?: boolean
  "Directory Visibility"?: boolean
  "User ID"?: string // Clerk User ID for linking records
  "Last Updated"?: string // Last Modified Time
}

export interface MembershipTier extends FieldSet {
  id: string
  "Tier Name": string
  "Display Name"?: string
  Description?: string
  Price?: number
  "Billing Period": "Monthly" | "Yearly"
  Features?: string // JSON array or multiline text
  "Directory Benefits"?: string[]
  "Content Access"?: string[]
  "Badge Color"?: string // Hex color
  "Badge Icon"?: string // Icon name/class
  "Max Listings"?: number
  "Featured Spots"?: number
  "Support Level": "Basic" | "Priority" | "Premium"
  Active?: boolean
  Order?: number
  "Stripe Price ID"?: string
}

export interface BrandAsset extends FieldSet {
  id: string
  "Asset Name": string
  "Asset Type": "Logo" | "Icon" | "Image" | "Document"
  File?: { url: string }[]
  Description?: string
  "Usage Guidelines"?: string
  "File Format"?: string[]
  Dimensions?: string
  "Color Variant": "Full Color" | "White" | "Black" | "Green"
  "Size Variant": "Large" | "Medium" | "Small" | "Icon"
  "Use Case"?: string[]
  Active?: boolean
  "Download Count"?: number
  "Last Updated"?: string
}

// Helper to extract first attachment URL
const getAttachmentUrl = (attachments: readonly { url: string }[] | undefined): string | undefined => {
  return attachments && attachments.length > 0 ? attachments[0].url : undefined
}

// Helper to extract multiple attachment URLs
const getAttachmentUrls = (attachments: readonly { url: string }[] | undefined): string[] => {
  return attachments ? attachments.map((att) => att.url) : []
}

// Configuration functions
export function getGreenMissionAirtableConfigs(): GreenMissionMultiBaseConfig {
  return {
    cms: {
      apiKey: process.env.AIRTABLE_CMS_API_KEY || process.env.AIRTABLE_API_KEY || "",
      baseId: process.env.AIRTABLE_CMS_BASE_ID || "",
      configured: !!(
        process.env.AIRTABLE_CMS_BASE_ID &&
        (process.env.AIRTABLE_CMS_API_KEY || process.env.AIRTABLE_API_KEY)
      ),
    },
    directory: {
      apiKey: process.env.AIRTABLE_DIR_API_KEY || process.env.AIRTABLE_API_KEY || "",
      baseId: process.env.AIRTABLE_DIR_BASE_ID || "",
      configured: !!(
        process.env.AIRTABLE_DIR_BASE_ID &&
        (process.env.AIRTABLE_DIR_API_KEY || process.env.AIRTABLE_API_KEY)
      ),
    },
    branding: {
      apiKey: process.env.AIRTABLE_BRAND_API_KEY || process.env.AIRTABLE_API_KEY || "",
      baseId: process.env.AIRTABLE_BRAND_BASE_ID || "",
      configured: !!(
        process.env.AIRTABLE_BRAND_BASE_ID &&
        (process.env.AIRTABLE_BRAND_API_KEY || process.env.AIRTABLE_API_KEY)
      ),
    },
  }
}

export function getGreenMissionConfigurationStatus() {
  const configs = getGreenMissionAirtableConfigs()
  return {
    cms: {
      configured: configs.cms.configured,
      baseId: configs.cms.baseId || "Not configured",
      apiKey: configs.cms.apiKey ? "Configured" : "Not configured",
    },
    directory: {
      configured: configs.directory.configured,
      baseId: configs.directory.baseId || "Not configured",
      apiKey: configs.directory.apiKey ? "Configured" : "Not configured",
    },
    branding: {
      configured: configs.branding.configured,
      baseId: configs.branding.baseId || "Not configured",
      apiKey: configs.branding.apiKey ? "Configured" : "Not configured",
    },
  }
}

// Base connection function
function getGreenMissionAirtableBase(baseType: GreenMissionBaseType): AirtableBase {
  const configs = getGreenMissionAirtableConfigs()
  const config = configs[baseType]

  if (!config.configured) {
    throw new Error(
      `Green Mission Airtable ${baseType} base is not configured. Please set AIRTABLE_${baseType === 'directory' ? 'DIR' : baseType.toUpperCase()}_BASE_ID and relevant API_KEY environment variables.`,
    )
  }

  // console.log(`Using Green Mission ${baseType} base:`, config.baseId) // Avoid logging in production

  // Airtable.configure({ apiKey: config.apiKey }); // Global config is problematic for multi-key
  const airtable = new Airtable({ apiKey: config.apiKey })
  return airtable.base(config.baseId)
}

// CMS Base Functions
export async function getGreenMissionBlogPosts(
  options: {
    status?: string
    featured?: boolean
    memberOnly?: boolean
    tierAccess?: string
    limit?: number
  } = {},
): Promise<Partial<BlogPost>[]> {
  // Return Partial as not all fields might be present
  try {
    const base = getGreenMissionAirtableBase("cms")
    const table = base("Blog Posts")

    let filterFormula = "AND({Status} = 'Published')"

    if (options.featured) {
      filterFormula += ", {Featured} = TRUE()"
    }

    if (options.memberOnly !== undefined) {
      filterFormula += `, {"Member Only"} = ${options.memberOnly ? "TRUE()" : "FALSE()"}`
    }

    if (options.tierAccess) {
      filterFormula += `, FIND('${options.tierAccess}', {Tier Access}) > 0`
    }

    const records = await table
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: "Published Date", direction: "desc" }],
        maxRecords: options.limit || 100,
      })
      .all()

    return records.map((record: Record<Partial<BlogPost>>) => ({
      id: record.id,
      Title: record.get("Title"),
      Slug: record.get("Slug"),
      Content: record.get("Content"),
      Excerpt: record.get("Excerpt"),
      "Featured Image": record.get("Featured Image"), // Keep as Airtable attachment structure
      Author: record.get("Author"),
      Categories: record.get("Categories"),
      Tags: record.get("Tags"),
      Status: record.get("Status"),
      "Published Date": record.get("Published Date"),
      Featured: record.get("Featured"),
      "SEO Title": record.get("SEO Title"),
      "Meta Description": record.get("Meta Description"),
      "Read Time": record.get("Read Time"),
      "View Count": record.get("View Count") || 0,
      "Member Only": record.get("Member Only"),
      "Tier Access": record.get("Tier Access"),
    }))
  } catch (error) {
    console.error("Error fetching Green Mission blog posts from CMS base:", error)
    return []
  }
}

export async function getGreenMissionWebsitePages(slug?: string): Promise<any[]> {
  try {
    const base = getGreenMissionAirtableBase("cms")
    const table = base("Website Pages")

    const options: any = {
      filterByFormula: "{Status} = 'Published'",
      sort: [{ field: "Order", direction: "asc" }],
    }

    if (slug) {
      options.filterByFormula = `AND({Status} = 'Published', {Slug} = '${slug}')`
      options.maxRecords = 1
    }

    const records = await table.select(options).all()

    return records.map((record) => ({
      id: record.id,
      pageTitle: record.get("Page Title") as string,
      slug: record.get("Slug") as string,
      content: record.get("Content") as string,
      pageType: record.get("Page Type") as string,
      template: record.get("Template") as string,
      heroTitle: record.get("Hero Title") as string,
      heroSubtitle: record.get("Hero Subtitle") as string,
      heroImage: getAttachmentUrl(record.get("Hero Image") as any),
      heroCTAText: record.get("Hero CTA Text") as string,
      heroCTALink: record.get("Hero CTA Link") as string,
      seoTitle: record.get("SEO Title") as string,
      metaDescription: record.get("Meta Description") as string,
      status: record.get("Status") as string,
      order: record.get("Order") as number,
      navigationMenu: record.get("Navigation Menu") as boolean,
    }))
  } catch (error) {
    console.error("Error fetching Green Mission website pages from CMS base:", error)
    return []
  }
}

export async function getGreenMissionTestimonials(
  options: {
    featured?: boolean
    membershipTier?: string
    useCase?: string
    limit?: number
  } = {},
): Promise<any[]> {
  try {
    const base = getGreenMissionAirtableBase("cms")
    const table = base("Testimonials")

    let filterFormula = "AND({Approved} = TRUE())"

    if (options.featured) {
      filterFormula += ", {Featured} = TRUE()"
    }

    if (options.membershipTier) {
      filterFormula += `, {"Membership Tier"} = '${options.membershipTier}'`
    }

    if (options.useCase) {
      filterFormula += `, FIND('${options.useCase}', {"Use Case"}) > 0`
    }

    const records = await table
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: "Date Submitted", direction: "desc" }],
        maxRecords: options.limit || 50,
      })
      .all()

    return records.map((record) => ({
      id: record.id,
      clientName: record.get("Client Name") as string,
      businessName: record.get("Business Name") as string,
      position: record.get("Position") as string,
      testimonial: record.get("Testimonial") as string,
      rating: record.get("Rating") as number,
      image: getAttachmentUrl(record.get("Image") as any),
      location: record.get("Location") as string,
      industry: record.get("Industry") as string,
      membershipTier: record.get("Membership Tier") as string,
      featured: record.get("Featured") as boolean,
      approved: record.get("Approved") as boolean,
      dateSubmitted: record.get("Date Submitted") as string,
      useCase: record.get("Use Case") as string,
    }))
  } catch (error) {
    console.error("Error fetching Green Mission testimonials from CMS base:", error)
    return []
  }
}

// Directory Base Functions
export async function getGreenMissionMemberBusinesses(
  options: {
    membershipStatus?: string
    featuredMember?: boolean
    directorySpotlight?: boolean
    directoryVisibility?: boolean
    industryCategory?: string
    city?: string
    state?: string
    limit?: number
    slug?: string // Added slug option
  } = {},
): Promise<Partial<MemberBusiness>[]> {
  try {
    const base = getGreenMissionAirtableBase("directory")
    const table = base("Member Businesses")

    let filterFormula = ""
    const conditions: string[] = []

    // Filter by Directory Visibility 
    if (options.directoryVisibility === true) {
      conditions.push('{Directory Visibility} = TRUE()')
    } else if (options.directoryVisibility === false) {
      conditions.push('{Directory Visibility} = FALSE()')
    }
    // If not specified, show all regardless of Directory Visibility

    if (options.membershipStatus) {
      conditions.push(`{Membership Status} = '${options.membershipStatus}'`)
    }
    // If not specified, show all membership statuses (Active, Pending, etc.)

    if (options.featuredMember) {
      conditions.push('{Featured Member} = TRUE()')
    }

    if (options.directorySpotlight) {
      conditions.push('{Directory Spotlight} = TRUE()')
    }

    if (options.industryCategory) {
      // Assuming "Industry Category" is a linked record, this might need adjustment
      // For simple text match:
      conditions.push(`FIND('${options.industryCategory}', ARRAYJOIN({"Industry Category (Name)"})) > 0`)
    }

    if (options.city) {
      conditions.push(`{City} = '${options.city}'`)
    }

    if (options.state) {
      conditions.push(`{State} = '${options.state}'`)
    }
    if (options.slug) {
      conditions.push(`{Slug} = '${options.slug}'`)
    }

    if (conditions.length > 0) {
      filterFormula = conditions.length === 1 ? conditions[0] : `AND(${conditions.join(", ")})`
    }

    const selectOptions: any = {
      sort: [
        { field: "Featured Member", direction: "desc" },
        { field: "Business Name", direction: "asc" },
      ],
      maxRecords: options.limit || 100,
    }

    // Only add filterByFormula if we have conditions
    if (filterFormula) {
      selectOptions.filterByFormula = filterFormula
    }

    const records = await table.select(selectOptions).all()

    return records.map((record: Record<Partial<MemberBusiness>>) => ({
      id: record.id,
      "Business Name": record.get("Business Name"),
      Slug: record.get("Slug"),
      "Owner Name": record.get("Owner Name"),
      Email: record.get("Email"),
      Phone: record.get("Phone"),
      Website: record.get("Website"),
      "Business Description": record.get("Business Description"),
      "Short Description": record.get("Short Description"),
      Logo: record.get("Logo"),
      "Business Images": record.get("Business Images"),
      "Business Address": record.get("Business Address"),
      City: record.get("City"),
      State: record.get("State"),
      "ZIP Code": record.get("ZIP Code"),
      Coordinates: record.get("Coordinates"),
      "Industry Category": record.get("Industry Category"),
      "Business Tags": record.get("Business Tags"),
      "Services Offered": record.get("Services Offered"),
      "Membership Tier": record.get("Membership Tier"),
      "Member Since": record.get("Member Since"),
      "Membership Status": record.get("Membership Status"),
      "Featured Member": record.get("Featured Member"),
      "Directory Spotlight": record.get("Directory Spotlight"),
      "Sustainability Score": record.get("Sustainability Score"),
      Certifications: record.get("Certifications"),
      "Social Media Links": record.get("Social Media Links"),
      "Operating Hours": record.get("Operating Hours"),
      "Contact Preferences": record.get("Contact Preferences"),
      "Newsletter Subscription": record.get("Newsletter Subscription"),
      "Directory Visibility": record.get("Directory Visibility"),
      "Last Updated": record.get("Last Updated"),
    }))
  } catch (error) {
    console.error("Error fetching Green Mission member businesses from directory base:", error)
    return []
  }
}

export async function getGreenMissionMembershipTiers(activeOnly = true): Promise<Partial<MembershipTier>[]> {
  try {
    const base = getGreenMissionAirtableBase("directory")
    const table = base("Membership Tiers")

    const options: any = {
      sort: [{ field: "Order", direction: "asc" }],
    }

    if (activeOnly) {
      options.filterByFormula = "{Active} = TRUE()"
    }

    const records = await table.select(options).all()

    return records.map((record: Record<Partial<MembershipTier>>) => ({
      id: record.id,
      "Tier Name": record.get("Tier Name"),
      "Display Name": record.get("Display Name"),
      Description: record.get("Description"),
      Price: record.get("Price"),
      "Billing Period": record.get("Billing Period"),
      Features: record.get("Features"),
      "Directory Benefits": record.get("Directory Benefits"),
      "Content Access": record.get("Content Access"),
      "Badge Color": record.get("Badge Color"),
      "Badge Icon": record.get("Badge Icon"),
      "Max Listings": record.get("Max Listings"),
      "Featured Spots": record.get("Featured Spots"),
      "Support Level": record.get("Support Level"),
      Active: record.get("Active"),
      Order: record.get("Order"),
      "Stripe Price ID": record.get("Stripe Price ID"),
    }))
  } catch (error) {
    console.error("Error fetching Green Mission membership tiers from directory base:", error)
    return []
  }
}

export async function getGreenMissionDirectoryCategories(activeOnly = true): Promise<any[]> {
  try {
    const base = getGreenMissionAirtableBase("directory")
    const table = base("Directory Categories")

    const options: any = {
      sort: [{ field: "Order", direction: "asc" }],
    }

    if (activeOnly) {
      options.filterByFormula = "{Active} = TRUE()"
    }

    const records = await table.select(options).all()

    return records.map((record) => ({
      id: record.id,
      categoryName: record.get("Category Name") as string,
      slug: record.get("Slug") as string,
      description: record.get("Description") as string,
      icon: record.get("Icon") as string, // Assuming icon name/class
      color: record.get("Color") as string,
      parentCategory: record.get("Parent Category")?.[0], // Link to self
      order: record.get("Order") as number,
      active: record.get("Active") as boolean,
      memberCount: (record.get("Member Count") as number) || 0, // Rollup or Count field
      seoTitle: record.get("SEO Title") as string,
      metaDescription: record.get("Meta Description") as string,
    }))
  } catch (error) {
    console.error("Error fetching Green Mission directory categories from directory base:", error)
    return []
  }
}

// Branding Base Functions
export async function getGreenMissionBrandAssets(
  options: {
    assetType?: string
    colorVariant?: string
    sizeVariant?: string
    useCase?: string
    activeOnly?: boolean
    limit?: number
  } = {},
): Promise<Partial<BrandAsset>[]> {
  try {
    const base = getGreenMissionAirtableBase("branding")
    const table = base("Brand Assets")

    let filterFormula = ""
    const conditions: string[] = []

    if (options.activeOnly !== false) {
      conditions.push("{Active} = TRUE()")
    }

    if (options.assetType) {
      conditions.push(`{Asset Type} = '${options.assetType}'`)
    }

    if (options.colorVariant) {
      conditions.push(`{"Color Variant"} = '${options.colorVariant}'`)
    }

    if (options.sizeVariant) {
      conditions.push(`{"Size Variant"} = '${options.sizeVariant}'`)
    }

    if (options.useCase) {
      conditions.push(`FIND('${options.useCase}', {"Use Case"}) > 0`)
    }

    if (conditions.length > 0) {
      filterFormula = conditions.length === 1 ? conditions[0] : `AND(${conditions.join(", ")})`
    }

    const selectOptions: any = {
      sort: [{ field: "Asset Name", direction: "asc" }],
      maxRecords: options.limit || 100,
    }

    if (filterFormula) {
      selectOptions.filterByFormula = filterFormula
    }

    const records = await table.select(selectOptions).all()

    return records.map((record: Record<Partial<BrandAsset>>) => ({
      id: record.id,
      "Asset Name": record.get("Asset Name"),
      "Asset Type": record.get("Asset Type"),
      File: record.get("File"),
      Description: record.get("Description"),
      "Usage Guidelines": record.get("Usage Guidelines"),
      "File Format": record.get("File Format"),
      Dimensions: record.get("Dimensions"),
      "Color Variant": record.get("Color Variant"),
      "Size Variant": record.get("Size Variant"),
      "Use Case": record.get("Use Case"),
      Active: record.get("Active"),
      "Download Count": record.get("Download Count") || 0,
      "Last Updated": record.get("Last Updated"),
    }))
  } catch (error) {
    console.error("Error fetching Green Mission brand assets from branding base:", error)
    return []
  }
}

export async function getGreenMissionMarketingMaterials(
  options: {
    type?: string
    templateCategory?: string
    targetAudience?: string
    activeOnly?: boolean
    limit?: number
  } = {},
): Promise<any[]> {
  try {
    const base = getGreenMissionAirtableBase("branding")
    const table = base("Marketing Materials")

    let filterFormula = ""
    const conditions: string[] = []

    if (options.activeOnly !== false) {
      conditions.push("{Active} = TRUE()")
    }

    if (options.type) {
      conditions.push(`{Type} = '${options.type}'`)
    }

    if (options.templateCategory) {
      conditions.push(`{"Template Category"} = '${options.templateCategory}'`)
    }

    if (options.targetAudience) {
      conditions.push(`FIND('${options.targetAudience}', {"Target Audience"}) > 0`)
    }

    if (conditions.length > 0) {
      filterFormula = conditions.length === 1 ? conditions[0] : `AND(${conditions.join(", ")})`
    }

    const selectOptions: any = {
      sort: [{ field: "Created Date", direction: "desc" }],
      maxRecords: options.limit || 50,
    }

    if (filterFormula) {
      selectOptions.filterByFormula = filterFormula
    }

    const records = await table.select(selectOptions).all()

    return records.map((record) => ({
      id: record.id,
      materialName: record.get("Material Name") as string,
      type: record.get("Type") as string,
      description: record.get("Description") as string,
      file: getAttachmentUrl(record.get("File") as any),
      previewImage: getAttachmentUrl(record.get("Preview Image") as any),
      templateCategory: record.get("Template Category") as string,
      targetAudience: (record.get("Target Audience") as string[]) || [],
      format: (record.get("Format") as string[]) || [],
      usageInstructions: record.get("Usage Instructions") as string,
      brandCompliance: record.get("Brand Compliance") as boolean,
      active: record.get("Active") as boolean,
      createdDate: record.get("Created Date") as string,
    }))
  } catch (error) {
    console.error("Error fetching Green Mission marketing materials from branding base:", error)
    return []
  }
}

export async function getGreenMissionBadgeDesigns(membershipTier?: string): Promise<any[]> {
  try {
    const base = getGreenMissionAirtableBase("branding")
    const table = base("Badge Designs")

    let filterFormula = "{Active} = TRUE()"

    if (membershipTier) {
      // Assuming "Membership Tier" is a linked record, adjust if it's a text field
      filterFormula += `, FIND('${membershipTier}', ARRAYJOIN({"Membership Tier (Name)"})) > 0`
    }

    const records = await table
      .select({
        filterByFormula: filterFormula,
        sort: [{ field: "Badge Name", direction: "asc" }],
      })
      .all()

    return records.map((record) => ({
      id: record.id,
      badgeName: record.get("Badge Name") as string,
      membershipTier: record.get("Membership Tier")?.[0], // Link to Membership Tiers
      badgeType: record.get("Badge Type") as string,
      designFile: getAttachmentUrl(record.get("Design File") as any),
      colorScheme: record.get("Color Scheme") as string,
      dimensions: record.get("Dimensions") as string,
      format: (record.get("Format") as string[]) || [],
      background: record.get("Background") as string,
      usageContext: (record.get("Usage Context") as string[]) || [],
      active: record.get("Active") as boolean,
      version: record.get("Version") as string,
    }))
  } catch (error) {
    console.error("Error fetching Green Mission badge designs from branding base:", error)
    return []
  }
}

// Helper function to create new member business
export async function createGreenMissionMemberBusiness(memberData: Partial<MemberBusiness>): Promise<string | null> {
  try {
    const base = getGreenMissionAirtableBase("directory")
    const table = base("Member Businesses")

    // Airtable expects field names as they appear in Airtable, not camelCase from TS interface
    const airtableData: Record<FieldSet> = {}
    for (const key in memberData) {
      // A simple heuristic to convert camelCase to Title Case for Airtable field names
      // This might need to be more robust or use a mapping if field names differ significantly
      const airtableKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      airtableData[airtableKey] = (memberData as any)[key]
    }
    // Ensure required fields are present if your Airtable base requires them
    if (!airtableData["Business Name"] || !airtableData["Email"]) {
      console.error("Business Name and Email are required to create a member.")
      return null
    }

    const record = await table.create([{ fields: airtableData as FieldSet }])
    console.log("Created new Green Mission member business:", record[0].id)
    return record[0].id
  } catch (error) {
    console.error("Error creating Green Mission member business:", error)
    return null
  }
}

// Helper function to update member business
export async function updateGreenMissionMemberBusiness(id: string, updates: Partial<MemberBusiness>): Promise<boolean> {
  try {
    const base = getGreenMissionAirtableBase("directory")
    const table = base("Member Businesses")

    const airtableUpdates: Record<FieldSet> = {}
    for (const key in updates) {
      const airtableKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      airtableUpdates[airtableKey] = (updates as any)[key]
    }

    await table.update([{ id, fields: airtableUpdates as FieldSet }])
    console.log("Updated Green Mission member business:", id)
    return true
  } catch (error) {
    console.error("Error updating Green Mission member business:", error)
    return false
  }
}

// Simplified client class for business listing management
export class GreenMissionClient {
  // Get members with filtering options
  async getMembers(options: { filterByFormula?: string } = {}) {
    try {
      const base = getGreenMissionAirtableBase("directory")
      const table = base("Member Businesses")
      
      const selectOptions: any = {
        maxRecords: 1000
      }
      
      if (options.filterByFormula) {
        selectOptions.filterByFormula = options.filterByFormula
      }
      
      const records = await table.select(selectOptions).all()
      
      return records.map((record: Record<Partial<MemberBusiness>>) => ({
        id: record.id,
        fields: {
          "Business Name": record.get("Business Name"),
          "Business ID": record.get("Business ID"),
          "Slug": record.get("Slug"),
          "Business Description": record.get("Business Description"),
          "Website": record.get("Website"),
          "Email": record.get("Email"),
          "Phone": record.get("Phone"),
          "Business Address": record.get("Business Address"),
          "City": record.get("City"),
          "State": record.get("State"),
          "Country": record.get("Country"),
          "Sustainability Practices": record.get("Sustainability Practices"),
          "Certifications": record.get("Certifications"),
          "Business Tags": record.get("Business Tags"),
          "Membership Status": record.get("Membership Status"),
          "Featured Member": record.get("Featured Member"),
          "Directory Spotlight": record.get("Directory Spotlight"),
          "Directory Visibility": record.get("Directory Visibility"),
          "User ID": record.get("User ID"),
          "Last Updated": record.get("Last Updated")
        }
      }))
    } catch (error) {
      console.error("Error fetching members:", error)
      throw error
    }
  }

  // Create a new member business
  async createMember(memberData: any) {
    try {
      console.log("GreenMissionClient.createMember - Input data:", JSON.stringify(memberData, null, 2))
      const base = getGreenMissionAirtableBase("directory")
      const table = base("Member Businesses")
      
      const records = await table.create([{ fields: memberData }])
      console.log("GreenMissionClient.createMember - Success:", records[0].id)
      return records[0]
    } catch (error) {
      console.error("GreenMissionClient.createMember - Error:", error)
      console.error("GreenMissionClient.createMember - Error details:", error instanceof Error ? error.message : error)
      throw error
    }
  }

  // Update existing member business
  async updateMember(recordId: string, updates: any) {
    try {
      const base = getGreenMissionAirtableBase("directory")
      const table = base("Member Businesses")
      
      const records = await table.update([{ id: recordId, fields: updates }])
      return records[0]
    } catch (error) {
      console.error("Error updating member:", error)
      throw error
    }
  }

  // Delete member business
  async deleteMember(recordId: string) {
    try {
      const base = getGreenMissionAirtableBase("directory")
      const table = base("Member Businesses")
      
      await table.destroy([recordId])
      return true
    } catch (error) {
      console.error("Error deleting member:", error)
      throw error
    }
  }
}

// Export singleton instance
export const greenMissionClient = new GreenMissionClient()
