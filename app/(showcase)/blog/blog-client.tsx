"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Tag, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/lib/airtable/green-mission-client"

interface BlogResponse {
  success: boolean
  count: number
  posts: Partial<BlogPost>[]
}

export default function BlogClient() {
  const [posts, setPosts] = useState<Partial<BlogPost>[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<Partial<BlogPost>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        
        // Fetch featured posts
        const featuredResponse = await fetch("/api/blog?featured=true&limit=3")
        const featuredData: BlogResponse = await featuredResponse.json()
        
        // Fetch all posts
        const allResponse = await fetch("/api/blog?limit=12")
        const allData: BlogResponse = await allResponse.json()
        
        if (featuredData.success && allData.success) {
          setFeaturedPosts(featuredData.posts)
          setPosts(allData.posts)
        } else {
          setError("Failed to fetch blog posts")
        }
      } catch (err) {
        setError("Error loading blog posts")
        console.error("Blog fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getImageUrl = (featuredImage?: { url: string }[]) => {
    return featuredImage?.[0]?.url || "/api/placeholder/600/400"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Green Mission Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover insights, stories, and innovations from the sustainable business community. 
            Learn from eco-conscious leaders making a positive impact on our planet.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(post["Featured Image"])}
                      alt={post.Title || "Blog post image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>
                  <CardHeader>
                    <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.Title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post["Published Date"])}
                      </div>
                      {post["Read Time"] && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post["Read Time"]} min read
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.Excerpt || "Read this insightful article about sustainable business practices..."}
                    </p>
                    <Link href={`/blog/${post.Slug}`}>
                      <Button variant="outline" className="group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="text-3xl font-bold text-primary mb-8">Latest Articles</h2>
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No blog posts available at the moment.</p>
              <p className="text-muted-foreground">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getImageUrl(post["Featured Image"])}
                      alt={post.Title || "Blog post image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.Featured && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {post.Title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post["Published Date"])}
                      </div>
                      {post["Read Time"] && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post["Read Time"]} min read
                        </div>
                      )}
                    </div>
                    {post.Tags && post.Tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.Tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.Excerpt || "Read this insightful article about sustainable business practices..."}
                    </p>
                    <Link href={`/blog/${post.Slug}`}>
                      <Button variant="outline" className="group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">
            Join Our Sustainable Business Community
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Connect with like-minded businesses, share your sustainability journey, and access exclusive content 
            by becoming a member of Green Mission Club.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button size="lg">
                Become a Member
              </Button>
            </Link>
            <Link href="/directory">
              <Button variant="outline" size="lg">
                Explore Directory
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}