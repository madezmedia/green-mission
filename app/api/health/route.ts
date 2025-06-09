import { NextResponse } from "next/server"

export async function GET() {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        clerk: {
          configured: !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
          status: "available",
        },
        redis: {
          configured: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
          status: "optional",
        },
        airtable: {
          configured: !!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_DIR_BASE_ID),
          status: "optional",
        },
        stripe: {
          configured: !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
          status: "optional",
        },
      },
      cache: {
        type: "memory",
        available: true,
      },
    }

    // Test Redis connection if configured
    if (health.services.redis.configured) {
      try {
        const { cacheManager } = await import("@/lib/cache/redis-client")
        if (cacheManager.isRedisAvailable()) {
          health.cache.type = "redis"
          health.services.redis.status = "connected"
        } else {
          health.services.redis.status = "connection_failed"
        }
      } catch (error) {
        health.services.redis.status = "error"
      }
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
