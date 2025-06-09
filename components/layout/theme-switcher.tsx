"use client"

import { Palette, Sun, Moon, Monitor, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useThemeSwitcher } from "@/hooks/use-theme-switcher"
import { useState } from "react"

export default function ThemeSwitcher() {
  const { colorTheme, setColorTheme, appearanceTheme, setAppearanceTheme, mounted, clearThemePreferences } =
    useThemeSwitcher()
  const [isResetting, setIsResetting] = useState(false)

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  const handleReset = async () => {
    setIsResetting(true)
    clearThemePreferences()

    setTimeout(() => {
      setIsResetting(false)
    }, 500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Theme Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Color Palette</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setColorTheme("mint")}>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-teal-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                  </div>
                  <span>Mint & Teal</span>
                </div>
                {colorTheme === "mint" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColorTheme("playful")}>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  </div>
                  <span>Playful Green</span>
                </div>
                {colorTheme === "playful" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 h-4 w-4" />
            <span>Appearance</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setAppearanceTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span className="flex-1">Light</span>
                {appearanceTheme === "light" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAppearanceTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span className="flex-1">Dark</span>
                {appearanceTheme === "dark" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAppearanceTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                <span className="flex-1">System</span>
                {appearanceTheme === "system" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleReset} disabled={isResetting}>
          <RotateCcw className={`mr-2 h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
          <span>{isResetting ? "Resetting..." : "Reset to Default"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Theme:</span>
              <span className="font-medium">{colorTheme === "mint" ? "Mint & Teal" : "Playful Green"}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="font-medium capitalize">{appearanceTheme}</span>
            </div>
            <div className="text-[10px] text-muted-foreground/70 mt-2">✓ Preferences saved automatically</div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
