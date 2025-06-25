import { Metadata } from "next"
import BlogClient from "./blog-client"

export const metadata: Metadata = {
  title: "Blog | Green Mission Club",
  description: "Stay updated with the latest insights on sustainable business practices, environmental initiatives, and green innovation from the Green Mission Club community.",
  keywords: ["sustainability", "green business", "environmental", "blog", "eco-friendly", "sustainable practices"],
}

export default function BlogPage() {
  return <BlogClient />
}