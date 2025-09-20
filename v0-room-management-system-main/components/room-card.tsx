"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  MapPin,
  Building,
  Thermometer,
  Wifi,
  Monitor,
  Coffee,
  Car,
  Eye,
} from "lucide-react"
import type { Room } from "@/lib/room-storage"
import { useState } from "react"
import Image from "next/image"

interface RoomCardProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (id: string) => void
}

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

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const occupancyPercentage = room.capacity > 0 ? Math.round(((room.occupancyCount || 0) / room.capacity) * 100) : 0

  const getTemperatureColor = (temp?: number) => {
    if (!temp) return "text-muted-foreground"
    if (temp < 20 || temp > 24) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] overflow-hidden">
        <div className="relative h-32 sm:h-40 md:h-48 w-full">
          <Image
            src={getRoomImage(room) || "/placeholder.svg"}
            alt={`${room.roomNumber} - ${room.roomType}`}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-white/90 hover:bg-white">
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(room)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(room.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute top-2 left-2">
            <Badge className={`text-xs ${statusColors[room.availabilityStatus]}`}>{room.availabilityStatus}</Badge>
          </div>
        </div>

        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
            <span className="truncate mr-2">
              <span className="hidden sm:inline">{typeIcons[room.roomType]} </span>
              {room.roomNumber}
            </span>
            {room.temperature && (
              <div
                className={`flex items-center gap-1 text-xs sm:text-sm ${getTemperatureColor(room.temperature)} flex-shrink-0`}
              >
                <Thermometer className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{room.temperature}°C</span>
                <span className="sm:hidden">{room.temperature}°</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{room.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Floor {room.floor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{room.capacity}</span>
                </div>
              </div>
            </div>

            {room.occupancyCount !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Occupancy</span>
                  <span>
                    {room.occupancyCount}/{room.capacity}
                  </span>
                </div>
                <Progress value={occupancyPercentage} className="h-1.5 sm:h-2" />
              </div>
            )}

            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {room.amenities.slice(0, 2).map((amenity) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                  return Icon ? (
                    <div
                      key={amenity}
                      className="flex items-center gap-1 text-xs bg-muted px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                    >
                      <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="capitalize hidden sm:inline">{amenity}</span>
                    </div>
                  ) : null
                })}
                {room.amenities.length > 2 && (
                  <div className="text-xs bg-muted px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                    +{room.amenities.length - 2}
                  </div>
                )}
              </div>
            )}

            <div className="pt-1 sm:pt-2 border-t">
              <p className="text-xs text-muted-foreground truncate">{room.roomType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              {typeIcons[room.roomType]} {room.roomNumber}
              <Badge className={`text-xs ${statusColors[room.availabilityStatus]}`}>{room.availabilityStatus}</Badge>
            </DialogTitle>
            <DialogDescription className="text-sm">Detailed information about this room</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6">
            {/* Room Image */}
            <div className="relative h-48 sm:h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={getRoomImage(room) || "/placeholder.svg"}
                alt={`${room.roomNumber} - ${room.roomType}`}
                fill
                className="object-cover"
              />
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">Location</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  {room.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Floor {room.floor}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">Capacity</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {room.capacity} people
                </div>
                <p className="text-xs text-muted-foreground">Room Type: {room.roomType}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">Current Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.occupancyCount !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Occupancy</span>
                      <span>
                        {room.occupancyCount}/{room.capacity} ({occupancyPercentage}%)
                      </span>
                    </div>
                    <Progress value={occupancyPercentage} />
                  </div>
                )}

                {room.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className={`h-4 w-4 ${getTemperatureColor(room.temperature)}`} />
                    <span className="text-sm">Temperature: {room.temperature}°C</span>
                    <Badge variant={room.temperature >= 20 && room.temperature <= 24 ? "default" : "secondary"}>
                      {room.temperature >= 20 && room.temperature <= 24 ? "Optimal" : "Adjust"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm sm:text-base">Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">Additional Information</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Room ID: {room.id}</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
                {room.availabilityStatus === "Maintenance" && (
                  <p className="text-yellow-600">⚠️ This room is currently under maintenance</p>
                )}
                {room.availabilityStatus === "Occupied" && (
                  <p className="text-red-600">🔴 This room is currently occupied</p>
                )}
                {room.availabilityStatus === "Reserved" && <p className="text-blue-600">📅 This room is reserved</p>}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
