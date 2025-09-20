"use client"

import { Moon, Sun, Monitor, Palette, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative group">
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "System"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative group hover:bg-accent/50 transition-all duration-200 hover:scale-105 cursor-pointer"
          type="button"
        >
          <div className="relative">
            {getThemeIcon()}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-amber-400 to-blue-500 rounded-full animate-pulse" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => setTheme("light")} 
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Light</span>
          </div>
          {theme === "light" && (
            <Badge variant="secondary" className="ml-auto text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("dark")} 
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-blue-400" />
            <span>Dark</span>
          </div>
          {theme === "dark" && (
            <Badge variant="secondary" className="ml-auto text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => setTheme("system")} 
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span>System</span>
          </div>
          {theme === "system" && (
            <Badge variant="secondary" className="ml-auto text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Current: {getThemeLabel()}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
