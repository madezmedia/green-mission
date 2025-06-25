"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { BlogPost } from "@/lib/airtable/green-mission-client"

interface BlogPostResponse {
  success: boolean
  post: Partial<BlogPost>
}

interface BlogPostClientProps {
  slug: string
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const [post, setPost] = useState<Partial<BlogPost> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/blog/${slug}`)
        const data: BlogPostResponse = await response.json()
        
        if (data.success && data.post) {
          setPost(data.post)
        } else {
          setError("Blog post not found")
        }
      } catch (err) {
        setError("Error loading blog post")
        console.error("Blog post fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getImageUrl = (featuredImage?: { url: string }[]) => {
    return featuredImage?.[0]?.url || "/api/placeholder/800/400"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || "The requested blog post could not be found."}</p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post["Featured Image"] && (
            <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(post["Featured Image"])}
                alt={post.Title || "Blog post image"}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.Tags?.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {post.Featured && (
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              {post.Title}
            </h1>

            {post.Excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.Excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post["Published Date"])}
              </div>
              {post["Read Time"] && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post["Read Time"]} min read
                </div>
              )}
              {post["View Count"] && (
                <div className="flex items-center gap-2">
                  <span>{post["View Count"]} views</span>
                </div>
              )}
              <Button variant="ghost" size="sm" className="ml-auto">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.Content ? (
              <div 
                dangerouslySetInnerHTML={{ __html: post.Content }}
                className="text-foreground leading-relaxed"
              />
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>Content is not available for this blog post.</p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Join Our Sustainable Business Community
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Connect with like-minded businesses and access exclusive content by becoming a member of Green Mission Club.
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
            </CardContent>
          </Card>
        </div>
      </article>
    </div>
  )
}