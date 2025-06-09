"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useCallback } from "react"

export type ColorTheme = "mint" | "playful"
export type AppearanceTheme = "light" | "dark" | "system"

const COLOR_THEME_KEY = "green-mission-color-theme"
const THEME_PREFERENCE_KEY = "green-mission-theme-preference"

export function useThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [colorTheme, setColorThemeState] = useState<ColorTheme>("mint")
  const [mounted, setMounted] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    setMounted(true)

    // Load color theme from localStorage
    const savedColorTheme = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme
    if (savedColorTheme && ["mint", "playful"].includes(savedColorTheme)) {
      setColorThemeState(savedColorTheme)
    }

    // Load appearance theme from localStorage if not already set by next-themes
    const savedAppearanceTheme = localStorage.getItem(THEME_PREFERENCE_KEY) as AppearanceTheme
    if (savedAppearanceTheme && ["light", "dark", "system"].includes(savedAppearanceTheme)) {
      // Only set if it's different from current theme to avoid unnecessary updates
      if (savedAppearanceTheme !== theme) {
        setTheme(savedAppearanceTheme)
      }
    }
  }, [theme, setTheme])

  // Apply color theme changes
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

    // Save color theme to localStorage
    localStorage.setItem(COLOR_THEME_KEY, colorTheme)

    // Remove transition class after animation
    const timeoutId = setTimeout(() => {
      root.classList.remove("theme-transition")
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [colorTheme, mounted])

  // Save appearance theme changes
  useEffect(() => {
    if (!mounted || !theme) return
    localStorage.setItem(THEME_PREFERENCE_KEY, theme)
  }, [theme, mounted])

  const setColorTheme = useCallback((newColorTheme: ColorTheme) => {
    setColorThemeState(newColorTheme)
  }, [])

  const toggleColorTheme = useCallback(() => {
    setColorTheme(colorTheme === "mint" ? "playful" : "mint")
  }, [colorTheme, setColorTheme])

  const setAppearanceTheme = useCallback(
    (newTheme: AppearanceTheme) => {
      setTheme(newTheme)
    },
    [setTheme],
  )

  const currentAppearance = theme === "system" ? systemTheme : theme

  // Get theme display names
  const getColorThemeDisplay = useCallback(() => {
    return colorTheme === "mint" ? "Mint & Teal" : "Playful Green"
  }, [colorTheme])

  const getAppearanceDisplay = useCallback(() => {
    switch (currentAppearance) {
      case "light":
        return "Light Mode"
      case "dark":
        return "Dark Mode"
      default:
        return "System"
    }
  }, [currentAppearance])

  // Clear all theme preferences (useful for reset functionality)
  const clearThemePreferences = useCallback(() => {
    localStorage.removeItem(COLOR_THEME_KEY)
    localStorage.removeItem(THEME_PREFERENCE_KEY)
    setColorThemeState("mint")
    setTheme("system")
  }, [setTheme])

  // Get current theme state for debugging or analytics
  const getThemeState = useCallback(() => {
    return {
      colorTheme,
      appearanceTheme: currentAppearance,
      systemTheme,
      isSystemTheme: theme === "system",
    }
  }, [colorTheme, currentAppearance, systemTheme, theme])

  return {
    colorTheme,
    setColorTheme,
    toggleColorTheme,
    appearanceTheme: currentAppearance as AppearanceTheme,
    setAppearanceTheme,
    mounted,
    getColorThemeDisplay,
    getAppearanceDisplay,
    clearThemePreferences,
    getThemeState,
  }
}
