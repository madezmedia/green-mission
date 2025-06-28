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
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Setup Scripts (requires tsx installed globally: npm i -g tsx)
tsx scripts/setup-green-mission-airtable.ts    # Interactive Airtable multi-base setup
tsx scripts/seed-airtable.ts                   # Seed Airtable with sample data
tsx scripts/setup-stripe-payment-links.ts     # Setup Stripe payment links

# Business ID Generation Scripts
pnpm generate-business-ids        # Generate business IDs for existing records
pnpm generate-business-ids:check  # Check/validate business ID generation

# Package manager: pnpm (not npm/yarn)
# Note: No test framework configured
# Build ignores ESLint and TypeScript errors (next.config.mjs)
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
- **UI Components**: shadcn/ui components in `components/ui/` with custom image management components
- **Layout Components**: Header, sidebar, navigation in `components/layout/` with simplified/advanced modes
- **Feature Components**: Organized by domain (dashboard, directory, showcase)
- **Theme Provider**: Custom theme switching with Green Mission branding
- **Configuration System**: Feature flags control dashboard complexity and component visibility

### Key Files
- `lib/airtable/green-mission-client.ts`: All Airtable data access functions with multi-base support
- `lib/config.ts`: Dashboard configuration system with feature flags and simplified mode
- `lib/feature-flags.ts`: Feature flag management for dashboard complexity control
- `lib/data.ts`: Static/mock data and data transformations
- `lib/organization-management.ts`: Organization and business listing management
- `lib/clerk-airtable-sync.ts`: Clerk-Airtable user synchronization
- `lib/business-id-generator.ts`: Unique business ID generation utility
- `types/index.ts`: TypeScript interfaces for Member and Category types
- `components/layout/theme-provider.tsx`: Theme context provider
- `components/layout/simple-header.tsx`: Simplified header for basic dashboard mode
- `components/ui/image-upload.tsx`: Business image upload component
- `components/ui/image-gallery.tsx`: Responsive image gallery component
- `app/globals.css`: Custom CSS variables for Green Mission theming
- `middleware.ts`: Clerk authentication middleware
- `next.config.mjs`: Build configuration (ignores TypeScript/ESLint errors, unoptimized images)
- `.env.example`: Environment variable template with all required services

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom Green Mission theme variables
- **UI Library**: Radix UI components (shadcn/ui)
- **Database**: Airtable (multi-base setup: CMS, Directory, Branding)
- **Authentication**: Clerk with organization support
- **Payments**: Stripe with subscription management and pricing tables
- **Cache**: Upstash Redis (optional)
- **Theme**: next-themes with custom light/dark themes and CSS variables
- **State**: React hooks, no global state management (React Context for themes)
- **TypeScript**: Strict mode enabled with path mapping (@/* imports)
- **Validation**: Zod for runtime type checking
- **Forms**: React Hook Form with Zod resolvers

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
- ✅ Organization management with multi-org support

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
- ✅ Business image upload and management system
- ✅ Logo and gallery image support with Airtable integration
- ✅ Simplified and advanced dashboard modes with feature flags

### Directory & Member Display
- ✅ Dynamic member directory with live Airtable data
- ✅ Enhanced member cards with proper badge display
- ✅ Featured Member and Directory Spotlight badges
- ✅ Business Tags badges with distinct styling
- ✅ Grid and list view layouts
- ✅ Real-time search across multiple fields
- ✅ Dynamic category filtering with live member counts
- ✅ Advanced filter panel with Featured/Showcase toggle
- ✅ Business image galleries on member profile pages
- ✅ Responsive image display with gallery components

### Organization Management
- ✅ Clerk organization integration
- ✅ Organization-specific webhooks and data sync
- ✅ Multi-organization support architecture
- ✅ Organization manager component

### Payment Integration
- ✅ Stripe subscription management
- ✅ Membership tier selection during signup
- ✅ Payment success flow integration

### Badge System & Member Display
- ✅ Correct badge labels for all card instances
- ✅ Featured Member badge ("Featured" with heart icon)
- ✅ Directory Spotlight badge ("Showcase" with star icon)
- ✅ Business Tags badges (sustainable practices indicators)
- ✅ Membership tier badges with color coding
- ✅ Proper badge positioning and responsive design

### Search & Filtering System
- ✅ Enhanced search functionality across name, location, tagline, description, specialties, business tags, and certifications
- ✅ Dynamic category extraction from live member data
- ✅ Real-time category filtering with member counts
- ✅ Advanced filter panel with additional options
- ✅ Featured and Showcase business filtering
- ✅ Clear all filters functionality

### Airtable Schema Implementation
- ✅ User ID field created in Member Businesses table
- ✅ Field mapping updated to match existing schema structure
- ✅ Proper handling of linked records and multiple choice fields
- ✅ Business Tags field integration
- ✅ Directory Spotlight field handling
- ✅ Logo and Business Images fields with attachment support
- ✅ Image URL extraction and display integration

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

## Dashboard Configuration System

The application features a sophisticated configuration system that controls dashboard complexity and feature visibility:

### Feature Flags (`lib/feature-flags.ts`)

- **Simplified Mode**: Toggle between basic and advanced dashboard layouts
- **Component Visibility**: Control which features are shown/hidden
- **Form Field Management**: Essential vs. advanced form fields
- **Layout Switching**: Sidebar navigation vs. simple header

### Configuration Files

- `lib/config.ts`: Main configuration system with `getDashboardConfig()`
- `ESSENTIAL_FIELDS`: Core business listing fields always visible
- **Simplified Mode**: Shows only essential fields and basic layout
- **Advanced Mode**: Full feature set with sidebar navigation and advanced components

### Layout Modes

- **Simplified Layout**: Single-column with simple header (`SimpleHeader`)
- **Advanced Layout**: Sidebar navigation with complex header (`AppHeader` + `AppSidebar`)
- Automatic switching based on feature flag configuration

## Image Management System

### Upload Components

- `components/ui/image-upload.tsx`: File upload with preview and validation
- `components/ui/image-gallery.tsx`: Responsive grid gallery display
- `components/dashboard/business-image-display.tsx`: Dashboard image management
- `components/directory/business-image-gallery.tsx`: Directory page image display

### Airtable Integration

- **Logo Field**: Single attachment field for business logo
- **Business Images Field**: Multiple attachment field for gallery images
- Automatic URL extraction from Airtable attachment objects
- Real-time sync between dashboard uploads and Airtable storage

### API Support

- `/api/upload/image`: Image upload endpoint (placeholder for future implementation)
- Business listing API includes logo and businessImages fields
- Response filtering based on simplified mode configuration

## Important Notes

- Build ignores ESLint and TypeScript errors (`next.config.mjs`)
- Images are unoptimized for deployment flexibility (`next.config.mjs`)
- Client-side navigation state in app layout
- Airtable field names use exact case from Airtable (e.g., "Business Name", "Featured Member")
- Theme switching uses CSS custom properties with `hsl(var(--color-name))` pattern
- No test framework configured - tests should be added if comprehensive testing is needed
- Multi-base Airtable architecture with separate API keys (can share same `AIRTABLE_API_KEY`)
- **Business Tags Field**: Limited to predefined options in Airtable: "Sustainable", "Local", "B-Corp", "Women-Owned"
- **Industry Field**: Currently not stored due to Business Tags limitations - needs separate field in future version
- Path mapping configured: Use `@/` for imports from project root
- TypeScript strict mode enabled - type safety enforced throughout codebase
- **Feature Flag System**: Controls dashboard complexity and component visibility
- **Image Management**: Logo and gallery images stored as Airtable attachments
- **Dual Layout System**: Simplified mode for basic users, advanced mode for power users
