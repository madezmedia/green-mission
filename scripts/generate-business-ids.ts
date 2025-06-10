#!/usr/bin/env tsx
// scripts/generate-business-ids.ts

import { greenMissionClient } from "../lib/airtable/green-mission-client"
import { generateBusinessIdentifiers } from "../lib/business-id-generator"

interface ExistingMember {
  id: string
  fields: {
    "Business Name": string
    "Business ID"?: string
    "Slug"?: string
    [key: string]: any
  }
}

async function generateBusinessIdsForExistingListings() {
  console.log("🚀 Starting Business ID generation for existing listings...")
  
  try {
    // Step 1: Fetch all existing members
    console.log("📥 Fetching all existing member businesses...")
    const allMembers = await greenMissionClient.getMembers({
      filterByFormula: "", // Get all records
    })
    
    console.log(`📊 Found ${allMembers.length} total member businesses`)
    
    // Step 2: Filter members that need Business IDs
    const membersNeedingIds = allMembers.filter((member: any) => {
      const hasBusinessName = member["Business Name"] && member["Business Name"].trim()
      const missingBusinessId = !member["Business ID"] || member["Business ID"].trim() === ""
      const missingSlug = !member.Slug || member.Slug.trim() === ""
      
      return hasBusinessName && (missingBusinessId || missingSlug)
    })
    
    console.log(`🔍 Found ${membersNeedingIds.length} members needing Business IDs or Slugs`)
    
    if (membersNeedingIds.length === 0) {
      console.log("✅ All members already have Business IDs and Slugs!")
      return
    }
    
    // Step 3: Generate and update Business IDs
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[]
    }
    
    for (let i = 0; i < membersNeedingIds.length; i++) {
      const member = membersNeedingIds[i]
      const businessName = member["Business Name"]
      
      console.log(`\n🔄 Processing ${i + 1}/${membersNeedingIds.length}: "${businessName}"`)
      
      try {
        // Generate Business ID and Slug
        const { businessId, slug } = await generateBusinessIdentifiers(businessName)
        
        console.log(`   📝 Generated Business ID: ${businessId}`)
        console.log(`   🔗 Generated Slug: ${slug}`)
        
        // Prepare update data
        const updateData: any = {}
        
        // Only update Business ID if missing
        if (!member["Business ID"] || member["Business ID"].trim() === "") {
          updateData["Business ID"] = businessId
        }
        
        // Only update Slug if missing
        if (!member.Slug || member.Slug.trim() === "") {
          updateData.Slug = slug
        }
        
        // Add timestamp
        updateData["Last Updated"] = new Date().toISOString()
        
        if (Object.keys(updateData).length > 1) { // More than just timestamp
          // Update the record
          await greenMissionClient.updateMember(member.id, updateData)
          
          console.log(`   ✅ Updated successfully`)
          results.success++
        } else {
          console.log(`   ⏭️  Skipped - already has required data`)
          results.skipped++
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        const errorMsg = `Failed to update "${businessName}": ${error instanceof Error ? error.message : 'Unknown error'}`
        console.log(`   ❌ ${errorMsg}`)
        results.failed++
        results.errors.push(errorMsg)
      }
    }
    
    // Step 4: Summary
    console.log("\n" + "=".repeat(60))
    console.log("📈 BUSINESS ID GENERATION SUMMARY")
    console.log("=".repeat(60))
    console.log(`✅ Successfully updated: ${results.success}`)
    console.log(`⏭️  Skipped (already had data): ${results.skipped}`)
    console.log(`❌ Failed: ${results.failed}`)
    console.log(`📊 Total processed: ${membersNeedingIds.length}`)
    
    if (results.errors.length > 0) {
      console.log("\n❌ ERRORS:")
      results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    // Step 5: Verification
    if (results.success > 0) {
      console.log("\n🔍 Verifying updates...")
      
      // Fetch a few updated records to verify
      const verificationSample = await greenMissionClient.getMembers({
        filterByFormula: `AND({Business ID} != '', {Slug} != '')`,
        limit: 5
      })
      
      console.log(`✅ Verification: ${verificationSample.length} records confirmed with Business IDs and Slugs`)
      
      if (verificationSample.length > 0) {
        console.log("\n📋 Sample of updated records:")
        verificationSample.slice(0, 3).forEach((member: any, index: number) => {
          console.log(`   ${index + 1}. "${member["Business Name"]}" → ${member["Business ID"]} → /${member.Slug}`)
        })
      }
    }
    
    console.log("\n🎉 Business ID generation completed!")
    
  } catch (error) {
    console.error("💥 Fatal error during Business ID generation:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace')
    process.exit(1)
  }
}

// Additional utility functions
async function checkBusinessIdFormat() {
  console.log("\n🔍 Checking Business ID format compliance...")
  
  try {
    const allMembers = await greenMissionClient.getMembers({
      filterByFormula: `{Business ID} != ''`,
    })
    
    const formatRegex = /^GM-\d{8}-\d{4}$/
    let validCount = 0
    let invalidCount = 0
    const invalidIds: string[] = []
    
    allMembers.forEach((member: any) => {
      const businessId = member["Business ID"]
      if (formatRegex.test(businessId)) {
        validCount++
      } else {
        invalidCount++
        invalidIds.push(`"${member["Business Name"]}" → ${businessId}`)
      }
    })
    
    console.log(`✅ Valid Business IDs: ${validCount}`)
    console.log(`❌ Invalid Business IDs: ${invalidCount}`)
    
    if (invalidIds.length > 0) {
      console.log("\n❌ Invalid Business ID formats:")
      invalidIds.forEach((id, index) => {
        console.log(`   ${index + 1}. ${id}`)
      })
    }
    
  } catch (error) {
    console.error("Error checking Business ID format:", error)
  }
}

async function generateDuplicateReport() {
  console.log("\n🔍 Checking for duplicate Business IDs...")
  
  try {
    const allMembers = await greenMissionClient.getMembers({
      filterByFormula: `{Business ID} != ''`,
    })
    
    const businessIdCounts: { [key: string]: string[] } = {}
    
    allMembers.forEach((member: any) => {
      const businessId = member["Business ID"]
      const businessName = member["Business Name"]
      
      if (!businessIdCounts[businessId]) {
        businessIdCounts[businessId] = []
      }
      businessIdCounts[businessId].push(businessName)
    })
    
    const duplicates = Object.entries(businessIdCounts).filter(([_, names]) => names.length > 1)
    
    if (duplicates.length === 0) {
      console.log("✅ No duplicate Business IDs found!")
    } else {
      console.log(`❌ Found ${duplicates.length} duplicate Business IDs:`)
      duplicates.forEach(([businessId, names], index) => {
        console.log(`   ${index + 1}. ${businessId} → ${names.join(', ')}`)
      })
    }
    
  } catch (error) {
    console.error("Error checking duplicates:", error)
  }
}

// Main execution
async function main() {
  console.log("🏢 GREEN MISSION - BUSINESS ID GENERATOR")
  console.log("=" .repeat(60))
  
  try {
    // Check command line arguments
    const args = process.argv.slice(2)
    
    if (args.includes('--check-format')) {
      await checkBusinessIdFormat()
      return
    }
    
    if (args.includes('--check-duplicates')) {
      await generateDuplicateReport()
      return
    }
    
    if (args.includes('--help')) {
      console.log("Usage:")
      console.log("  tsx scripts/generate-business-ids.ts              # Generate Business IDs")
      console.log("  tsx scripts/generate-business-ids.ts --check-format     # Check ID format")
      console.log("  tsx scripts/generate-business-ids.ts --check-duplicates # Check duplicates")
      console.log("  tsx scripts/generate-business-ids.ts --help             # Show this help")
      return
    }
    
    // Default: Generate Business IDs
    await generateBusinessIdsForExistingListings()
    
    // Run checks after generation
    await checkBusinessIdFormat()
    await generateDuplicateReport()
    
  } catch (error) {
    console.error("💥 Script failed:", error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}