"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Date picker removed
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RoomStorage, type Room, type Booking } from "@/lib/room-storage"
import { CalendarIcon, Clock, Users, MapPin, Plus, Search, Filter, AlertCircle, CheckCircle2, X } from "lucide-react"
import { format, isAfter, parseISO, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function BookingsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Form state
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [title, setTitle] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [attendees, setAttendees] = useState("")
  // Date selection removed; we will use today's date for booking creation
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadData = () => {
      try {
        const roomData = RoomStorage.getRooms()
        const bookingData = RoomStorage.getBookings()
        setRooms(roomData)
        setBookings(bookingData)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load booking data. Please refresh the page.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [toast])

  useEffect(() => {
    let filtered = bookings

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!selectedRoom) errors.room = "Please select a room"
    if (!title.trim()) errors.title = "Meeting title is required"
    if (!organizer.trim()) errors.organizer = "Organizer name is required"
    if (!startTime) errors.startTime = "Start time is required"
    if (!endTime) errors.endTime = "End time is required"

    if (attendees && Number.parseInt(attendees) < 1) {
      errors.attendees = "Number of attendees must be at least 1"
    }

    if (selectedRoom && attendees) {
      const room = rooms.find((r) => r.id === selectedRoom)
      if (room && Number.parseInt(attendees) > room.capacity) {
        errors.attendees = `Room capacity is ${room.capacity} people`
      }
    }

    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)
      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute

      if (endMinutes <= startMinutes) {
        errors.endTime = "End time must be after start time"
      }

      if (endMinutes - startMinutes < 15) {
        errors.endTime = "Minimum booking duration is 15 minutes"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const checkBookingConflicts = (roomId: string, startDateTime: Date, endDateTime: Date) => {
    return bookings.some((booking) => {
      if (booking.roomId !== roomId || booking.status === "Cancelled") return false

      const bookingStart = parseISO(booking.startTime)
      const bookingEnd = parseISO(booking.endTime)

      return (
        (startDateTime >= bookingStart && startDateTime < bookingEnd) ||
        (endDateTime > bookingStart && endDateTime <= bookingEnd) ||
        (startDateTime <= bookingStart && endDateTime >= bookingEnd)
      )
    })
  }

  const handleCreateBooking = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const startDateTime = new Date()
      const [startHour, startMinute] = startTime.split(":")
      startDateTime.setHours(Number.parseInt(startHour), Number.parseInt(startMinute))

      const endDateTime = new Date()
      const [endHour, endMinute] = endTime.split(":")
      endDateTime.setHours(Number.parseInt(endHour), Number.parseInt(endMinute))

      if (checkBookingConflicts(selectedRoom, startDateTime, endDateTime)) {
        toast({
          title: "Booking Conflict",
          description: "This room is already booked for the selected time slot.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      const newBooking = {
        roomId: selectedRoom,
        title: title.trim(),
        organizer: organizer.trim(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        attendees: Number.parseInt(attendees) || 1,
        status: "Confirmed" as const,
      }

      RoomStorage.addBooking(newBooking)

      // Reset form
      setSelectedRoom("")
      setTitle("")
      setOrganizer("")
      setAttendees("")
      // start date removed
      setStartTime("")
      setEndTime("")
      setDescription("")
      setFormErrors({})
      setIsDialogOpen(false)

      // Refresh data
      const bookingData = RoomStorage.getBookings()
      setBookings(bookingData)

      toast({
        title: "Booking Created",
        description: "Your room booking has been successfully created.",
      })
    } catch (error) {
      console.error("Failed to create booking:", error)
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "Cancelled" as const } : booking,
      )

      localStorage.setItem("roomtrackr_bookings", JSON.stringify(updatedBookings))
      setBookings(updatedBookings)

      toast({
        title: "Booking Cancelled",
        description: "The booking has been successfully cancelled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? `${room.roomNumber} - ${room.location}` : "Unknown Room"
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

  const upcomingBookings = filteredBookings
    .filter((booking) => isAfter(parseISO(booking.startTime), new Date()) && booking.status !== "Cancelled")
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())

  const todayBookings = filteredBookings
    .filter((booking) => {
      const bookingDate = parseISO(booking.startTime)
      const today = new Date()
      return isSameDay(bookingDate, today) && booking.status !== "Cancelled"
    })
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="container mx-auto p-6 flex-1">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Room Bookings</h1>
              <p className="text-muted-foreground">
                Manage and schedule room reservations with smart conflict detection
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Booking</DialogTitle>
                  <DialogDescription>
                    Schedule a new room reservation. All required fields must be completed.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="room">Room *</Label>
                      <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                        <SelectTrigger className={formErrors.room ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                        <SelectContent>
                          {rooms
                            .filter((room) => room.availabilityStatus === "Available")
                            .map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.roomNumber} - {room.location} (Capacity: {room.capacity})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {formErrors.room && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.room}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="attendees">Expected Attendees</Label>
                      <Input
                        id="attendees"
                        type="number"
                        min="1"
                        placeholder="Number of people"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        className={formErrors.attendees ? "border-destructive" : ""}
                      />
                      {formErrors.attendees && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.attendees}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Meeting Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Team Standup"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={formErrors.title ? "border-destructive" : ""}
                      />
                      {formErrors.title && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.title}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organizer">Organizer *</Label>
                      <Input
                        id="organizer"
                        placeholder="Your name"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        className={formErrors.organizer ? "border-destructive" : ""}
                      />
                      {formErrors.organizer && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.organizer}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Date picker removed */}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={formErrors.startTime ? "border-destructive" : ""}
                      />
                      {formErrors.startTime && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.startTime}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={formErrors.endTime ? "border-destructive" : ""}
                      />
                      {formErrors.endTime && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {formErrors.endTime}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Additional details about the meeting..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBooking} disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Booking"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bookings by title or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Today's Bookings */}
          {todayBookings.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Today's Bookings
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {todayBookings.map((booking) => (
                  <Card key={booking.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{booking.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                          {booking.status === "Confirmed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardDescription>{booking.organizer}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {getRoomName(booking.roomId)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {booking.attendees} attendees
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Bookings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings ({upcomingBookings.length})</h2>

            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    {searchTerm || statusFilter !== "all"
                      ? "No bookings found matching your criteria."
                      : "No upcoming bookings scheduled."}
                  </p>
                  <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                    Create First Booking
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{booking.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                          {booking.status === "Confirmed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <CardDescription>{booking.organizer}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {getRoomName(booking.roomId)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {format(parseISO(booking.startTime), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(parseISO(booking.startTime), "HH:mm")} - {format(parseISO(booking.endTime), "HH:mm")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {booking.attendees} attendees
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
