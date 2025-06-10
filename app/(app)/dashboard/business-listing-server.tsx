import { auth } from "@clerk/nextjs/server"
import { greenMissionClient } from "@/lib/airtable/green-mission-client"
import BusinessListingDashboard from "@/components/dashboard/business-listing-dashboard"

// Helper function to map Airtable data to form format
function mapFromAirtableFormat(record: any) {
  if (!record || !record.fields) {
    console.error("Invalid record structure:", record)
    return null
  }
  
  const fields = record.fields
  
  // Industry is not stored in Business Tags since they have limited options
  // We'll need to track industry separately or use a different field
  const industry = "" // Default empty for now
  
  return {
    id: record.id,
    businessName: fields["Business Name"] || "",
    description: fields["Business Description"] || "",
    industry: industry,
    website: fields["Website"] || "",
    email: fields["Email"] || "",
    phone: fields["Phone"] || "",
    address: fields["Business Address"] || "",
    city: fields["City"] || "",
    state: fields["State"] || "",
    country: fields["Country"] || "",
    sustainabilityPractices: fields["Sustainability Practices"] || "",
    certifications: fields["Certifications"] || "",
    membershipTier: "Basic", // Default since this field doesn't exist yet
    directoryVisibility: true, // Default to true
    status: fields["Membership Status"] || "Pending",
    lastSynced: fields["Last Updated"] || null
  }
}

async function getBusinessListing(userId: string) {
  try {
    console.log("Server: Fetching business listing for user:", userId)
    
    // Search for existing listing by User ID
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })
    
    console.log("Server: Records found:", records.length)
    
    if (records.length === 0) {
      return null
    }
    
    const mappedListing = mapFromAirtableFormat(records[0])
    if (!mappedListing) {
      console.error("Failed to map record to listing format")
      return null
    }
    
    return mappedListing
  } catch (error) {
    console.error("Server: Error fetching business listing:", error)
    return null
  }
}

export default async function BusinessListingServerWrapper() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>Please sign in to access your business listing.</div>
  }
  
  const initialListing = await getBusinessListing(userId)
  
  return <BusinessListingDashboard initialListing={initialListing} />
}