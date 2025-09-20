"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Building2, Github, BarChart3, Home, Calendar, Wrench, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotificationIcon } from "@/components/notification-icon"
import { ThemeIcon } from "@/components/theme-icon"
import { ProfileIcon } from "@/components/profile-icon"

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/maintenance", label: "Maintenance", icon: Wrench },
  ]

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">RoomTrackr</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button key={item.href} variant={pathname === item.href ? "secondary" : "ghost"} size="sm" asChild>
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationIcon />

            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span className="hidden lg:inline">GitHub</span>
              </a>
            </Button>

            <ThemeIcon />
            <ProfileIcon />

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-semibold">RoomTrackr</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </div>

                  <div className="flex-1 py-6">
                    <div className="space-y-2">
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>

                    <div className="mt-8 pt-6 border-t">
                      <div className="space-y-2">
                        <Link
                          href="/profile"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <div className="h-3 w-3 bg-blue-500 rounded-full" />
                          </div>
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <div className="h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                            <div className="h-3 w-3 bg-purple-500 rounded-full" />
                          </div>
                          Settings
                        </Link>
                        <a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        JD
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">John Doe</p>
                        <p className="text-xs text-muted-foreground truncate">john.doe@company.com</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 mt-2"
                      onClick={closeMobileMenu}
                    >
                      <div className="mr-2 h-4 w-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <div className="h-2 w-2 bg-red-500 rounded-full" />
                      </div>
                      Log out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
