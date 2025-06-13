"use client"

import { useState, useEffect } from "react"

export interface SiteSettings {
  [key: string]: {
    value: string
    type: "Text" | "Image" | "URL" | "Boolean" | "JSON"
    category: string
    id: string
  }
}

export interface BrandAsset {
  id: string
  assetName: string
  assetType: string
  files: { url: string; filename: string }[]
  usageContext: string[]
  active: boolean
  altText?: string
  notes?: string
}

export function useSiteSettings(category?: string) {
  const [settings, setSettings] = useState<SiteSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (category) params.append("category", category)
        
        const response = await fetch(`/api/cms/site-settings?${params}`)
        const result = await response.json()
        
        if (result.success) {
          setSettings(result.data)
        } else {
          setError(result.error || "Failed to fetch settings")
        }
      } catch (err) {
        setError("Failed to fetch settings")
        console.error("Error fetching site settings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [category])

  return { settings, loading, error }
}

export function useBrandAssets(assetType?: string, usageContext?: string) {
  const [assets, setAssets] = useState<BrandAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAssets() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (assetType) params.append("type", assetType)
        if (usageContext) params.append("usage", usageContext)
        
        const response = await fetch(`/api/cms/brand-assets?${params}`)
        const result = await response.json()
        
        if (result.success) {
          setAssets(Array.isArray(result.data) ? result.data : [result.data])
        } else {
          setError(result.error || "Failed to fetch assets")
        }
      } catch (err) {
        setError("Failed to fetch assets")
        console.error("Error fetching brand assets:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [assetType, usageContext])

  return { assets, loading, error }
}

// Helper function to get a specific setting value
export function useSettingValue(settingKey: string) {
  const { settings, loading, error } = useSiteSettings()
  
  const value = settings[settingKey]?.value
  const settingType = settings[settingKey]?.type
  
  // Parse boolean values
  if (settingType === "Boolean") {
    return { 
      value: value === "true" || value === "1", 
      loading, 
      error,
      type: settingType 
    }
  }
  
  // Parse JSON values
  if (settingType === "JSON" && value) {
    try {
      return { 
        value: JSON.parse(value), 
        loading, 
        error,
        type: settingType 
      }
    } catch {
      return { 
        value: null, 
        loading, 
        error: "Invalid JSON in setting",
        type: settingType 
      }
    }
  }
  
  return { value, loading, error, type: settingType }
}

// Helper function to get the primary logo
export function usePrimaryLogo() {
  const { assets, loading, error } = useBrandAssets("Logo - Primary", "Header")
  
  const logo = assets.length > 0 ? assets[0] : null
  const logoUrl = logo?.files?.[0]?.url
  const altText = logo?.altText || "Logo"
  
  return { logo, logoUrl, altText, loading, error }
}

// Page Content interfaces
export interface PageContent {
  id: string
  pageSlug: string
  pageTitle: string
  metaDescription?: string
  heroTitle?: string
  heroDescription?: string
  published: boolean
  sections?: PageSection[]
  callToActions?: CallToAction[]
}

export interface PageSection {
  id: string
  pageSlug: string
  sectionSlug: string
  sectionTitle: string
  sectionContent?: string
  sectionOrder: number
  sectionType: "text" | "list" | "grid" | "cta"
  published: boolean
}

export interface CallToAction {
  id: string
  ctaTitle: string
  ctaDescription?: string
  ctaButtonText: string
  ctaButtonLink: string
  ctaType: "primary" | "secondary" | "outline"
  active: boolean
}

// Membership Plan interface
export interface MembershipPlan {
  id: string
  planName: string
  planSubtitle: string
  monthlyPrice: number
  annualPrice: number
  annualSavings: string
  planDescription: string
  features: string
  planOrder: number
  active: boolean
  featured?: boolean
}

// Hook to fetch page content
export function usePageContent(slug: string, includeSections = true, includeCTAs = false) {
  const [pageContent, setPageContent] = useState<PageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPageContent() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        params.append("slug", slug)
        if (includeSections) params.append("sections", "true")
        if (includeCTAs) params.append("ctas", "true")
        
        const response = await fetch(`/api/cms/page-content?${params}`)
        const result = await response.json()
        
        if (result.success) {
          setPageContent(result.data)
        } else {
          setError(result.error || "Failed to fetch page content")
        }
      } catch (err) {
        setError("Failed to fetch page content")
        console.error("Error fetching page content:", err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPageContent()
    }
  }, [slug, includeSections, includeCTAs])

  return { pageContent, loading, error }
}

// Hook to fetch page sections
export function usePageSections(pageSlug: string) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSections() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        params.append("page", pageSlug)
        
        const response = await fetch(`/api/cms/page-sections?${params}`)
        const result = await response.json()
        
        if (result.success) {
          setSections(Array.isArray(result.data) ? result.data : [result.data])
        } else {
          setError(result.error || "Failed to fetch page sections")
        }
      } catch (err) {
        setError("Failed to fetch page sections")
        console.error("Error fetching page sections:", err)
      } finally {
        setLoading(false)
      }
    }

    if (pageSlug) {
      fetchSections()
    }
  }, [pageSlug])

  return { sections, loading, error }
}

// Hook to get a specific section
export function usePageSection(pageSlug: string, sectionSlug: string) {
  const [section, setSection] = useState<PageSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSection() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        params.append("page", pageSlug)
        params.append("section", sectionSlug)
        
        const response = await fetch(`/api/cms/page-sections?${params}`)
        const result = await response.json()
        
        if (result.success) {
          setSection(result.data)
        } else {
          setError(result.error || "Failed to fetch page section")
        }
      } catch (err) {
        setError("Failed to fetch page section")
        console.error("Error fetching page section:", err)
      } finally {
        setLoading(false)
      }
    }

    if (pageSlug && sectionSlug) {
      fetchSection()
    }
  }, [pageSlug, sectionSlug])

  return { section, loading, error }
}

// Hook to fetch membership plans
export function useMembershipPlans(activeOnly = true) {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlans() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (activeOnly) params.append("active", "true")
        
        const response = await fetch(`/api/cms/membership-plans?${params}`)
        const result = await response.json()
        
        if (result.plans) {
          setPlans(result.plans)
        } else {
          setError(result.error || "Failed to fetch membership plans")
        }
      } catch (err) {
        setError("Failed to fetch membership plans")
        console.error("Error fetching membership plans:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [activeOnly])

  return { plans, loading, error }
}