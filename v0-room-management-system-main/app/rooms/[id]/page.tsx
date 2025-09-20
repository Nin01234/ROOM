"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomStorage, type Room, type Booking, type MaintenanceRecord } from "@/lib/room-storage"
import { BookingCalendar } from "@/components/booking-calendar"
import {
  ArrowLeft,
  Users,
  MapPin,
  Building,
  Thermometer,
  Wifi,
  Monitor,
  Coffee,
  Car,
  Calendar,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { format, parseISO, isAfter } from "date-fns"
import Image from "next/image"

const statusColors = {
  Available:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Occupied: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  Maintenance:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  Reserved: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
}

const typeIcons = {
  Conference: "🏢",
  Office: "💼",
  Meeting: "👥",
  Training: "📚",
  Storage: "📦",
  Other: "🏠",
}

const amenityIcons = {
  wifi: Wifi,
  projector: Monitor,
  coffee: Coffee,
  parking: Car,
}

const getRoomImage = (room: Room) => {
  const roomType = room.roomType.toLowerCase()
  const roomNum = Number.parseInt(room.roomNumber.replace(/\D/g, "")) || 1

  switch (roomType) {
    case "conference":
      return roomNum % 2 === 0 ? "/images/conference-room-2.jpg" : "/images/conference-room-1.jpg"
    case "meeting":
      return roomNum % 2 === 0 ? "/images/meeting-room-2.jpg" : "/images/meeting-room-1.jpg"
    case "office":
      return roomNum % 2 === 0 ? "/images/office-space-2.jpg" : "/images/office-space-1.jpg"
    case "training":
      return roomNum % 2 === 0 ? "/images/training-room-2.jpg" : "/images/training-room-1.jpg"
    default:
      return "/images/conference-room-1.jpg"
  }
}

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [room, setRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      const rooms = RoomStorage.getRooms()
      const foundRoom = rooms.find((r) => r.id === roomId)

      if (!foundRoom) {
        router.push("/rooms")
        return
      }

      const roomBookings = RoomStorage.getBookings().filter((b) => b.roomId === roomId)
      const roomMaintenance = RoomStorage.getMaintenanceRecords().filter((m) => m.roomId === roomId)

      setRoom(foundRoom)
      setBookings(roomBookings)
      setMaintenanceRecords(roomMaintenance)
      setIsLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [roomId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!room) {
    return null
  }

  const occupancyPercentage = room.capacity > 0 ? Math.round(((room.occupancyCount || 0) / room.capacity) * 100) : 0

  const getTemperatureColor = (temp?: number) => {
    if (!temp) return "text-muted-foreground"
    if (temp < 20 || temp > 24) return "text-orange-600"
    return "text-green-600"
  }

  const upcomingBookings = bookings
    .filter((booking) => isAfter(parseISO(booking.startTime), new Date()))
    .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
    .slice(0, 5)

  const activeMaintenance = maintenanceRecords.filter(
    (record) => record.status === "Scheduled" || record.status === "In Progress",
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return Clock
      case "In Progress":
        return Wrench
      case "Completed":
        return CheckCircle
      case "Cancelled":
        return AlertTriangle
      default:
        return Clock
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {typeIcons[room.roomType]} {room.roomNumber}
          </h1>
          <p className="text-muted-foreground">
            {room.location} • Floor {room.floor}
          </p>
        </div>
        <Badge className={statusColors[room.availabilityStatus]}>{room.availabilityStatus}</Badge>
      </div>

      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <Image
          src={getRoomImage(room) || "/placeholder.svg"}
          alt={`${room.roomNumber} - ${room.roomType}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{room.roomNumber}</h2>
          <p className="text-white/90">
            {room.roomType} • {room.location}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Room Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Room Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Floor {room.floor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Capacity: {room.capacity}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Room Type</p>
                <p className="text-sm text-muted-foreground">{room.roomType}</p>
                {room.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className={`h-4 w-4 ${getTemperatureColor(room.temperature)}`} />
                    <span className="text-sm">{room.temperature}°C</span>
                    <Badge variant={room.temperature >= 20 && room.temperature <= 24 ? "default" : "secondary"}>
                      {room.temperature >= 20 && room.temperature <= 24 ? "Optimal" : "Adjust"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {room.occupancyCount !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Occupancy</span>
                  <span>
                    {room.occupancyCount}/{room.capacity} ({occupancyPercentage}%)
                  </span>
                </div>
                <Progress value={occupancyPercentage} />
              </div>
            )}

            {room.amenities && room.amenities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Amenities</p>
                <div className="grid grid-cols-2 gap-2">
                  {room.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                    return (
                      <div key={amenity} className="flex items-center gap-2 text-sm">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{bookings.length}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{maintenanceRecords.length}</div>
                <div className="text-sm text-muted-foreground">Maintenance Records</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{activeMaintenance.length}</div>
                <div className="text-sm text-muted-foreground">Active Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No upcoming bookings</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{booking.title}</h4>
                        <p className="text-sm text-muted-foreground">Organized by {booking.organizer}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(parseISO(booking.startTime), "MMM dd, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(parseISO(booking.startTime), "HH:mm")} -{" "}
                            {format(parseISO(booking.endTime), "HH:mm")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.attendees}
                          </div>
                        </div>
                      </div>
                      <Badge variant={booking.status === "Confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <BookingCalendar selectedRoom={roomId} />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              {maintenanceRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No maintenance records</p>
              ) : (
                <div className="space-y-4">
                  {maintenanceRecords.map((record) => {
                    const StatusIcon = getStatusIcon(record.status)
                    return (
                      <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <StatusIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{record.type}</h4>
                            <Badge variant={record.status === "Completed" ? "outline" : "default"}>
                              {record.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span>Technician: {record.technician}</span>
                            <span>Scheduled: {format(parseISO(record.scheduledDate), "MMM dd, yyyy")}</span>
                            {record.cost && <span>Cost: ${record.cost.toFixed(2)}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
