"use client"

import { Sun, Moon, Palette } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { GMC_THEMES, GMC_THEME_LABELS, type GMCTheme, type GMCMode } from './layout/theme-provider'

export function BasicThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button 
          type="button" 
          className="p-2 bg-gray-200 rounded-lg" 
          disabled
          title="Loading theme switcher..."
        >
          <Sun className="h-4 w-4" />
        </button>
        <button 
          type="button" 
          className="p-2 bg-gray-200 rounded-lg" 
          disabled
          title="Loading palette selector..."
        >
          <Palette className="h-4 w-4" />
        </button>
      </div>
    )
  }

  // Parse current theme
  const currentTheme = theme || 'gmc-forest-light'
  const currentMode = currentTheme.includes('light') ? 'light' : 'dark'
  const currentPalette = currentTheme.includes('ocean') ? 'ocean' : 
                        currentTheme.includes('earth') ? 'earth' :
                        currentTheme.includes('sunset') ? 'sunset' : 'forest'

  const toggleMode = () => {
    const newMode: GMCMode = currentMode === 'light' ? 'dark' : 'light'
    const newTheme = `gmc-${currentPalette}-${newMode}`
    setTheme(newTheme)
  }

  const setPalette = (palette: GMCTheme) => {
    const paletteKey = palette.replace('gmc-', '') as Exclude<GMCTheme, 'gmc-'>
    const newTheme = `gmc-${paletteKey}-${currentMode}`
    setTheme(newTheme)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Light/Dark Toggle */}
      <button
        type="button"
        onClick={toggleMode}
        className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-80 transition-opacity"
        title={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
      >
        {currentMode === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Palette Selector */}
      <div className="flex items-center gap-1">
        <Palette className="h-4 w-4 text-foreground" />
        <select
          value={`gmc-${currentPalette}`}
          onChange={(e) => setPalette(e.target.value as GMCTheme)}
          className="bg-background border border-border rounded px-2 py-1 text-sm text-foreground"
          title="Select color palette"
        >
          {GMC_THEMES.map((themeKey) => (
            <option key={themeKey} value={themeKey}>
              {GMC_THEME_LABELS[themeKey]}
            </option>
          ))}
        </select>
      </div>

      {/* Current Theme Display */}
      <div className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
        {currentTheme}
      </div>
    </div>
  )
}