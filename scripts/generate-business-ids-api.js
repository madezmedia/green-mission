#!/usr/bin/env node
// scripts/generate-business-ids-api.js

const http = require('http')

async function generateBusinessId() {
  const today = new Date()
  const datePrefix = today.getFullYear().toString() + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + 
                    today.getDate().toString().padStart(2, '0')
  
  // Simple increment for this script
  const increment = Math.floor(Math.random() * 9999) + 1
  return `GM-${datePrefix}-${increment.toString().padStart(4, '0')}`
}

function generateSlug(businessName) {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function fetchFromAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(error)
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function main() {
  console.log("🏢 GREEN MISSION - BUSINESS ID GENERATOR (API VERSION)")
  console.log("=" .repeat(60))
  
  try {
    console.log("📥 Fetching all existing member businesses via API...")
    
    // Fetch all members through our API
    const response = await fetchFromAPI('/api/members?limit=100')
    
    if (!response.success) {
      throw new Error(`API Error: ${response.error}`)
    }
    
    const allMembers = response.members || []
    console.log(`📊 Found ${allMembers.length} total member businesses`)
    
    // Filter members that need Business IDs or Slugs
    const membersNeedingIds = allMembers.filter(member => {
      const hasBusinessName = member["Business Name"] && member["Business Name"].trim()
      const missingBusinessId = !member["Business ID"] || member["Business ID"].trim() === ""
      const missingSlug = !member.Slug || member.Slug.trim() === ""
      
      return hasBusinessName && (missingBusinessId || missingSlug)
    })
    
    console.log(`🔍 Found ${membersNeedingIds.length} members needing Business IDs or Slugs`)
    
    if (membersNeedingIds.length === 0) {
      console.log("✅ All members already have Business IDs and Slugs!")
      
      // Show some examples of existing IDs
      const existingIds = allMembers
        .filter(m => m["Business ID"])
        .slice(0, 3)
        .map(m => `"${m["Business Name"]}" → ${m["Business ID"]} → /${m.Slug || 'no-slug'}`)
      
      if (existingIds.length > 0) {
        console.log("\n📋 Examples of existing Business IDs:")
        existingIds.forEach((example, index) => {
          console.log(`   ${index + 1}. ${example}`)
        })
      }
      
      return
    }
    
    // Display what needs to be updated
    console.log("\n📋 Members that need Business IDs:")
    membersNeedingIds.slice(0, 5).forEach((member, index) => {
      const missing = []
      if (!member["Business ID"]) missing.push("Business ID")
      if (!member.Slug) missing.push("Slug")
      console.log(`   ${index + 1}. "${member["Business Name"]}" (missing: ${missing.join(', ')})`)
    })
    
    if (membersNeedingIds.length > 5) {
      console.log(`   ... and ${membersNeedingIds.length - 5} more`)
    }
    
    console.log("\n⚠️  This API-based script can only READ data.")
    console.log("🔧 To update records, you need direct Airtable access.")
    console.log("\n💡 Recommended next steps:")
    console.log("   1. Add 'Business ID' and 'Slug' fields to your Airtable base")
    console.log("   2. Use the Airtable web interface to manually add a few Business IDs")
    console.log("   3. Test the format: GM-YYYYMMDD-XXXX (e.g., GM-20250106-0001)")
    console.log("   4. Use Airtable's bulk edit features or scripts")
    
    // Generate sample IDs for reference
    console.log("\n📝 Sample Business IDs you could use:")
    for (let i = 0; i < Math.min(5, membersNeedingIds.length); i++) {
      const member = membersNeedingIds[i]
      const businessId = await generateBusinessId()
      const slug = generateSlug(member["Business Name"])
      console.log(`   "${member["Business Name"]}"`)
      console.log(`      Business ID: ${businessId}`)
      console.log(`      Slug: ${slug}`)
      console.log()
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error("💥 Cannot connect to local server.")
      console.error("🔧 Make sure your Next.js development server is running:")
      console.error("   npm run dev")
    } else {
      console.error("💥 Error:", error.message)
    }
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { main }