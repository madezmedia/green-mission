# Deployment Guide - Green Mission Club

## 🚀 Production Deployment

This guide covers deploying the Green Mission Club platform to production with all features fully functional.

## 📋 Pre-Deployment Checklist

### ✅ Required Services Setup
- [ ] Airtable account with 3 bases created (CMS, Directory, Branding)
- [ ] Clerk account for authentication (optional - ready for activation)
- [ ] Stripe account with payment links configured
- [ ] Upstash Redis account (optional - for caching)
- [ ] Vercel account for hosting

### ✅ Environment Variables
Ensure all required environment variables are configured:

```bash
# Airtable Configuration (REQUIRED)
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_CMS_BASE_ID=your_cms_base_id
AIRTABLE_DIR_BASE_ID=your_directory_base_id  
AIRTABLE_BRAND_BASE_ID=your_branding_base_id

# Stripe Configuration (REQUIRED)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Authentication (OPTIONAL - Ready for activation)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Caching (OPTIONAL - Performance optimization)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 🏗️ Airtable CMS Setup

### 1. Create Airtable Bases

Run the setup script to create all required bases and tables:

```bash
tsx scripts/setup-green-mission-airtable.ts
```

This creates:
- **CMS Base**: Blog posts, site settings, page content
- **Directory Base**: Members, membership tiers, categories  
- **Branding Base**: Brand assets, logos, marketing materials

### 2. Populate Sample Data

```bash
tsx scripts/seed-airtable.ts
```

### 3. Configure CMS Content

Access the CMS admin panel at `/cms-admin` to:
- Add blog posts and featured articles
- Upload brand assets and logos
- Configure site settings and page content
- Manage member directory information

## 💳 Stripe Payment Setup

### 1. Create Payment Links

```bash
tsx scripts/setup-stripe-payment-links.ts
```

### 2. Configure Webhooks

Set up Stripe webhooks pointing to:
```
https://yourdomain.com/api/webhooks/stripe
```

Required events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 3. Test Payment Flow

1. Visit `/membership` page
2. Click "Join Now" for any tier
3. Complete Stripe checkout
4. Verify redirect to `/success` page

## 🔐 Authentication Setup (Optional)

### 1. Clerk Configuration

If enabling authentication:

1. Create Clerk application
2. Configure OAuth providers
3. Set up organization support
4. Configure webhooks pointing to:
   ```
   https://yourdomain.com/api/webhooks/clerk
   ```

### 2. Enable Authentication

Uncomment authentication middleware in:
- `middleware.ts`
- Protected route components
- Dashboard access controls

## 🌐 Vercel Deployment

### 1. Connect Repository

1. Import project to Vercel
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### 2. Environment Variables

Add all environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`
- Ensure production values are used

### 3. Domain Configuration

1. Add custom domain in Vercel dashboard
2. Configure DNS records:
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

### 4. Deploy

```bash
git push origin main
```

Vercel will automatically deploy on push to main branch.

## 🔧 Post-Deployment Configuration

### 1. Verify All Features

Test each major feature:
- [ ] Home page loads with logo variations
- [ ] Directory displays members with proper badges
- [ ] About page content displays correctly
- [ ] Membership page Stripe integration works
- [ ] Blog system displays posts from CMS
- [ ] Brand assets download functionality
- [ ] Mobile responsiveness across all pages

### 2. SEO Configuration

1. Verify meta tags are populated
2. Submit sitemap to Google Search Console
3. Configure Google Analytics (if desired)

### 3. Performance Optimization

1. Enable Redis caching if configured
2. Monitor Core Web Vitals
3. Optimize images and assets

## 🚨 Troubleshooting

### Common Issues

**Airtable Connection Errors**
- Verify API key has correct permissions
- Check base IDs are correct
- Ensure tables exist with proper field names

**Stripe Payment Issues**
- Verify webhook endpoints are accessible
- Check webhook secret matches environment variable
- Ensure payment links are active

**Build Failures**
- Check all environment variables are set
- Verify TypeScript compilation passes locally
- Review build logs for specific errors

### Debug Commands

```bash
# Check CMS configuration
curl https://yourdomain.com/api/cms/config-status

# Test Stripe integration
curl https://yourdomain.com/api/stripe/payment-links

# Verify member data
curl https://yourdomain.com/api/members
```

## 📊 Monitoring

### Health Checks

The application includes health check endpoints:
- `/api/health` - Basic application health
- `/api/cms/config-status` - CMS configuration status

### Performance Monitoring

Monitor these key metrics:
- Page load times
- API response times
- Stripe payment success rates
- CMS content loading performance

## 🔄 Updates and Maintenance

### Content Updates

1. **Blog Posts**: Add via CMS admin or directly in Airtable
2. **Member Directory**: Update member information in Directory base
3. **Brand Assets**: Upload new assets via Brand Assets page
4. **Site Settings**: Modify via CMS admin panel

### Code Updates

```bash
# Deploy updates
git add .
git commit -m "feat: your update description"
git push origin main
```

Vercel will automatically redeploy.

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Airtable bases populated with content
- [ ] Stripe payment flow tested end-to-end
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags configured
- [ ] Domain and SSL configured
- [ ] Performance optimization enabled
- [ ] Monitoring and analytics setup
- [ ] Backup and recovery plan in place

## 📞 Support

For deployment issues:
1. Check this deployment guide
2. Review application logs in Vercel dashboard
3. Test API endpoints individually
4. Verify third-party service configurations

---

**🌱 Ready to launch your sustainable business directory!**