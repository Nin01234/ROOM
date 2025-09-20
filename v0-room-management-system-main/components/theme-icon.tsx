"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Check } from "lucide-react"

export function ThemeIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState("system")

  useEffect(() => {
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") || "system"
    setTheme(savedTheme)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      // System theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    
    setIsOpen(false)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5 text-amber-500" />
      case "dark":
        return <Moon className="h-5 w-5 text-blue-400" />
      default:
        return <Monitor className="h-5 w-5 text-gray-500" />
    }
  }

  const themes = [
    { id: "light", name: "Light", icon: Sun, description: "Light mode" },
    { id: "dark", name: "Dark", icon: Moon, description: "Dark mode" },
    { id: "system", name: "System", icon: Monitor, description: "Use system setting" }
  ]

  return (
    <div className="relative">
      {/* Theme Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        {getThemeIcon()}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Theme Settings
            </h3>
          </div>

          {/* Theme Options */}
          <div className="py-2">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isSelected = theme === themeOption.id
              
              return (
                <button
                  key={themeOption.id}
                  onClick={() => handleThemeChange(themeOption.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <Icon className={`h-4 w-4 ${
                    themeOption.id === 'light' ? 'text-amber-500' :
                    themeOption.id === 'dark' ? 'text-blue-400' :
                    'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {themeOption.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {themeOption.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
