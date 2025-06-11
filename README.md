# Green Mission 🌱

A Next.js membership directory platform connecting eco-conscious businesses and promoting sustainable practices.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mad-ez-media/v0-green-mission)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

## 🚀 Overview

Green Mission is a comprehensive membership platform designed to connect environmentally conscious businesses and promote sustainable practices. The platform features a public showcase website and a private member dashboard with full business listing management.

### Key Features

- **🏢 Business Directory** - Searchable directory of eco-conscious businesses
- **👥 Member Management** - Private dashboard for business listing management
- **🏷️ Smart Badges** - Featured, Showcase, and Business Tags display
- **🔍 Advanced Search** - Multi-field search with category filtering
- **🎨 Dual Themes** - Custom light/dark theme switching
- **💳 Stripe Integration** - Subscription management and payments
- **👨‍💼 Organization Support** - Multi-organization business management
- **📊 Airtable Integration** - Multi-base data management system

## 🛠️ Technology Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Airtable (multi-base architecture)
- **Authentication:** Clerk
- **Payments:** Stripe
- **Cache:** Upstash Redis (optional)
- **Deployment:** Vercel

## 📁 Project Structure

```
green-mission/
├── app/                          # Next.js app router
│   ├── (showcase)/              # Public website
│   ├── (app)/                   # Private dashboard
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── directory/               # Directory & member cards
│   ├── dashboard/               # Dashboard components
│   └── showcase/                # Landing page components
├── lib/                         # Utilities & integrations
│   ├── airtable/               # Airtable client
│   ├── stripe/                 # Stripe configuration
│   └── hooks/                  # Custom React hooks
├── scripts/                     # Setup & maintenance scripts
└── types/                       # TypeScript definitions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Airtable account with API access
- Clerk account for authentication
- Stripe account for payments
- Upstash Redis (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/madezmedia/green-mission.git
   cd green-mission
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and configuration
   ```

4. **Run setup scripts**
   ```bash
   # Interactive Airtable setup
   tsx scripts/setup-green-mission-airtable.ts
   
   # Seed with sample data
   tsx scripts/seed-airtable.ts
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 📝 Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Business ID Management
pnpm generate-business-ids        # Generate business IDs
pnpm generate-business-ids:check  # Validate business IDs

# Setup Scripts
tsx scripts/setup-green-mission-airtable.ts    # Airtable setup
tsx scripts/seed-airtable.ts                   # Seed sample data
tsx scripts/setup-stripe-payment-links.ts     # Stripe setup
```

## 🗄️ Database Schema

### Multi-Base Airtable Architecture

- **CMS Base**: Blog posts, website pages, testimonials
- **Directory Base**: Member businesses, membership tiers, categories
- **Branding Base**: Brand assets, marketing materials, badge designs

### Key Tables

- **Member Businesses**: Business listings with full profile data
- **Membership Tiers**: Subscription plans and pricing
- **Directory Categories**: Business categories with member counts
- **Badge Designs**: Custom badge configurations

## 🔧 Configuration

### Environment Variables

```bash
# Airtable Configuration
AIRTABLE_API_KEY=                    # Main API key
AIRTABLE_CMS_BASE_ID=               # CMS base
AIRTABLE_DIR_BASE_ID=               # Directory base  
AIRTABLE_BRAND_BASE_ID=             # Branding base

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Optional Services
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## 🎨 Features Deep Dive

### Badge System
- **Featured Member**: Heart icon badge for promoted businesses
- **Directory Spotlight**: Star icon badge for showcase businesses  
- **Business Tags**: Sustainable, Local, B-Corp, Women-Owned indicators
- **Membership Tiers**: Color-coded tier badges (Enterprise, Premium, Basic)

### Search & Filtering
- **Multi-field Search**: Name, location, tagline, description, specialties, tags, certifications
- **Dynamic Categories**: Live extraction from member data with real counts
- **Advanced Filters**: Featured/Showcase toggle, tier filtering
- **Real-time Results**: Instant search with result counts

### Organization Management
- **Multi-org Support**: Clerk organization integration
- **Business Listings**: Multiple businesses per organization
- **Role Management**: Admin/member roles with permissions
- **Webhook Sync**: Real-time data synchronization

## 🚢 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import project to Vercel
   - Configure build settings

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure webhook secrets are configured

3. **Domain Configuration**
   - Set up custom domain
   - Configure DNS settings

### Build Configuration

```javascript
// next.config.mjs
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Clerk](https://clerk.com) - Authentication
- [Stripe](https://stripe.com) - Payment processing
- [Airtable](https://airtable.com) - Database platform
- [Vercel](https://vercel.com) - Deployment platform

## 🔗 Links

- **Live Demo**: [https://vercel.com/mad-ez-media/v0-green-mission](https://vercel.com/mad-ez-media/v0-green-mission)
- **Documentation**: See [CLAUDE.md](CLAUDE.md) for detailed development guidance
- **Issues**: [GitHub Issues](https://github.com/madezmedia/green-mission/issues)
- **Discussions**: [GitHub Discussions](https://github.com/madezmedia/green-mission/discussions)

---

**Built with 💚 for a sustainable future**