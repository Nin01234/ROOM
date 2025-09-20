"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Activity, Shield, Crown, ChevronDown } from "lucide-react"
import Link from "next/link"

export function ProfileIcon() {
  const [isOpen, setIsOpen] = useState(false)

  const user = {
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Senior Manager",
    avatar: "/professional-headshot.png",
    status: "online"
  }

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      description: "Manage your account",
      href: "/profile",
      color: "text-blue-500"
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Preferences & privacy",
      href: "/settings",
      color: "text-purple-500"
    },
    {
      icon: Activity,
      label: "Activity",
      description: "View your activity",
      href: "/activity",
      color: "text-green-500"
    }
  ]

  return (
    <div className="relative">
      {/* Profile Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <div className="relative">
          <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium">{user.name}</div>
          <div className="text-xs text-gray-500">{user.role}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Crown className="h-3 w-3 text-amber-500" />
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">47</div>
                <div className="text-xs text-gray-500">Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">23</div>
                <div className="text-xs text-gray-500">Rooms</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">12</div>
                <div className="text-xs text-gray-500">Reports</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span>Last active: 2 min ago</span>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
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
