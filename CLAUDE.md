# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Green Mission is a Next.js membership directory platform for eco-conscious businesses. The application features:
- Public showcase site with featured members and membership tiers
- Private dashboard for member management
- Multi-base Airtable integration (CMS, Directory, Branding)
- Theme switching with custom Green Mission branding

## Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Setup Scripts
tsx scripts/setup-green-mission-airtable.ts    # Interactive Airtable multi-base setup
tsx scripts/seed-airtable.ts                   # Seed Airtable with sample data

# Business ID Generation Scripts
pnpm generate-business-ids        # Generate business IDs for existing records
pnpm generate-business-ids:check  # Check/validate business ID generation

# Package manager: pnpm (not npm/yarn)
# Note: No test framework configured
```

## Architecture

### Route Structure
- `app/(showcase)/` - Public-facing website (landing page, member directory)
- `app/(app)/` - Private member dashboard with sidebar navigation
- `app/api/` - API routes for data fetching from Airtable
- Route groups used for different layouts (showcase vs app)

### Data Layer
- **Airtable Integration**: Multi-base architecture via `lib/airtable/green-mission-client.ts`
  - CMS Base: Blog posts, website pages, testimonials
  - Directory Base: Member businesses, membership tiers, categories  
  - Branding Base: Brand assets, marketing materials, badge designs
- **Environment Variables**: 
  - Each base can have individual API keys or shared `AIRTABLE_API_KEY`
  - Format: `AIRTABLE_{CMS|DIR|BRAND}_BASE_ID` and `AIRTABLE_{CMS|DIR|BRAND}_API_KEY`
  - Copy `.env.example` to `.env.local` and fill in your actual API keys
- **2-Way Sync**: Dashboard supports full CRUD operations with real-time sync to/from Airtable

### Component Architecture
- **UI Components**: shadcn/ui components in `components/ui/`
- **Layout Components**: Header, sidebar, navigation in `components/layout/`
- **Feature Components**: Organized by domain (dashboard, directory, showcase)
- **Theme Provider**: Custom theme switching with Green Mission branding

### Key Files
- `lib/airtable/green-mission-client.ts`: All Airtable data access functions
- `lib/data.ts`: Static/mock data and data transformations
- `lib/organization-management.ts`: Organization and business listing management
- `lib/clerk-airtable-sync.ts`: Clerk-Airtable user synchronization
- `lib/business-id-generator.ts`: Unique business ID generation utility
- `types/index.ts`: TypeScript interfaces for Member and Category types
- `components/theme-provider.tsx`: Theme context provider
- `styles/globals.css`: Custom CSS variables for Green Mission theming

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom Green Mission theme variables
- **UI Library**: Radix UI components (shadcn/ui)
- **Database**: Airtable (multi-base setup)
- **Authentication**: Clerk
- **Payments**: Stripe with subscription management
- **Cache**: Upstash Redis (optional)
- **Theme**: next-themes with custom light/dark themes
- **State**: React hooks, no global state management
- **TypeScript**: Strict mode enabled

## Deployment & Integration

- **v0.dev Integration**: Project syncs automatically with v0.dev deployments
- **Vercel Deployment**: Live at <https://vercel.com/mad-ez-media/v0-green-mission>
- **Environment Setup**: Use setup script for multi-base Airtable configuration
- **API Endpoints**: `/api/configuration/status` for Airtable connection testing

## Environment Setup

### Required Services
1. **Airtable**: Create 3 bases (CMS, Directory, Branding) and get API keys
2. **Clerk**: Set up authentication project at dashboard.clerk.com
3. **Stripe**: Configure payment processing at dashboard.stripe.com
4. **Upstash Redis**: Optional caching service at upstash.com

### Environment Variables
Copy `.env.example` to `.env.local` and configure:

**Critical**: Replace these placeholder values with actual secrets:
- `CLERK_WEBHOOK_SECRET` - Get from Clerk webhook configuration
- `STRIPE_WEBHOOK_SECRET` - Get from Stripe webhook configuration

**Current Issues Fixed**:
- ✅ Consolidated all Airtable API keys to use same token
- ✅ Fixed incorrect webhook secrets
- ✅ Organized variables by service with clear comments
- ✅ Set local development URL instead of Vercel URL

## Current Features Completed

### Authentication & User Management
- ✅ Clerk authentication integration
- ✅ User signup/signin flow
- ✅ Post-payment success page with account setup

### Business Listing Management  
- ✅ Dashboard with business listing CRUD operations
- ✅ 2-way Airtable sync for business data
- ✅ User ID field linking Clerk users to Airtable records
- ✅ Form validation and error handling
- ✅ Server-side data fetching with serialized user data
- ✅ Fixed field mapping to match actual Airtable schema
- ✅ Business Tags integration with predefined options: "Sustainable", "Local", "B-Corp", "Women-Owned"
- ✅ Unique business ID generation system
- ✅ Organization-based business management

### Organization Management
- ✅ Clerk organization integration
- ✅ Organization-specific webhooks and data sync
- ✅ Multi-organization support architecture

### Payment Integration
- ✅ Stripe subscription management
- ✅ Membership tier selection during signup
- ✅ Payment success flow integration

### Airtable Schema Implementation
- ✅ User ID field created in Member Businesses table
- ✅ Field mapping updated to match existing schema structure
- ✅ Proper handling of linked records and multiple choice fields

## Future Development Roadmap

### Phase 1: Multi-Business & User Limits (v2.0)
- [ ] **Multiple Business Listings per User**: Allow users to manage multiple businesses
- [ ] **Tier-Based Limits**: Implement business listing limits based on membership tier
  - Basic: 1 business listing
  - Professional: 3 business listings  
  - Enterprise: Unlimited listings
- [ ] **Enhanced Business Management**: Bulk operations, listing templates, duplicate detection

### Phase 2: Super Admin Interface (v2.1)
- [ ] **Admin Dashboard**: Complete administrative interface
- [ ] **User Management**: View/edit/suspend user accounts
- [ ] **Business Moderation**: Approve/reject business listings
- [ ] **Analytics Dashboard**: Member growth, engagement metrics
- [ ] **Content Management**: Blog posts, testimonials, featured members
- [ ] **System Configuration**: Membership tiers, pricing, feature flags

### Phase 3: Advanced Features (v2.2)
- [ ] **Industry Categories**: Proper industry categorization system
- [ ] **Advanced Search**: Filters by location, industry, certifications
- [ ] **Member Networking**: Direct messaging between members
- [ ] **Event Management**: Virtual and in-person sustainable business events
- [ ] **Resource Library**: Shared sustainability resources and guides

### Phase 4: Enterprise Features (v2.3)
- [ ] **White Label Solution**: Customizable branding for different organizations
- [ ] **API Access**: RESTful API for third-party integrations
- [ ] **Advanced Analytics**: Business insights and sustainability metrics
- [ ] **Bulk Import/Export**: CSV/Excel business data management
- [ ] **Advanced Permissions**: Role-based access control

### Phase 5: Mobile & Integrations (v2.4)
- [ ] **Mobile App**: React Native companion app
- [ ] **CRM Integrations**: HubSpot, Salesforce, Pipedrive
- [ ] **Social Media Integration**: Auto-posting to LinkedIn, Twitter
- [ ] **Email Marketing**: Mailchimp/ConvertKit integration
- [ ] **Calendar Integration**: Google Calendar, Outlook events

## Technical Debt & Improvements

### Immediate (Next Version)
- [ ] Add proper Industry field to Airtable schema
- [ ] Implement proper TypeScript error handling
- [ ] Add comprehensive test coverage
- [ ] Optimize image loading and SEO
- [ ] Add form auto-save functionality

### Medium Term
- [ ] Implement proper caching strategy with Redis
- [ ] Add database migrations for schema changes
- [ ] Optimize bundle size and performance
- [ ] Add proper error monitoring (Sentry)
- [ ] Implement CI/CD pipeline

## Important Notes

- Build ignores ESLint and TypeScript errors (`next.config.mjs`)
- Images are unoptimized for deployment flexibility
- Client-side navigation state in app layout
- Airtable field names use exact case from Airtable (e.g., "Business Name", "Featured Member")
- Theme switching uses CSS custom properties with `hsl(var(--color-name))` pattern
- No test framework configured - tests should be added if comprehensive testing is needed
- **Business Tags Field**: Limited to predefined options in Airtable: "Sustainable", "Local", "B-Corp", "Women-Owned"
- **Industry Field**: Currently not stored due to Business Tags limitations - needs separate field in future version
