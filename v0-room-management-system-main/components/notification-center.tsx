"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Bell, Calendar, AlertTriangle, CheckCircle2, Clock, X, Settings, Filter, MoreVertical, Zap, Star, MessageSquare, Shield, Wifi, Battery, Volume2 } from "lucide-react"
import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { RoomStorage } from "@/lib/room-storage"

interface Notification {
  id: string
  type: "booking" | "maintenance" | "system" | "reminder"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [vibrateEnabled, setVibrateEnabled] = useState(false)

  useEffect(() => {
    const generateNotifications = () => {
      const bookings = RoomStorage.getBookings()
      const rooms = RoomStorage.getRooms()
      const maintenance = RoomStorage.getMaintenanceRecords()

      const newNotifications: Notification[] = []

      bookings.forEach((booking) => {
        const startTime = parseISO(booking.startTime)
        const now = new Date()
        const timeDiff = startTime.getTime() - now.getTime()
        const minutesUntil = Math.floor(timeDiff / (1000 * 60))

        if (minutesUntil > 0 && minutesUntil <= 30 && booking.status === "Confirmed") {
          newNotifications.push({
            id: `reminder-${booking.id}`,
            type: "reminder",
            title: "Upcoming Meeting",
            message: `"${booking.title}" starts in ${minutesUntil} minutes in room ${rooms.find((r) => r.id === booking.roomId)?.roomNumber}`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: minutesUntil <= 15 ? "high" : "medium",
            actionUrl: "/bookings",
          })
        }

        if (isToday(startTime) && booking.status === "Pending") {
          newNotifications.push({
            id: `pending-${booking.id}`,
            type: "booking",
            title: "Booking Confirmation Needed",
            message: `"${booking.title}" is still pending confirmation for today`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: "medium",
            actionUrl: "/bookings",
          })
        }
      })

      maintenance.forEach((record) => {
        if (record.status === "Scheduled" && isToday(parseISO(record.scheduledDate))) {
          newNotifications.push({
            id: `maintenance-${record.id}`,
            type: "maintenance",
            title: "Scheduled Maintenance Today",
            message: `${record.type} scheduled for room ${rooms.find((r) => r.id === record.roomId)?.roomNumber} - ${record.description}`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: "high",
            actionUrl: "/maintenance",
          })
        }
      })

      const occupiedRooms = rooms.filter((r) => r.availabilityStatus === "Occupied")
      if (occupiedRooms.length > rooms.length * 0.8) {
        newNotifications.push({
          id: "high-occupancy",
          type: "system",
          title: "High Room Occupancy",
          message: `${occupiedRooms.length} of ${rooms.length} rooms are currently occupied`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: "medium",
          actionUrl: "/",
        })
      }

      const randomNotifications = [
        {
          id: "temp-alert",
          type: "system" as const,
          title: "🌡️ Temperature Alert",
          message: "Room A101 temperature is above optimal range (26°C)",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          priority: "low" as const,
        },
        {
          id: "booking-created",
          type: "booking" as const,
          title: "📅 New Booking Created",
          message: "Team meeting scheduled for tomorrow in Conference Room B201",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          priority: "low" as const,
        },
        {
          id: "maintenance-complete",
          type: "maintenance" as const,
          title: "🔧 Maintenance Completed",
          message: "Air conditioning repair in room B202 has been completed",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: "low" as const,
        },
        {
          id: "security-alert",
          type: "system" as const,
          title: "🔒 Security Update",
          message: "New security patch available for room access system",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          read: false,
          priority: "high" as const,
        },
        {
          id: "energy-savings",
          type: "system" as const,
          title: "⚡ Energy Savings",
          message: "Room occupancy sensors helped save 15% energy this week",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: "low" as const,
        },
      ]

      if (Math.random() > 0.3) {
        newNotifications.push(...randomNotifications.slice(0, Math.floor(Math.random() * 3) + 1))
      }

      setNotifications(
        newNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      )
    }

    generateNotifications()
    const interval = setInterval(generateNotifications, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read
      case "high":
        return notification.priority === "high"
      default:
        return true
    }
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-4 w-4 ${priority === "high" ? "animate-pulse" : ""}`
    switch (type) {
      case "booking":
        return <Calendar className={iconClass} />
      case "maintenance":
        return <AlertTriangle className={iconClass} />
      case "reminder":
        return <Clock className={iconClass} />
      case "system":
        return <Shield className={iconClass} />
      default:
        return <CheckCircle2 className={iconClass} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = parseISO(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isTomorrow(date)) {
      return "Tomorrow"
    } else {
      return format(date, "MMM dd")
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative group hover:bg-accent/50 transition-all duration-200 cursor-pointer"
          type="button"
        >
          <div className="relative">
            <Bell className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-bounce shadow-lg"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
            {highPriorityCount > 0 && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 z-50" align="end">
        <Card className="border-0 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setFilter("all")} className={filter === "all" ? "bg-accent" : ""}>
                  All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setFilter("unread")} className={filter === "unread" ? "bg-accent" : ""}>
                  Unread
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setFilter("high")} className={filter === "high" ? "bg-accent" : ""}>
                  High
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {filter === "unread" ? "All caught up!" : "You're all set!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group p-4 border-b hover:bg-accent/50 transition-all duration-200 cursor-pointer ${
                        !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-l-blue-500" : ""
                      } ${notification.priority === "high" ? "ring-1 ring-red-200 dark:ring-red-800" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium leading-tight">{notification.title}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            {!notification.read && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                <span className="text-xs text-blue-600 font-medium">New</span>
                              </div>
                            )}
                            {notification.priority === "high" && (
                              <Badge variant="destructive" className="text-xs px-2 py-0">
                                <Zap className="h-3 w-3 mr-1" />
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          
          <div className="border-t p-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  <Switch
                    checked={vibrateEnabled}
                    onCheckedChange={setVibrateEnabled}
                    size="sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={clearAllNotifications}>
                  Clear all
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
