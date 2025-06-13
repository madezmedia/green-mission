import AboutPageClient from "./about-client"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata.about

export default function AboutPage() {
  return <AboutPageClient />
}