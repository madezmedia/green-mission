#!/usr/bin/env node

// scripts/setup-green-mission-airtable.js
// Interactive setup script for Green Mission multi-base Airtable configuration

import readline from "readline"
import fs from "fs"
import path from "path"
import Airtable from "airtable" // Added for test connection

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve))

// ANSI color codes for better console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bright}${colors.green}${msg}${colors.reset}\n`),
  step: (msg: string) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
}

async function main() {
  try {
    log.header("🌱 Green Mission Multi-Base Airtable Setup")

    console.log("This script will help you configure the three-base Airtable architecture for Green Mission:")
    console.log("1. 📄 CMS Base - Blog posts, pages, testimonials")
    console.log("2. 👥 Directory Base - Member businesses, tiers, categories")
    console.log("3. 🎨 Branding Base - Brand assets, marketing materials, badges\n")

    const proceed = await question("Would you like to continue with the setup? (y/n): ")
    if (proceed.toLowerCase() !== "y" && proceed.toLowerCase() !== "yes") {
      log.info("Setup cancelled.")
      process.exit(0)
    }

    // Step 1: Collect Airtable API Key
    log.step("Step 1: Airtable API Configuration")
    console.log("You can use the same API key for all three bases if they're under the same Airtable account.")

    const apiKey = await question("Enter your Airtable API key: ")
    if (!apiKey || !apiKey.startsWith("pat")) {
      // Updated check for Personal Access Tokens
      log.error('Invalid API key format. Airtable Personal Access Tokens should start with "pat".')
      process.exit(1)
    }

    // Step 2: Collect Base IDs
    log.step("Step 2: Base ID Configuration")

    console.log("\n📄 CMS Base (for blog posts, pages, testimonials):")
    const cmsBaseId = await question('Enter CMS Base ID (starts with "app"): ')
    if (!cmsBaseId || !cmsBaseId.startsWith("app")) {
      log.error('Invalid CMS base ID format. Base IDs should start with "app".')
      process.exit(1)
    }

    console.log("\n👥 Directory Base (for member businesses, tiers, categories):")
    const dirBaseId = await question('Enter Directory Base ID (starts with "app"): ')
    if (!dirBaseId || !dirBaseId.startsWith("app")) {
      log.error('Invalid Directory base ID format. Base IDs should start with "app".')
      process.exit(1)
    }

    console.log("\n🎨 Branding Base (for brand assets, marketing materials):")
    const brandBaseId = await question('Enter Branding Base ID (starts with "app"): ')
    if (!brandBaseId || !brandBaseId.startsWith("app")) {
      log.error('Invalid Branding base ID format. Base IDs should start with "app".')
      process.exit(1)
    }

    // Step 3: Environment Configuration
    log.step("Step 3: Environment Configuration")

    const envChoice = await question(
      "Configure for: (1) Local development (.env.local) (2) Production (Vercel) (3) Both: ",
    )

    const envVars = {
      AIRTABLE_API_KEY: apiKey,
      AIRTABLE_CMS_BASE_ID: cmsBaseId,
      AIRTABLE_DIR_BASE_ID: dirBaseId,
      AIRTABLE_BRAND_BASE_ID: brandBaseId,
      CACHE_TTL: "3600", // Default cache TTL
    }

    // Step 4: Local environment setup
    if (envChoice === "1" || envChoice === "3") {
      log.step("Setting up local environment (.env.local)")

      const envPath = path.join(process.cwd(), ".env.local")
      const envExists = fs.existsSync(envPath)

      if (envExists) {
        const backup = await question("⚠️  .env.local already exists. Create backup? (y/n): ")
        if (backup.toLowerCase() === "y" || backup.toLowerCase() === "yes") {
          const backupPath = `${envPath}.backup.${Date.now()}`
          fs.copyFileSync(envPath, backupPath)
          log.success(`Backup created: ${backupPath}`)
        }
      }

      // Read existing env file content
      let existingContent = ""
      if (envExists) {
        existingContent = fs.readFileSync(envPath, "utf8")
      }

      // Prepare new content
      let newContent = existingContent

      // Add or update environment variables
      Object.entries(envVars).forEach(([key, value]) => {
        const regex = new RegExp(`^${key}=.*$`, "m")
        const line = `${key}=${value}`

        if (regex.test(newContent)) {
          newContent = newContent.replace(regex, line)
          log.info(`Updated ${key}`)
        } else {
          newContent += `\n${line}`
          log.info(`Added ${key}`)
        }
      })

      // Write the file
      fs.writeFileSync(envPath, newContent.trim() + "\n")
      log.success("Local environment configured successfully!")
    }

    // Step 5: Vercel environment setup
    if (envChoice === "2" || envChoice === "3") {
      log.step("Setting up Vercel environment variables")

      console.log("\nRun these commands to configure Vercel environment variables:\n")

      Object.entries(envVars).forEach(([key, value]) => {
        console.log(`${colors.cyan}vercel env add ${key}${colors.reset}`)
        console.log(`${colors.yellow}# When prompted, enter: ${value}${colors.reset}\n`)
      })

      console.log(`${colors.cyan}vercel --prod${colors.reset}`)
      console.log(`${colors.yellow}# Deploy with new configuration${colors.reset}\n`)

      const copyToClipboard = await question("Would you like to copy the Vercel commands to clipboard? (y/n): ")
      if (copyToClipboard.toLowerCase() === "y" || copyToClipboard.toLowerCase() === "yes") {
        const commands =
          Object.entries(envVars)
            .map(([key, value]) => `vercel env add ${key} "${value}"`) // Add value directly for easier pasting
            .join(" && ") + " && vercel --prod" // Chain commands

        try {
          // Platform-agnostic clipboard copy
          const ncp = await import("copy-paste")
          ncp.copy(commands, () => log.success("Commands copied to clipboard!"))
        } catch (error) {
          log.warning(
            "Could not copy to clipboard automatically. Please install 'copy-paste' (`npm install copy-paste`) or copy the commands manually.",
          )
          console.log("\n--- Vercel Commands ---")
          console.log(commands)
          console.log("-----------------------\n")
        }
      }
    }

    // Step 6: Test configuration
    log.step("Step 4: Testing Configuration")

    const testConfig = await question("Would you like to test the Airtable connection? (y/n): ")
    if (testConfig.toLowerCase() === "y" || testConfig.toLowerCase() === "yes") {
      log.info("Testing Airtable connections...")

      // Set environment variables for testing if not already set by .env.local
      Object.entries(envVars).forEach(([key, value]) => {
        if (!process.env[key]) {
          process.env[key] = value
        }
      })

      const testConnection = async (baseName: string, baseId: string, apiKeyToTest: string) => {
        try {
          const airtable = new Airtable({ apiKey: apiKeyToTest })
          const base = airtable.base(baseId)
          // Attempt to list tables or fetch a dummy record.
          // Airtable SDK doesn't have a direct "list tables" or "ping".
          // We'll try to fetch from a non-existent table to check base/auth.
          await base("TestTableToVerifyConnection").select({ maxRecords: 1 }).firstPage()
          // If it doesn't throw, it means base is accessible but table doesn't exist (which is fine for this test)
          log.success(`${baseName} - Base accessible (table structure needs verification)`)
          return true
        } catch (error: any) {
          if (error.message.includes("AUTHENTICATION_REQUIRED") || error.message.includes("INVALID_API_KEY")) {
            log.error(`${baseName} - Authentication failed (API Key: ${apiKeyToTest})`)
          } else if (error.message.includes("NOT_FOUND") && error.message.includes("Could not find table")) {
            log.success(
              `${baseName} - Base accessible (table 'TestTableToVerifyConnection' not found, which is expected for this test)`,
            )
            return true
          } else if (error.message.includes("NOT_FOUND")) {
            log.error(`${baseName} - Base not found or API key lacks access (Base ID: ${baseId})`)
          } else {
            log.error(`${baseName} - Connection test failed: ${error.message}`)
          }
          return false
        }
      }

      console.log("\nTesting base accessibility:\n")
      const cmsResult = await testConnection("CMS Base", cmsBaseId, apiKey)
      const dirResult = await testConnection("Directory Base", dirBaseId, apiKey)
      const brandResult = await testConnection("Branding Base", brandBaseId, apiKey)

      console.log("\nTest Results:")
      console.log(
        "CMS Base:",
        cmsResult ? `${colors.green}✅ Accessible${colors.reset}` : `${colors.red}❌ Failed${colors.reset}`,
      )
      console.log(
        "Directory Base:",
        dirResult ? `${colors.green}✅ Accessible${colors.reset}` : `${colors.red}❌ Failed${colors.reset}`,
      )
      console.log(
        "Branding Base:",
        brandResult ? `${colors.green}✅ Accessible${colors.reset}` : `${colors.red}❌ Failed${colors.reset}`,
      )

      if (cmsResult && dirResult && brandResult) {
        log.success("\n🎉 All bases seem accessible! Configuration looks good.")
      } else {
        log.warning("\n⚠️  Some bases are not accessible. Please check:")
        console.log("   - Base IDs are correct")
        console.log("   - API key has access to all specified bases")
        console.log("   - Bases exist in your Airtable account")
      }
    }

    // Step 7: Next Steps
    log.step("Step 5: Next Steps")

    console.log("🎉 Green Mission Airtable setup complete!\n")

    console.log("Required Airtable Table Structure (ensure these tables exist with correct fields):")
    console.log("\n📄 CMS Base tables:")
    console.log(
      "  - Blog Posts, Website Pages, Testimonials, FAQ Items, Newsletter Content, Content Categories, Authors",
    )

    console.log("\n👥 Directory Base tables:")
    console.log("  - Member Businesses, Membership Tiers, Directory Categories, Member Applications, Location Data")

    console.log("\n🎨 Branding Base tables:")
    console.log("  - Brand Assets, Marketing Materials, Badge Designs, Email Templates")

    console.log("\nNext steps:")
    console.log("1. 📋 Verify/Create the required tables and fields in each Airtable base.")
    console.log("2. 🔧 Run your Next.js development server: `npm run dev` or `yarn dev`")
    console.log("3. 🧪 Test the API endpoints, e.g., `/api/configuration/status` and `/api/members/featured`")
    console.log("4. 📚 Refer to the project documentation for detailed field schemas.")

    if (envChoice === "2" || envChoice === "3") {
      console.log("5. 🚀 Deploy to Vercel using the commands shown earlier (if you didn't run them yet).")
    }

    console.log("\nFor detailed table schemas and field configurations, check:")
    console.log("📖 Green Mission Multi-Base Airtable Setup documentation (provided in project context)")
  } catch (error: any) {
    log.error("Setup failed:", error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

// Handle script termination
process.on("SIGINT", () => {
  console.log("\n\nSetup cancelled by user.")
  rl.close()
  process.exit(0)
})

// Run the main function
if (require.main === module) {
  main()
}

// export { main }; // Not needed for a CLI script typically
