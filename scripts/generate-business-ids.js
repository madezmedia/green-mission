#!/usr/bin/env node
// scripts/generate-business-ids.js

// Load environment variables from .env.local manually
const fs = require('fs')
const path = require('path')

function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  }
}

loadEnvFile()

async function generateBusinessId() {
  const today = new Date()
  const datePrefix = today.getFullYear().toString() + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + 
                    today.getDate().toString().padStart(2, '0')
  
  // Simple increment for this script (in production, check for existing IDs)
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

async function main() {
  console.log("🏢 GREEN MISSION - BUSINESS ID GENERATOR")
  console.log("=" .repeat(60))
  
  try {
    // Import Airtable modules
    const Airtable = require('airtable')
    
    const baseId = process.env.AIRTABLE_DIR_BASE_ID
    const apiKey = process.env.AIRTABLE_DIR_API_KEY || process.env.AIRTABLE_API_KEY
    
    if (!baseId || !apiKey) {
      console.log("Available env vars:", Object.keys(process.env).filter(k => k.includes('AIRTABLE')))
      throw new Error("Missing required environment variables: AIRTABLE_DIR_BASE_ID and AIRTABLE_DIR_API_KEY")
    }
    
    console.log(`Using base ID: ${baseId.substring(0, 8)}...`)
    
    // Initialize Airtable
    const base = new Airtable({ apiKey: apiKey }).base(baseId)
    
    // Try different possible table names
    const possibleTableNames = ['Member Businesses', 'Members', 'Businesses', 'Directory']
    let table = null
    let tableName = null
    
    for (const name of possibleTableNames) {
      try {
        const testTable = base(name)
        // Test if table exists by trying to fetch 1 record
        await new Promise((resolve, reject) => {
          testTable.select({ maxRecords: 1 }).firstPage((err, records) => {
            if (err) reject(err)
            else resolve(records)
          })
        })
        table = testTable
        tableName = name
        console.log(`✅ Found table: "${name}"`)
        break
      } catch (error) {
        console.log(`❌ Table "${name}" not found`)
      }
    }
    
    if (!table) {
      throw new Error('Could not find any valid table. Tried: ' + possibleTableNames.join(', '))
    }
    
    console.log(`📥 Fetching all existing member businesses from "${tableName}"...`)
    
    // Fetch all records
    const allRecords = []
    await new Promise((resolve, reject) => {
      table.select({
        // Don't specify view to use default
      }).eachPage(
        function page(records, fetchNextPage) {
          allRecords.push(...records)
          fetchNextPage()
        },
        function done(err) {
          if (err) {
            console.error('Error fetching records:', err)
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
    
    console.log(`📊 Found ${allRecords.length} total member businesses`)
    
    // Filter records that need Business IDs
    const recordsNeedingIds = allRecords.filter(record => {
      const businessName = record.get('Business Name')
      const businessId = record.get('Business ID')
      const slug = record.get('Slug')
      
      return businessName && (!businessId || !slug)
    })
    
    console.log(`🔍 Found ${recordsNeedingIds.length} members needing Business IDs or Slugs`)
    
    if (recordsNeedingIds.length === 0) {
      console.log("✅ All members already have Business IDs and Slugs!")
      return
    }
    
    // Process records in batches
    const batchSize = 10
    const results = { success: 0, failed: 0, errors: [] }
    
    for (let i = 0; i < recordsNeedingIds.length; i += batchSize) {
      const batch = recordsNeedingIds.slice(i, i + batchSize)
      
      console.log(`\n🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(recordsNeedingIds.length/batchSize)}`)
      
      const updatePromises = batch.map(async (record) => {
        const businessName = record.get('Business Name')
        
        try {
          const updateFields = {}
          
          // Generate Business ID if missing
          if (!record.get('Business ID')) {
            updateFields['Business ID'] = await generateBusinessId()
          }
          
          // Generate Slug if missing
          if (!record.get('Slug')) {
            updateFields['Slug'] = generateSlug(businessName)
          }
          
          // Add timestamp
          updateFields['Last Updated'] = new Date().toISOString()
          
          if (Object.keys(updateFields).length > 1) { // More than just timestamp
            console.log(`   📝 Updating "${businessName}"`)
            console.log(`      Business ID: ${updateFields['Business ID'] || 'keeping existing'}`)
            console.log(`      Slug: ${updateFields['Slug'] || 'keeping existing'}`)
            
            // Update the record
            await table.update(record.getId(), updateFields)
            
            console.log(`   ✅ Updated successfully`)
            results.success++
          }
          
        } catch (error) {
          const errorMsg = `Failed to update "${businessName}": ${error.message}`
          console.log(`   ❌ ${errorMsg}`)
          results.failed++
          results.errors.push(errorMsg)
        }
      })
      
      await Promise.all(updatePromises)
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < recordsNeedingIds.length) {
        console.log("   ⏳ Waiting 2 seconds before next batch...")
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    // Summary
    console.log("\n" + "=".repeat(60))
    console.log("📈 BUSINESS ID GENERATION SUMMARY")
    console.log("=".repeat(60))
    console.log(`✅ Successfully updated: ${results.success}`)
    console.log(`❌ Failed: ${results.failed}`)
    console.log(`📊 Total processed: ${recordsNeedingIds.length}`)
    
    if (results.errors.length > 0) {
      console.log("\n❌ ERRORS:")
      results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`)
      })
    }
    
    console.log("\n🎉 Business ID generation completed!")
    
    // Verification
    if (results.success > 0) {
      console.log("\n🔍 Running verification...")
      
      const verificationRecords = []
      await table.select({
        filterByFormula: "AND({Business ID} != '', {Slug} != '')",
        maxRecords: 5
      }).eachPage(
        function page(records, fetchNextPage) {
          verificationRecords.push(...records)
          fetchNextPage()
        }
      )
      
      console.log(`✅ Verification: ${verificationRecords.length} records confirmed with Business IDs and Slugs`)
      
      if (verificationRecords.length > 0) {
        console.log("\n📋 Sample of updated records:")
        verificationRecords.slice(0, 3).forEach((record, index) => {
          console.log(`   ${index + 1}. "${record.get('Business Name')}" → ${record.get('Business ID')} → /${record.get('Slug')}`)
        })
      }
    }
    
  } catch (error) {
    console.error("💥 Fatal error:", error)
    console.error("Stack trace:", error.stack)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { main }