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
    lastSynced: fields["Last Updated"] || null,
    logo: fields["Logo"] && fields["Logo"][0] ? fields["Logo"][0].url : "",
    businessImages: fields["Business Images"] ? fields["Business Images"].map((img: any) => img.url) : []
  }
}

async function getBusinessListings(userId: string) {
  try {
    console.log("Server: Fetching business listings for user:", userId)
    
    // Search for existing listings by User ID
    const records = await greenMissionClient.getMembers({
      filterByFormula: `{User ID} = "${userId}"`
    })
    
    console.log("Server: Records found:", records.length)
    
    if (records.length === 0) {
      return []
    }
    
    // Map all records to listings
    const mappedListings = records.map((record, index) => {
      console.log(`Server: Record ${index + 1} fields:`, JSON.stringify(record.fields, null, 2))
      const mappedListing = mapFromAirtableFormat(record)
      console.log(`Server: Mapped listing ${index + 1}:`, JSON.stringify(mappedListing, null, 2))
      return mappedListing
    }).filter(listing => listing !== null)
    
    return mappedListings
  } catch (error) {
    console.error("Server: Error fetching business listings:", error)
    return []
  }
}

export default async function BusinessListingServerWrapper() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>Please sign in to access your business listings.</div>
  }
  
  const initialListings = await getBusinessListings(userId)
  
  return <BusinessListingDashboard initialListings={initialListings} />
}