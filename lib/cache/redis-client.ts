import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache key patterns for different services
export const CACHE_KEYS = {
  // Airtable caching
  AIRTABLE: {
    MEMBERS: "airtable:members",
    MEMBER_BY_SLUG: (slug: string) => `airtable:member:${slug}`,
    MEMBERSHIP_TIERS: "airtable:membership-tiers",
    BLOG_POSTS: "airtable:blog-posts",
    TESTIMONIALS: "airtable:testimonials",
    DIRECTORY_CATEGORIES: "airtable:directory-categories",
    FEATURED_MEMBERS: "airtable:featured-members",
  },

  // Clerk user caching
  CLERK: {
    USER: (userId: string) => `clerk:user:${userId}`,
    USER_METADATA: (userId: string) => `clerk:user:metadata:${userId}`,
    ORGANIZATION: (orgId: string) => `clerk:org:${orgId}`,
  },

  // Stripe data caching
  STRIPE: {
    CUSTOMER: (customerId: string) => `stripe:customer:${customerId}`,
    SUBSCRIPTION: (subId: string) => `stripe:subscription:${subId}`,
    PRICES: "stripe:prices",
    PRODUCTS: "stripe:products",
    CUSTOMER_BY_EMAIL: (email: string) => `stripe:customer:email:${email}`,
  },

  // Cross-service data
  MEMBER_PROFILE: (userId: string) => `profile:${userId}`,
  MEMBER_PERMISSIONS: (userId: string) => `permissions:${userId}`,
}

// Cache TTL settings (in seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes - dynamic content
  MEDIUM: 1800, // 30 minutes - semi-static content
  LONG: 3600, // 1 hour - mostly static content
  VERY_LONG: 86400, // 24 hours - rarely changing content
}

// Enhanced cache utility class
export class CacheManager {
  private redis: Redis

  constructor() {
    this.redis = redis
  }

  // Generic get with automatic JSON parsing
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key)
      return value as T
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  // Generic set with automatic JSON stringification
  async set<T>(key: string, value: T, ttl: number = CACHE_TTL.MEDIUM): Promise<boolean> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  // Delete single key
  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  // Delete multiple keys by pattern
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        return await this.redis.del(...keys)
      }
      return 0
    } catch (error) {
      console.error(`Cache pattern delete error for pattern ${pattern}:`, error)
      return 0
    }
  }

  // Get or set pattern - returns cached value or fetches fresh data
  async getOrSet<T>(key: string, fetchFunction: () => Promise<T>, ttl: number = CACHE_TTL.MEDIUM): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key)
      if (cached !== null) {
        return cached
      }

      // Fetch fresh data
      const freshData = await fetchFunction()

      // Cache the fresh data
      await this.set(key, freshData, ttl)

      return freshData
    } catch (error) {
      console.error(`Cache getOrSet error for key ${key}:`, error)
      // If cache fails, still return fresh data
      return await fetchFunction()
    }
  }

  // Cache warming - preload frequently accessed data
  async warmCache(): Promise<void> {
    console.log("Starting cache warming...")

    try {
      // Warm Airtable data
      await this.warmAirtableCache()

      // Warm Stripe data
      await this.warmStripeCache()

      console.log("Cache warming completed")
    } catch (error) {
      console.error("Cache warming failed:", error)
    }
  }

  private async warmAirtableCache(): Promise<void> {
    const {
      getGreenMissionMemberBusinesses,
      getGreenMissionMembershipTiers,
      getGreenMissionDirectoryCategories,
      getGreenMissionBlogPosts,
    } = await import("../airtable/green-mission-client")

    // Warm membership tiers
    const tiers = await getGreenMissionMembershipTiers(true)
    await this.set(CACHE_KEYS.AIRTABLE.MEMBERSHIP_TIERS, tiers, CACHE_TTL.VERY_LONG)

    // Warm directory categories
    const categories = await getGreenMissionDirectoryCategories(true)
    await this.set(CACHE_KEYS.AIRTABLE.DIRECTORY_CATEGORIES, categories, CACHE_TTL.LONG)

    // Warm featured members
    const featuredMembers = await getGreenMissionMemberBusinesses({
      featuredMember: true,
      membershipStatus: "Active",
      limit: 6,
    })
    await this.set(CACHE_KEYS.AIRTABLE.FEATURED_MEMBERS, featuredMembers, CACHE_TTL.MEDIUM)

    // Warm recent blog posts
    const blogPosts = await getGreenMissionBlogPosts({ limit: 10 })
    await this.set(CACHE_KEYS.AIRTABLE.BLOG_POSTS, blogPosts, CACHE_TTL.MEDIUM)
  }

  private async warmStripeCache(): Promise<void> {
    const stripe = (await import("stripe")).default
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!)

    // Warm Stripe prices
    const prices = await stripeClient.prices.list({ active: true })
    await this.set(CACHE_KEYS.STRIPE.PRICES, prices.data, CACHE_TTL.LONG)

    // Warm Stripe products
    const products = await stripeClient.products.list({ active: true })
    await this.set(CACHE_KEYS.STRIPE.PRODUCTS, products.data, CACHE_TTL.LONG)
  }
}

export const cacheManager = new CacheManager()

// Airtable caching wrapper functions
export class AirtableCacheWrapper {
  // Cached member businesses with smart invalidation
  static async getMemberBusinesses(options: any = {}) {
    const optionsKey = JSON.stringify(options)
    const cacheKey = `${CACHE_KEYS.AIRTABLE.MEMBERS}:${Buffer.from(optionsKey).toString("base64")}`

    return cacheManager.getOrSet(
      cacheKey,
      async () => {
        const { getGreenMissionMemberBusinesses } = await import("../airtable/green-mission-client")
        return getGreenMissionMemberBusinesses(options)
      },
      options.featuredMember ? CACHE_TTL.SHORT : CACHE_TTL.MEDIUM,
    )
  }

  // Cached single member by slug
  static async getMemberBySlug(slug: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.AIRTABLE.MEMBER_BY_SLUG(slug),
      async () => {
        const { getGreenMissionMemberBusinesses } = await import("../airtable/green-mission-client")
        const members = await getGreenMissionMemberBusinesses({
          slug: slug,
          membershipStatus: "Active",
          directoryVisibility: true,
        })
        return members[0] || null
      },
      CACHE_TTL.MEDIUM,
    )
  }

  // Cached membership tiers
  static async getMembershipTiers() {
    return cacheManager.getOrSet(
      CACHE_KEYS.AIRTABLE.MEMBERSHIP_TIERS,
      async () => {
        const { getGreenMissionMembershipTiers } = await import("../airtable/green-mission-client")
        return getGreenMissionMembershipTiers(true)
      },
      CACHE_TTL.VERY_LONG, // Tiers rarely change
    )
  }

  // Invalidate member-related cache when member data changes
  static async invalidateMemberCache(memberId?: string, slug?: string) {
    const promises = [
      cacheManager.delPattern(`${CACHE_KEYS.AIRTABLE.MEMBERS}:*`),
      cacheManager.del(CACHE_KEYS.AIRTABLE.FEATURED_MEMBERS),
    ]

    if (slug) {
      promises.push(cacheManager.del(CACHE_KEYS.AIRTABLE.MEMBER_BY_SLUG(slug)))
    }

    await Promise.all(promises)
  }
}

// Clerk caching wrapper functions
export class ClerkCacheWrapper {
  // Cached user data
  static async getUser(userId: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.CLERK.USER(userId),
      async () => {
        const { clerkClient } = await import("@clerk/nextjs/server")
        return clerkClient.users.getUser(userId)
      },
      CACHE_TTL.MEDIUM,
    )
  }

  // Cached user metadata
  static async getUserMetadata(userId: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.CLERK.USER_METADATA(userId),
      async () => {
        const user = await ClerkCacheWrapper.getUser(userId)
        return {
          publicMetadata: user.publicMetadata,
          privateMetadata: user.privateMetadata,
          unsafeMetadata: user.unsafeMetadata,
        }
      },
      CACHE_TTL.SHORT, // Metadata can change frequently
    )
  }

  // Invalidate user cache when user data changes
  static async invalidateUserCache(userId: string) {
    await Promise.all([
      cacheManager.del(CACHE_KEYS.CLERK.USER(userId)),
      cacheManager.del(CACHE_KEYS.CLERK.USER_METADATA(userId)),
      cacheManager.del(CACHE_KEYS.MEMBER_PROFILE(userId)),
      cacheManager.del(CACHE_KEYS.MEMBER_PERMISSIONS(userId)),
    ])
  }
}

// Stripe caching wrapper functions
export class StripeCacheWrapper {
  // Cached customer data
  static async getCustomer(customerId: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.STRIPE.CUSTOMER(customerId),
      async () => {
        const stripe = (await import("stripe")).default
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!)
        return stripeClient.customers.retrieve(customerId)
      },
      CACHE_TTL.MEDIUM,
    )
  }

  // Cached customer by email
  static async getCustomerByEmail(email: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.STRIPE.CUSTOMER_BY_EMAIL(email),
      async () => {
        const stripe = (await import("stripe")).default
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!)
        const customers = await stripeClient.customers.list({ email, limit: 1 })
        return customers.data[0] || null
      },
      CACHE_TTL.MEDIUM,
    )
  }

  // Cached subscription data
  static async getSubscription(subscriptionId: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.STRIPE.SUBSCRIPTION(subscriptionId),
      async () => {
        const stripe = (await import("stripe")).default
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!)
        return stripeClient.subscriptions.retrieve(subscriptionId, {
          expand: ["customer", "items.data.price.product"],
        })
      },
      CACHE_TTL.SHORT, // Subscriptions can change status frequently
    )
  }

  // Cached prices (rarely change)
  static async getPrices() {
    return cacheManager.getOrSet(
      CACHE_KEYS.STRIPE.PRICES,
      async () => {
        const stripe = (await import("stripe")).default
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!)
        const prices = await stripeClient.prices.list({
          active: true,
          expand: ["data.product"],
        })
        return prices.data
      },
      CACHE_TTL.VERY_LONG,
    )
  }

  // Invalidate customer cache when customer data changes
  static async invalidateCustomerCache(customerId: string, email?: string) {
    const promises = [cacheManager.del(CACHE_KEYS.STRIPE.CUSTOMER(customerId))]

    if (email) {
      promises.push(cacheManager.del(CACHE_KEYS.STRIPE.CUSTOMER_BY_EMAIL(email)))
    }

    await Promise.all(promises)
  }

  // Invalidate subscription cache when subscription changes
  static async invalidateSubscriptionCache(subscriptionId: string) {
    await cacheManager.del(CACHE_KEYS.STRIPE.SUBSCRIPTION(subscriptionId))
  }
}

// Cross-service member profile caching
export class MemberProfileCache {
  // Get complete member profile (Clerk + Airtable + Stripe)
  static async getCompleteProfile(userId: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.MEMBER_PROFILE(userId),
      async () => {
        const [user, userMetadata] = await Promise.all([
          ClerkCacheWrapper.getUser(userId),
          ClerkCacheWrapper.getUserMetadata(userId),
        ])

        // Get Airtable member data if linked
        let airtableMember = null
        if (user.emailAddresses[0]?.emailAddress) {
          const members = await AirtableCacheWrapper.getMemberBusinesses({
            membershipStatus: "Active",
          })
          airtableMember = members.find((m: any) => m.Email === user.emailAddresses[0].emailAddress)
        }

        // Get Stripe customer data if exists
        let stripeCustomer = null
        if (user.emailAddresses[0]?.emailAddress) {
          stripeCustomer = await StripeCacheWrapper.getCustomerByEmail(user.emailAddresses[0].emailAddress)
        }

        return {
          user,
          metadata: userMetadata,
          airtableMember,
          stripeCustomer,
          lastUpdated: new Date().toISOString(),
        }
      },
      CACHE_TTL.SHORT, // Complete profiles change frequently
    )
  }

  // Get member permissions (cached)
  static async getMemberPermissions(userId: string) {
    return cacheManager.getOrSet(
      CACHE_KEYS.MEMBER_PERMISSIONS(userId),
      async () => {
        const profile = await MemberProfileCache.getCompleteProfile(userId)

        // Determine permissions based on membership tier
        const tier = profile.airtableMember?.["Membership Tier"] || "Basic"
        const permissions = {
          canAccessDirectory: true,
          canAccessPremiumContent: ["Premium", "Enterprise"].includes(tier),
          canAccessEnterpriseFeatures: tier === "Enterprise",
          canEditProfile: true,
          membershipTier: tier,
        }

        return permissions
      },
      CACHE_TTL.MEDIUM,
    )
  }

  // Invalidate complete profile cache
  static async invalidateProfile(userId: string) {
    await Promise.all([
      cacheManager.del(CACHE_KEYS.MEMBER_PROFILE(userId)),
      cacheManager.del(CACHE_KEYS.MEMBER_PERMISSIONS(userId)),
    ])
  }
}

// Webhook handlers for cache invalidation
export class CacheInvalidationHandlers {
  // Handle Clerk webhook events
  static async handleClerkWebhook(eventType: string, data: any) {
    switch (eventType) {
      case "user.updated":
      case "user.deleted":
        await ClerkCacheWrapper.invalidateUserCache(data.id)
        await MemberProfileCache.invalidateProfile(data.id)
        break
    }
  }

  // Handle Stripe webhook events
  static async handleStripeWebhook(eventType: string, data: any) {
    switch (eventType) {
      case "customer.updated":
      case "customer.deleted":
        await StripeCacheWrapper.invalidateCustomerCache(data.object.id, data.object.email)
        break

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await StripeCacheWrapper.invalidateSubscriptionCache(data.object.id)
        break
    }
  }

  // Handle Airtable webhook events (if using Airtable automations)
  static async handleAirtableWebhook(tableId: string, recordId: string, action: string) {
    switch (tableId) {
      case "Member Businesses":
        await AirtableCacheWrapper.invalidateMemberCache(recordId)
        break

      case "Membership Tiers":
        await cacheManager.del(CACHE_KEYS.AIRTABLE.MEMBERSHIP_TIERS)
        break
    }
  }
}

// Performance monitoring
export class CacheMetrics {
  static async getCacheStats() {
    try {
      const info = await redis.info()
      return {
        memory: info.used_memory_human,
        connections: info.connected_clients,
        operations: info.total_commands_processed,
        hitRate: (info.keyspace_hits / (info.keyspace_hits + info.keyspace_misses)) * 100,
      }
    } catch (error) {
      console.error("Error getting cache stats:", error)
      return null
    }
  }
}
