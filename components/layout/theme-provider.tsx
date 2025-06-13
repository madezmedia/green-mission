"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export type GMCTheme = 'gmc-forest' | 'gmc-ocean' | 'gmc-earth' | 'gmc-sunset'
export type GMCMode = 'light' | 'dark'
export type GMCThemeMode = `${GMCTheme}-${GMCMode}` | 'system'

export const GMC_THEMES: GMCTheme[] = ['gmc-forest', 'gmc-ocean', 'gmc-earth', 'gmc-sunset']

export const GMC_THEME_LABELS: Record<GMCTheme, string> = {
  'gmc-forest': 'Forest Green',
  'gmc-ocean': 'Ocean Blue', 
  'gmc-earth': 'Earth Tone',
  'gmc-sunset': 'Sunset Orange'
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="gmc-forest-light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="gmc-theme"
      themes={[
        'gmc-forest-light', 'gmc-forest-dark',
        'gmc-ocean-light', 'gmc-ocean-dark',
        'gmc-earth-light', 'gmc-earth-dark',
        'gmc-sunset-light', 'gmc-sunset-dark'
      ]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
