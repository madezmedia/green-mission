"use client"

import { Sun, Moon, Monitor, Palette, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useThemeSwitcher } from "@/hooks/use-theme-switcher"
import { useState } from "react"

export default function ShowcaseThemeSwitcher() {
  const {
    colorTheme,
    setColorTheme,
    appearanceTheme,
    setAppearanceTheme,
    mounted,
    clearThemePreferences,
    getThemeState,
  } = useThemeSwitcher()
  const [isResetting, setIsResetting] = useState(false)

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (appearanceTheme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const handleReset = async () => {
    setIsResetting(true)
    clearThemePreferences()

    // Add a small delay to show the loading state
    setTimeout(() => {
      setIsResetting(false)
    }, 500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative transition-all hover:scale-105">
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Appearance</p>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant={appearanceTheme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => setAppearanceTheme("light")}
              className="flex flex-col gap-1 h-auto py-2 transition-all"
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">Light</span>
            </Button>
            <Button
              variant={appearanceTheme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => setAppearanceTheme("dark")}
              className="flex flex-col gap-1 h-auto py-2 transition-all"
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">Dark</span>
            </Button>
            <Button
              variant={appearanceTheme === "system" ? "default" : "ghost"}
              size="sm"
              onClick={() => setAppearanceTheme("system")}
              className="flex flex-col gap-1 h-auto py-2 transition-all"
            >
              <Monitor className="h-4 w-4" />
              <span className="text-xs">Auto</span>
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Color Palette</p>
          <div className="space-y-1">
            <Button
              variant={colorTheme === "mint" ? "default" : "ghost"}
              size="sm"
              onClick={() => setColorTheme("mint")}
              className="w-full justify-start gap-3 transition-all"
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-teal-400 ring-1 ring-teal-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-300 ring-1 ring-emerald-400/20"></div>
              </div>
              <span>Mint & Teal</span>
            </Button>
            <Button
              variant={colorTheme === "playful" ? "default" : "ghost"}
              size="sm"
              onClick={() => setColorTheme("playful")}
              className="w-full justify-start gap-3 transition-all"
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500 ring-1 ring-green-600/20"></div>
                <div className="w-3 h-3 rounded-full bg-orange-400 ring-1 ring-orange-500/20"></div>
              </div>
              <span>Playful Green</span>
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isResetting}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-all"
          >
            <RotateCcw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Resetting..." : "Reset to Default"}</span>
          </Button>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>Theme:</span>
              <span className="font-medium">{colorTheme === "mint" ? "Mint & Teal" : "Playful Green"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Mode:</span>
              <span className="font-medium capitalize">{appearanceTheme}</span>
            </div>
            <div className="text-[10px] text-muted-foreground/70 mt-2">Preferences saved automatically</div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
