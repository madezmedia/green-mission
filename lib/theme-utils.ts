// Utility functions for theme management

export const THEME_STORAGE_KEYS = {
  COLOR_THEME: "green-mission-color-theme",
  APPEARANCE_THEME: "green-mission-theme-preference",
  NEXT_THEMES: "green-mission-theme", // Used by next-themes
} as const

export type ColorTheme = "mint" | "playful"
export type AppearanceTheme = "light" | "dark" | "system"

export interface ThemeState {
  colorTheme: ColorTheme
  appearanceTheme: AppearanceTheme
  systemTheme?: AppearanceTheme
  isSystemTheme: boolean
}

// Get saved theme preferences from localStorage
export function getSavedThemePreferences(): Partial<ThemeState> {
  if (typeof window === "undefined") return {}

  try {
    const colorTheme = localStorage.getItem(THEME_STORAGE_KEYS.COLOR_THEME) as ColorTheme
    const appearanceTheme = localStorage.getItem(THEME_STORAGE_KEYS.APPEARANCE_THEME) as AppearanceTheme

    return {
      colorTheme: ["mint", "playful"].includes(colorTheme) ? colorTheme : "mint",
      appearanceTheme: ["light", "dark", "system"].includes(appearanceTheme) ? appearanceTheme : "system",
    }
  } catch (error) {
    console.warn("Failed to load theme preferences:", error)
    return {}
  }
}

// Save theme preferences to localStorage
export function saveThemePreferences(preferences: Partial<ThemeState>): void {
  if (typeof window === "undefined") return

  try {
    if (preferences.colorTheme) {
      localStorage.setItem(THEME_STORAGE_KEYS.COLOR_THEME, preferences.colorTheme)
    }
    if (preferences.appearanceTheme) {
      localStorage.setItem(THEME_STORAGE_KEYS.APPEARANCE_THEME, preferences.appearanceTheme)
    }
  } catch (error) {
    console.warn("Failed to save theme preferences:", error)
  }
}

// Clear all theme preferences
export function clearThemePreferences(): void {
  if (typeof window === "undefined") return

  try {
    Object.values(THEME_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn("Failed to clear theme preferences:", error)
  }
}

// Check if theme preferences are available
export function hasThemePreferences(): boolean {
  if (typeof window === "undefined") return false

  try {
    return Boolean(
      localStorage.getItem(THEME_STORAGE_KEYS.COLOR_THEME) || localStorage.getItem(THEME_STORAGE_KEYS.APPEARANCE_THEME),
    )
  } catch (error) {
    return false
  }
}

// Get theme display names
export function getThemeDisplayName(theme: ColorTheme | AppearanceTheme): string {
  const displayNames: Record<string, string> = {
    mint: "Mint & Teal",
    playful: "Playful Green",
    light: "Light Mode",
    dark: "Dark Mode",
    system: "System",
  }

  return displayNames[theme] || theme
}
