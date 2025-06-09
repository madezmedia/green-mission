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

  // Load saved preferences on mount only
  useEffect(() => {
    setMounted(true)

    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      try {
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
      } catch (error) {
        console.warn("Failed to load theme preferences:", error)
      }
    }
  }, []) // Remove dependencies to prevent infinite loop


  // Apply color theme changes
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    try {
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
    } catch (error) {
      console.warn("Failed to apply theme changes:", error)
    }
  }, [colorTheme, mounted])

  // Save appearance theme changes
  useEffect(() => {
    if (!mounted || !theme || typeof window === "undefined") return
    try {
      localStorage.setItem(THEME_PREFERENCE_KEY, theme)
    } catch (error) {
      console.warn("Failed to save theme preference:", error)
    }
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
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(COLOR_THEME_KEY)
        localStorage.removeItem(THEME_PREFERENCE_KEY)
        setColorThemeState("mint")
        setTheme("system")
      } catch (error) {
        console.warn("Failed to clear theme preferences:", error)
      }
    }
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
