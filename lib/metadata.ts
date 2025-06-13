import type { Metadata } from "next"

interface PageMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
}

const defaultMetadata = {
  siteName: "Green Mission Club",
  defaultTitle: "Green Mission Club - Sustainable Business Network",
  defaultDescription: "Join the largest network of sustainable businesses committed to environmental responsibility and business success. Connect with eco-conscious leaders making a positive impact.",
  defaultImage: "/gmc-logo-full.png",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://greenmissionclub.com",
  twitterHandle: "@greenmissionclub"
}

export function generateMetadata(options: PageMetadataOptions = {}): Metadata {
  const {
    title,
    description = defaultMetadata.defaultDescription,
    path = "/",
    image = defaultMetadata.defaultImage,
    imageAlt,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    tags
  } = options

  const fullTitle = title 
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.defaultTitle

  const fullUrl = `${defaultMetadata.baseUrl}${path}`
  const fullImageUrl = image.startsWith('http') ? image : `${defaultMetadata.baseUrl}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    openGraph: {
      type,
      locale: "en_US",
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: defaultMetadata.siteName,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || fullTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: defaultMetadata.twitterHandle,
      site: defaultMetadata.twitterHandle,
    },
    alternates: {
      canonical: fullUrl,
    },
  }

  // Add article-specific metadata
  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: authors?.map(author => `${defaultMetadata.baseUrl}/authors/${author.toLowerCase().replace(/\s+/g, '-')}`),
      tags,
    }
  }

  return metadata
}

// Predefined metadata for common pages
export const pageMetadata = {
  home: generateMetadata(),
  
  about: generateMetadata({
    title: "About Us",
    description: "Learn about Green Mission Club's commitment to connecting sustainable businesses and fostering environmental responsibility in the business community.",
    path: "/about"
  }),
  
  directory: generateMetadata({
    title: "Business Directory",
    description: "Discover eco-conscious businesses in our comprehensive directory. Find sustainable companies committed to environmental responsibility and business excellence.",
    path: "/directory"
  }),
  
  membership: generateMetadata({
    title: "Membership Plans",
    description: "Join Green Mission Club and connect with like-minded sustainable businesses. Choose from our membership plans designed to support your environmental and business goals.",
    path: "/membership"
  }),
  
  join: generateMetadata({
    title: "Join Our Network",
    description: "Become part of the largest network of sustainable businesses. Apply for membership and start making meaningful connections that drive positive environmental change.",
    path: "/join"
  })
}

// Utility to generate dynamic metadata for business profiles
export function generateBusinessMetadata(businessName: string, businessDescription: string, businessSlug: string, businessLogo?: string): Metadata {
  return generateMetadata({
    title: businessName,
    description: `${businessDescription} - Part of the Green Mission Club sustainable business network.`,
    path: `/directory/${businessSlug}`,
    image: businessLogo || defaultMetadata.defaultImage,
    imageAlt: `${businessName} - Sustainable Business Profile`
  })
}

// Utility to generate blog post metadata
export function generateBlogMetadata(
  title: string, 
  excerpt: string, 
  slug: string, 
  publishedDate: string,
  modifiedDate?: string,
  author?: string,
  featuredImage?: string,
  tags?: string[]
): Metadata {
  return generateMetadata({
    title,
    description: excerpt,
    path: `/blog/${slug}`,
    image: featuredImage,
    imageAlt: title,
    type: "article",
    publishedTime: publishedDate,
    modifiedTime: modifiedDate,
    authors: author ? [author] : undefined,
    tags
  })
}