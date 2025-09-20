"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoomStorage, type Booking, type Room } from "@/lib/room-storage"
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  parseISO,
  isToday,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Clock, Users, CalendarIcon, Grid3X3, List, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingCalendarProps {
  selectedRoom?: string
}

type ViewMode = "week" | "month" | "day"

export function BookingCalendar({ selectedRoom }: BookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const loadData = () => {
      const bookingData = RoomStorage.getBookings()
      const roomData = RoomStorage.getRooms()
      setBookings(bookingData)
      setRooms(roomData)
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredBookings = selectedRoom ? bookings.filter((booking) => booking.roomId === selectedRoom) : bookings

  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? room.roomNumber : "Unknown"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "default"
      case "Pending":
        return "secondary"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (viewMode === "week") {
      setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    } else if (viewMode === "month") {
      setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    } else {
      setCurrentDate(direction === "next" ? addDays(currentDate, 1) : addDays(currentDate, -1))
    }
  }

  const getDateRange = () => {
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    } else if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      return eachDayOfInterval({ start: monthStart, end: monthEnd })
    } else {
      return [currentDate]
    }
  }

  const getBookingsForDay = (date: Date) => {
    return filteredBookings
      .filter((booking) => isSameDay(parseISO(booking.startTime), date))
      .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
  }

  const formatDateHeader = () => {
    if (viewMode === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(weekStart, "MMM dd")} - ${format(addDays(weekStart, 6), "MMM dd, yyyy")}`
    } else if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy")
    } else {
      return format(currentDate, "EEEE, MMMM dd, yyyy")
    }
  }

  const dateRange = getDateRange()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar View
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[200px] text-center">
                  <span className="text-sm font-medium">{formatDateHeader()}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Day
                    </div>
                  </SelectItem>
                  <SelectItem value="week">
                    <div className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      Week
                    </div>
                  </SelectItem>
                  <SelectItem value="month">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="h-4 w-4" />
                      Month
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "month" ? (
            <div className="grid grid-cols-7 gap-1">
              {/* Month header */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
                  {day}
                </div>
              ))}

              {/* Month days */}
              {dateRange.map((day, index) => {
                const dayBookings = getBookingsForDay(day)
                const isCurrentDay = isToday(day)
                const isCurrentMonth = isSameMonth(day, currentDate)

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[100px] p-1 border border-border/50 rounded-sm transition-colors hover:bg-muted/50",
                      isCurrentDay && "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
                      !isCurrentMonth && "opacity-40",
                    )}
                  >
                    <div className={cn("text-sm font-medium mb-1", isCurrentDay && "text-blue-600 dark:text-blue-400")}>
                      <div
                        className={cn(
                          "w-6 h-6 flex items-center justify-center rounded-full",
                          isCurrentDay && "bg-blue-600 text-white",
                        )}
                      >
                        {format(day, "d")}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className="p-1 bg-background border rounded text-xs cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="font-medium truncate" title={booking.title}>
                            {booking.title}
                          </div>
                          <div className="text-muted-foreground">{format(parseISO(booking.startTime), "HH:mm")}</div>
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">+{dayBookings.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={cn("grid gap-4", viewMode === "week" ? "grid-cols-1 md:grid-cols-7" : "grid-cols-1")}>
              {dateRange.map((day) => {
                const dayBookings = getBookingsForDay(day)
                const isCurrentDay = isToday(day)

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[300px] p-4 border rounded-lg transition-all duration-200 hover:shadow-md",
                      isCurrentDay &&
                        "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-sm",
                      viewMode === "day" && "min-h-[500px]",
                    )}
                  >
                    <div
                      className={cn(
                        "text-center mb-4 pb-2 border-b",
                        isCurrentDay && "border-blue-200 dark:border-blue-800",
                      )}
                    >
                      <div className="text-sm font-medium text-muted-foreground">{format(day, "EEE")}</div>
                      <div
                        className={cn("text-2xl font-bold mt-1", isCurrentDay && "text-blue-600 dark:text-blue-400")}
                      >
                        {format(day, "dd")}
                      </div>
                      {viewMode === "day" && (
                        <div className="text-sm text-muted-foreground mt-1">{format(day, "MMMM yyyy")}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {dayBookings.length === 0 ? (
                        <div className="text-center py-8">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No bookings</p>
                        </div>
                      ) : (
                        dayBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="p-3 bg-background border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium text-sm group-hover:text-primary transition-colors">
                                {booking.title}
                              </div>
                              <Badge variant={getStatusColor(booking.status)} className="text-xs">
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {format(parseISO(booking.startTime), "HH:mm")} -{" "}
                                {format(parseISO(booking.endTime), "HH:mm")}
                              </div>
                              {!selectedRoom && (
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-primary/20" />
                                  {getRoomName(booking.roomId)}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                {booking.attendees} attendees
                              </div>
                              <div className="text-muted-foreground/80">by {booking.organizer}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedBooking.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)} className="h-8 w-8 p-0">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(parseISO(selectedBooking.startTime), "MMM dd, yyyy 'at' HH:mm")} -{" "}
                    {format(parseISO(selectedBooking.endTime), "HH:mm")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-primary/20" />
                  <span>{getRoomName(selectedBooking.roomId)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedBooking.attendees} attendees</span>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Organized by</p>
                  <p className="font-medium">{selectedBooking.organizer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
