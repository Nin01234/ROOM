"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Wrench, Building, Clock, UserPlus, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "booking" | "maintenance" | "room_update" | "system" | "user_action"
  title: string
  description: string
  timestamp: string
  user?: string
  status?: "success" | "warning" | "info" | "error"
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const generateActivities = (): ActivityItem[] => {
      const now = new Date()
      return [
        {
          id: "1",
          type: "booking",
          title: "New booking created",
          description: "Team Standup scheduled for Conference Room A101",
          timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
          user: "Sarah Johnson",
          status: "success",
        },
        {
          id: "2",
          type: "maintenance",
          title: "Maintenance completed",
          description: "Air conditioning repair finished in Office B202",
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
          user: "John Smith",
          status: "success",
        },
        {
          id: "3",
          type: "room_update",
          title: "Room status changed",
          description: "Meeting Room A102 is now available",
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
          status: "info",
        },
        {
          id: "4",
          type: "booking",
          title: "Booking cancelled",
          description: "Board Meeting in Executive Room C301 was cancelled",
          timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
          user: "Michael Chen",
          status: "warning",
        },
        {
          id: "5",
          type: "system",
          title: "Temperature alert",
          description: "Training Room B201 temperature adjusted to 22°C",
          timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
          status: "info",
        },
        {
          id: "6",
          type: "user_action",
          title: "New room added",
          description: "Conference Room D401 added to Building D",
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          user: "Admin",
          status: "success",
        },
      ]
    }

    setActivities(generateActivities())

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? "booking" : "room_update",
        title: Math.random() > 0.5 ? "Room status updated" : "New booking created",
        description: `Activity at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        status: "info",
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return Calendar
      case "maintenance":
        return Wrench
      case "room_update":
        return Building
      case "system":
        return Settings
      case "user_action":
        return UserPlus
      default:
        return Clock
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-muted ${getStatusColor(activity.status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <Badge variant={getStatusBadge(activity.status)} className="text-xs">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    {activity.user && (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{activity.user}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
