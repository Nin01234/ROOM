"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowRight, Building, Calendar, TrendingUp, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useRooms } from "@/hooks/use-rooms"
import { RoomCard } from "@/components/room-card"
import { StatsCards } from "@/components/stats-cards"
import { ActivityFeed } from "@/components/activity-feed"
import { QuickActions } from "@/components/quick-actions"
import { RoomFormDialog } from "@/components/room-form-dialog"
import { RoomFilters, type FilterState } from "@/components/room-filters"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Room } from "@/lib/room-storage"

const heroImages = [
  {
    url: "/images/conference-room-1.jpg",
    title: "Modern Conference Rooms",
    description: "State-of-the-art meeting spaces with advanced technology",
  },
  {
    url: "/images/training-room-1.jpg",
    title: "Interactive Training Spaces",
    description: "Flexible learning environments for team development",
  },
  {
    url: "/images/office-space-1.jpg",
    title: "Private Office Suites",
    description: "Quiet workspaces for focused productivity",
  },
  {
    url: "/images/meeting-room-1.jpg",
    title: "Collaborative Meeting Rooms",
    description: "Perfect spaces for team collaboration and brainstorming",
  },
]

export default function Dashboard() {
  const { rooms, isLoading, deleteRoom } = useRooms()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [filters, setFilters] = useState<FilterState>({
    roomType: "",
    availabilityStatus: "",
    location: "",
    floor: "",
    minCapacity: "",
    maxCapacity: "",
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !filters.roomType || room.roomType === filters.roomType
    const matchesStatus = !filters.availabilityStatus || room.availabilityStatus === filters.availabilityStatus
    const matchesLocation = !filters.location || room.location === filters.location
    const matchesFloor = !filters.floor || room.floor.toString() === filters.floor
    const matchesMinCapacity = !filters.minCapacity || room.capacity >= Number.parseInt(filters.minCapacity)
    const matchesMaxCapacity = !filters.maxCapacity || room.capacity <= Number.parseInt(filters.maxCapacity)

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesLocation &&
      matchesFloor &&
      matchesMinCapacity &&
      matchesMaxCapacity
    )
  })

  const handleEdit = (room: Room) => {
    setSelectedRoom(room)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(id)
      } catch (error) {
        alert("Failed to delete room")
      }
    }
  }

  const handleCloseEdit = () => {
    setSelectedRoom(null)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />

          <div className="relative h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl">
                <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">Next-Generation Facility Management</Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                  Smart Room Management
                  <span className="text-blue-400"> Made Simple</span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 text-pretty leading-relaxed">
                  {heroImages[currentSlide].description}. Experience intelligent space management with real-time
                  analytics, automated booking, and seamless facility operations.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/bookings">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Book a Room
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                    >
                      View Analytics
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{rooms.length}</div>
                    <div className="text-sm text-gray-300">Total Rooms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {rooms.filter((r) => r.availabilityStatus === "Available").length}
                    </div>
                    <div className="text-sm text-gray-300">Available Now</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-gray-300">Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-gray-300">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose RoomTrackr?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Advanced features designed to streamline your facility management and enhance productivity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Booking</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent scheduling with conflict detection and automated confirmations
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Real-time Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Live occupancy tracking and utilization insights for better decision making
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Multi-Building Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage multiple locations and buildings from a single dashboard
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Intuitive interface with advanced features for seamless operations
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Room Management Dashboard</h1>
              <p className="text-muted-foreground">Manage your facility rooms efficiently with real-time insights</p>
            </div>
            <RoomFormDialog />
          </div>

          {/* Enhanced Stats Cards */}
          <StatsCards />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search rooms by number, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <RoomFilters filters={filters} onFiltersChange={setFilters} rooms={rooms} />

          {/* Room Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Rooms ({filteredRooms.length})</h2>

            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || Object.values(filters).some((f) => f)
                    ? "No rooms found matching your criteria."
                    : "No rooms available."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {selectedRoom && <RoomFormDialog room={selectedRoom} onClose={handleCloseEdit} />}
        </div>
      </main>

      <Footer />
    </div>
  )
}
