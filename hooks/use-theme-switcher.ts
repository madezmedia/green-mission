"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export type ColorTheme = "mint" | "playful"
export type AppearanceTheme = "light" | "dark" | "system"

export function useThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [colorTheme, setColorTheme] = useState<ColorTheme>("mint")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load color theme from localStorage
    const savedColorTheme = localStorage.getItem("color-theme") as ColorTheme
    if (savedColorTheme && ["mint", "playful"].includes(savedColorTheme)) {
      setColorTheme(savedColorTheme)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    // Add transition class for smooth theme changes
    root.classList.add("theme-transition")

    // Remove existing theme classes
    root.classList.remove("theme-playful")

    // Apply color theme
    if (colorTheme === "playful") {
      root.classList.add("theme-playful")
    }

    // Save to localStorage
    localStorage.setItem("color-theme", colorTheme)

    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove("theme-transition")
    }, 400)
  }, [colorTheme, mounted])

  const toggleColorTheme = () => {
    setColorTheme((prev) => (prev === "mint" ? "playful" : "mint"))
  }

  const setAppearanceTheme = (newTheme: AppearanceTheme) => {
    setTheme(newTheme)
  }

  const currentAppearance = theme === "system" ? systemTheme : theme

  // Get theme display names
  const getColorThemeDisplay = () => {
    return colorTheme === "mint" ? "Mint & Teal" : "Playful Green"
  }

  const getAppearanceDisplay = () => {
    switch (currentAppearance) {
      case "light":
        return "Light Mode"
      case "dark":
        return "Dark Mode"
      default:
        return "System"
    }
  }

  return {
    colorTheme,
    setColorTheme,
    toggleColorTheme,
    appearanceTheme: currentAppearance as AppearanceTheme,
    setAppearanceTheme,
    mounted,
    getColorThemeDisplay,
    getAppearanceDisplay,
  }
}
