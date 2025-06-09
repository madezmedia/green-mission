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

### Component Architecture
- **UI Components**: shadcn/ui components in `components/ui/`
- **Layout Components**: Header, sidebar, navigation in `components/layout/`
- **Feature Components**: Organized by domain (dashboard, directory, showcase)
- **Theme Provider**: Custom theme switching with Green Mission branding

### Key Files
- `lib/airtable/green-mission-client.ts`: All Airtable data access functions
- `lib/data.ts`: Static/mock data and data transformations
- `types/index.ts`: TypeScript interfaces for Member and Category types
- `components/theme-provider.tsx`: Theme context provider
- `styles/globals.css`: Custom CSS variables for Green Mission theming

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom Green Mission theme variables
- **UI Library**: Radix UI components (shadcn/ui)
- **Database**: Airtable (multi-base setup)
- **Theme**: next-themes with custom light/dark themes
- **State**: React hooks, no global state management
- **TypeScript**: Strict mode enabled

## Deployment & Integration

- **v0.dev Integration**: Project syncs automatically with v0.dev deployments
- **Vercel Deployment**: Live at <https://vercel.com/mad-ez-media/v0-green-mission>
- **Environment Setup**: Use setup script for multi-base Airtable configuration
- **API Endpoints**: `/api/configuration/status` for Airtable connection testing

## Important Notes

- Build ignores ESLint and TypeScript errors (`next.config.mjs`)
- Images are unoptimized for deployment flexibility
- Client-side navigation state in app layout
- Airtable field names use exact case from Airtable (e.g., "Business Name", "Featured Member")
- Theme switching uses CSS custom properties with `hsl(var(--color-name))` pattern
- No test framework configured - tests should be added if comprehensive testing is needed
