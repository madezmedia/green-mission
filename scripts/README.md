# Business ID Generator Script

This script generates unique Business IDs and slugs for all existing listings in your Airtable base.

## Prerequisites

1. **Add required fields to your Airtable base:**
   - `Business ID` (Single line text)
   - `Slug` (Single line text) 
   - `Last Updated` (Date field)

2. **Environment variables in `.env.local`:**
   ```
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_DIR_BASE_ID=your_directory_base_id
   ```

## Usage

### Run the Business ID Generator
```bash
npm run generate-business-ids
```

### Using Node.js directly
```bash
node scripts/generate-business-ids.js
```

## What the Script Does

1. **Fetches all member businesses** from Airtable
2. **Identifies records missing Business IDs or Slugs**
3. **Generates unique identifiers:**
   - Business ID format: `GM-YYYYMMDD-XXXX` (e.g., `GM-20250106-0001`)
   - Slug format: `business-name-slug` (URL-friendly)
4. **Updates records in batches** to avoid rate limiting
5. **Provides detailed progress and summary**
6. **Runs verification** to confirm updates

## Output Format

### Business ID Format
- **Pattern:** `GM-YYYYMMDD-XXXX`
- **Example:** `GM-20250106-0001`
- **Breakdown:**
  - `GM` - Green Mission prefix
  - `20250106` - Date (YYYYMMDD)
  - `0001` - 4-digit increment

### Slug Format
- **Pattern:** `business-name-slug`
- **Example:** `green-tech-solutions`
- **Rules:**
  - Lowercase only
  - Alphanumeric and hyphens
  - No special characters
  - URL-friendly

## Example Output

```
🏢 GREEN MISSION - BUSINESS ID GENERATOR
============================================================
📥 Fetching all existing member businesses...
📊 Found 28 total member businesses
🔍 Found 15 members needing Business IDs or Slugs

🔄 Processing batch 1/2
   📝 Updating "EcoBuild Construction"
      Business ID: GM-20250106-0001
      Slug: ecobuild-construction
   ✅ Updated successfully

   📝 Updating "Green Growth Consulting"
      Business ID: GM-20250106-0002
      Slug: green-growth-consulting
   ✅ Updated successfully

============================================================
📈 BUSINESS ID GENERATION SUMMARY
============================================================
✅ Successfully updated: 15
❌ Failed: 0
📊 Total processed: 15

🔍 Running verification...
✅ Verification: 5 records confirmed with Business IDs and Slugs

📋 Sample of updated records:
   1. "EcoBuild Construction" → GM-20250106-0001 → /ecobuild-construction
   2. "Green Growth Consulting" → GM-20250106-0002 → /green-growth-consulting
   3. "Mad EZ Media Partners LLC" → GM-20250106-0003 → /mad-ez-media-partners-llc

🎉 Business ID generation completed!
```

## Safety Features

- **Non-destructive:** Only updates empty fields
- **Batch processing:** Avoids API rate limits
- **Error handling:** Continues processing even if individual records fail
- **Verification:** Confirms updates were successful
- **Detailed logging:** Shows exactly what's being updated

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Ensure `.env.local` has `AIRTABLE_API_KEY` and `AIRTABLE_DIR_BASE_ID`

2. **"Table not found"**
   - Verify your table is named "Member Businesses" in Airtable
   - Or update the script to use your table name

3. **Rate limiting errors**
   - The script includes delays, but you can increase them if needed
   - Reduce batch size in the script if necessary

4. **Field not found errors**
   - Ensure you've added the required fields to your Airtable base

### Checking Results

After running the script, check your Airtable base to verify:
- All businesses have Business IDs in format `GM-YYYYMMDD-XXXX`
- All businesses have URL-friendly slugs
- No duplicate Business IDs exist

## Manual Verification Queries

In Airtable, you can create filtered views to check:

1. **Missing Business IDs:** `{Business ID} = BLANK()`
2. **Missing Slugs:** `{Slug} = BLANK()`
3. **Successfully Updated:** `AND({Business ID} != '', {Slug} != '')`

## Next Steps

After running this script successfully:
1. Test the organization creation system
2. Verify directory links work with new slugs
3. Update any existing integrations to use Business IDs
4. Set up the Clerk organization system