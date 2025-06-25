import { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPostClient from "./blog-post-client"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/blog/${slug}`)
    
    if (!response.ok) {
      return {
        title: "Blog Post Not Found | Green Mission Club",
        description: "The requested blog post could not be found."
      }
    }

    const data = await response.json()
    const post = data.post

    return {
      title: `${post.Title} | Green Mission Club Blog`,
      description: post["Meta Description"] || post.Excerpt || "Read this insightful article from Green Mission Club.",
      keywords: post.Tags || ["sustainability", "green business", "environmental"],
      openGraph: {
        title: post["SEO Title"] || post.Title,
        description: post["Meta Description"] || post.Excerpt,
        images: post["Featured Image"]?.[0]?.url ? [post["Featured Image"][0].url] : [],
      }
    }
  } catch (error) {
    return {
      title: "Blog Post | Green Mission Club",
      description: "Read insights from the Green Mission Club community."
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  return <BlogPostClient slug={slug} />
}