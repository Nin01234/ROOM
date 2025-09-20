"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Calendar, Wrench, BarChart3, Settings, Download, RefreshCw, Bell } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh action
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "All room data has been updated successfully.",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your room data export will be ready shortly.",
    })
  }

  const quickActions = [
    {
      title: "Add New Room",
      description: "Register a new room in the system",
      icon: Plus,
      href: "/",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Book a Room",
      description: "Schedule a new room reservation",
      icon: Calendar,
      href: "/bookings",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Schedule Maintenance",
      description: "Plan maintenance for rooms",
      icon: Wrench,
      href: "/maintenance",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "View Analytics",
      description: "Check utilization reports",
      icon: BarChart3,
      href: "/analytics",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow bg-transparent"
              >
                <div className={`p-2 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        {/* Secondary Actions */}
        <div className="border-t pt-4 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full justify-start"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>

          <Button variant="ghost" size="sm" onClick={handleExport} className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>

          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Bell className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
