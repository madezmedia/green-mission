# Green Mission Club CMS Setup Guide

This guide will help you set up the Airtable-powered CMS for the Green Mission Club website.

## Overview

The Green Mission Club frontend has been refactored to be CMS-driven, pulling content dynamically from Airtable. This allows site administrators to update content without code changes.

## Architecture

The CMS uses three Airtable bases:

1. **Green Mission CMS** (`appnXs2ZIMD5zoeIl`) - Site settings, brand assets, blog posts, testimonials, FAQ items
2. **Green Mission Directory** (`appXkzIVdu52PYrfz`) - Member businesses, membership tiers, directory categories
3. **Green Mission Branding** (`appXpx55IZC8IPNi9`) - Brand assets and marketing materials

## Setup Instructions

### 1. Get Your Airtable API Key

1. Go to [Airtable Account Settings](https://airtable.com/account)
2. In the "API" section, click "Generate API key"
3. Copy your API key (starts with `key...`)

### 2. Configure Environment Variables

Create or update your `.env.local` file with the following variables:

```env
# Airtable Configuration for Green Mission Club CMS
AIRTABLE_API_KEY=your_airtable_api_key_here

# Green Mission CMS Base (for site settings, brand assets, blog posts, etc.)
AIRTABLE_CMS_BASE_ID=appnXs2ZIMD5zoeIl

# Green Mission Directory Base (for member businesses, membership tiers, etc.)
AIRTABLE_DIR_BASE_ID=appXkzIVdu52PYrfz

# Green Mission Branding Base (for brand assets and marketing materials)
AIRTABLE_BRAND_BASE_ID=appXpx55IZC8IPNi9
```

### 3. Verify Configuration

After setting up your environment variables, restart your development server and visit:

```
http://localhost:3000/api/cms/config-status
```

This endpoint will show you the configuration status of all three bases.

## CMS Tables and Content Management

### Site Settings Table

Manages global site configuration:

- **Site Title** - Main site title displayed in navigation
- **Site Tagline** - Tagline for branding
- **Hero Title** - Main heading on homepage
- **Hero Description** - Description text on homepage
- **Hero Badge Text** - Badge text on homepage

### Brand Assets Table

Manages logos and visual assets:

- **Logo - Primary** - Main logo for header/navigation
- **Logo - Secondary** - Alternative logo variations
- **Logo - Icon** - Icon-only version
- **Logo - Transparent** - Transparent background version
- **Hero Image** - Hero section background images
- **Background Image** - General background images

### Website Pages Table

Manages page content:

- **Page Title** - SEO and display title
- **Slug** - URL path
- **Content** - Main page content
- **Hero Title/Subtitle** - Page-specific hero content
- **Hero Image** - Page-specific hero image
- **Hero CTA** - Call-to-action button text and link

### Blog Posts Table

Manages blog content:

- **Title** - Post title
- **Slug** - URL-friendly identifier
- **Content** - Full post content
- **Excerpt** - Short description
- **Featured Image** - Post thumbnail
- **Status** - Draft/Published/Archived
- **Featured** - Highlight on homepage
- **SEO Title/Meta Description** - SEO optimization

### Testimonials Table

Manages customer testimonials:

- **Client Name** - Customer name
- **Business Name** - Customer's business
- **Testimonial** - Quote text
- **Rating** - Star rating (1-5)
- **Image** - Customer photo
- **Featured** - Show on homepage
- **Use Case** - Where to display (Homepage, Directory, etc.)

## API Endpoints

The CMS provides several API endpoints:

- `GET /api/cms/site-settings` - Fetch site settings
- `GET /api/cms/brand-assets` - Fetch brand assets
- `GET /api/cms/config-status` - Check configuration status

### Query Parameters

**Site Settings:**
- `?category=Branding` - Filter by category
- `?key=site_title` - Get specific setting

**Brand Assets:**
- `?type=Logo - Primary` - Filter by asset type
- `?usage=Header` - Filter by usage context

## React Hooks

Use these hooks in your components to fetch CMS content:

```tsx
import { useSiteSettings, useBrandAssets, useSettingValue, usePrimaryLogo } from '@/lib/hooks/use-cms-content'

// Get all site settings
const { settings, loading, error } = useSiteSettings()

// Get specific setting value
const { value: siteTitle } = useSettingValue('site_title')

// Get primary logo
const { logoUrl, altText } = usePrimaryLogo()

// Get brand assets
const { assets } = useBrandAssets('Logo - Primary', 'Header')
```

## Content Management Workflow

1. **Update Content in Airtable** - Edit records in your Airtable bases
2. **Content is Cached** - Frontend caches content for performance
3. **Automatic Updates** - Changes appear on the website immediately
4. **Fallback Content** - If CMS is unavailable, fallback to default content

## Troubleshooting

### Common Issues

1. **500 Errors on CMS Endpoints**
   - Check that your `AIRTABLE_API_KEY` is set correctly
   - Verify base IDs match your Airtable bases
   - Ensure your API key has access to the bases

2. **Content Not Loading**
   - Check browser console for errors
   - Verify API endpoints are responding
   - Check that records exist in Airtable and are marked as "Active"

3. **Images Not Displaying**
   - Ensure image files are uploaded to Airtable attachment fields
   - Check that brand assets have the correct "Usage Context"
   - Verify "Active" checkbox is checked

### Debug Endpoints

- `/api/cms/config-status` - Check Airtable configuration
- `/api/cms/site-settings` - Test site settings API
- `/api/cms/brand-assets` - Test brand assets API

## Performance Considerations

- Content is cached on the frontend for better performance
- Images are optimized using Next.js Image component
- Fallback content ensures site remains functional if CMS is unavailable
- Consider implementing server-side caching for production

## Security

- API keys are stored securely in environment variables
- Never commit API keys to version control
- Use different API keys for development and production
- Consider using Airtable's read-only API keys for frontend access

## Next Steps

1. Set up your Airtable API key
2. Populate content in the Airtable bases
3. Upload logo files to the Brand Assets table
4. Configure site settings in the Site Settings table
5. Test the CMS integration
6. Deploy with production environment variables

For additional help, check the API documentation or contact the development team.