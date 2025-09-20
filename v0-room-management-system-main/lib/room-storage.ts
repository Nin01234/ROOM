export interface Room {
  id: string
  roomNumber: string
  location: string
  floor: number
  capacity: number
  roomType: "Conference" | "Office" | "Meeting" | "Training" | "Storage" | "Other"
  availabilityStatus: "Available" | "Occupied" | "Maintenance" | "Reserved"
  description?: string
  amenities: string[]
  imageUrl?: string
  lastCleaned?: string
  temperature?: number
  occupancyCount?: number
  bookings?: Booking[]
  maintenanceHistory?: MaintenanceRecord[]
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: string
  roomId: string
  title: string
  organizer: string
  startTime: string
  endTime: string
  attendees: number
  status: "Confirmed" | "Pending" | "Cancelled"
  createdAt: string
}

export interface MaintenanceRecord {
  id: string
  roomId: string
  type: "Cleaning" | "Repair" | "Inspection" | "Upgrade"
  description: string
  technician: string
  scheduledDate: string
  completedDate?: string
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  cost?: number
  createdAt: string
}

const STORAGE_KEY = "roomtrackr_rooms"
const BOOKINGS_KEY = "roomtrackr_bookings"
const MAINTENANCE_KEY = "roomtrackr_maintenance"

const sampleRooms: Room[] = [
  {
    id: "1",
    roomNumber: "A101",
    location: "Building A",
    floor: 1,
    capacity: 12,
    roomType: "Conference",
    availabilityStatus: "Available",
    description: "Modern conference room with video conferencing capabilities",
    amenities: ["Projector", "Whiteboard", "Video Conference", "WiFi", "Air Conditioning"],
    imageUrl: "/modern-conference-room-with-large-table-and-projec.jpg",
    lastCleaned: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    temperature: 22,
    occupancyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    roomNumber: "A102",
    location: "Building A",
    floor: 1,
    capacity: 6,
    roomType: "Meeting",
    availabilityStatus: "Occupied",
    description: "Intimate meeting space perfect for small team discussions",
    amenities: ["TV Display", "Whiteboard", "WiFi", "Coffee Machine"],
    imageUrl: "/small-meeting-room-with-round-table-and-tv-screen.jpg",
    lastCleaned: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    temperature: 23,
    occupancyCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    roomNumber: "B201",
    location: "Building B",
    floor: 2,
    capacity: 20,
    roomType: "Training",
    availabilityStatus: "Available",
    description: "Spacious training room with flexible seating arrangements",
    amenities: ["Projector", "Sound System", "Microphone", "WiFi", "Flipchart", "Air Conditioning"],
    imageUrl: "/large-training-room-with-rows-of-desks-and-project.jpg",
    lastCleaned: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    temperature: 21,
    occupancyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    roomNumber: "B202",
    location: "Building B",
    floor: 2,
    capacity: 4,
    roomType: "Office",
    availabilityStatus: "Maintenance",
    description: "Private office space with natural lighting",
    amenities: ["Desk", "Chair", "WiFi", "Phone", "Storage"],
    imageUrl: "/private-office-with-desk-chair-and-window.jpg",
    lastCleaned: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    temperature: 20,
    occupancyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    roomNumber: "C301",
    location: "Building C",
    floor: 3,
    capacity: 8,
    roomType: "Conference",
    availabilityStatus: "Reserved",
    description: "Executive conference room with premium amenities",
    amenities: ["4K Display", "Video Conference", "Premium Audio", "WiFi", "Catering Setup", "Air Conditioning"],
    imageUrl: "/executive-conference-room-with-leather-chairs-and-.jpg",
    lastCleaned: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    temperature: 22,
    occupancyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    roomNumber: "C302",
    location: "Building C",
    floor: 3,
    capacity: 15,
    roomType: "Training",
    availabilityStatus: "Available",
    description: "Interactive training space with modern technology",
    amenities: ["Interactive Whiteboard", "Tablets", "WiFi", "Sound System", "Flexible Seating"],
    imageUrl: "/modern-training-room-with-interactive-whiteboard-a.jpg",
    lastCleaned: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    temperature: 23,
    occupancyCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const sampleBookings: Booking[] = [
  {
    id: "b1",
    roomId: "2",
    title: "Team Standup",
    organizer: "Sarah Johnson",
    startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    attendees: 4,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    roomId: "5",
    title: "Board Meeting",
    organizer: "Michael Chen",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    attendees: 8,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  },
]

const sampleMaintenance: MaintenanceRecord[] = [
  {
    id: "m1",
    roomId: "4",
    type: "Repair",
    description: "Fix air conditioning unit",
    technician: "John Smith",
    scheduledDate: new Date().toISOString(),
    status: "In Progress",
    cost: 250,
    createdAt: new Date().toISOString(),
  },
]

export class RoomStorage {
  static getRooms(): Room[] {
    if (typeof window === "undefined") return sampleRooms

    const stored = localStorage.getItem(STORAGE_KEY)
    let rooms: Room[]

    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRooms))
      rooms = sampleRooms
    } else {
      rooms = JSON.parse(stored)
    }

    // Simulate real-time changes
    return this.simulateRealTimeChanges(rooms)
  }

  private static simulateRealTimeChanges(rooms: Room[]): Room[] {
    const now = Date.now()
    const simulatedRooms = rooms.map((room) => {
      const timeSinceUpdate = now - new Date(room.updatedAt).getTime()

      if (timeSinceUpdate > 2 * 60 * 60 * 1000) {
        // Check every 2 minutes instead of 5
        const random = Math.random()
        let newStatus = room.availabilityStatus
        let newOccupancy = room.occupancyCount || 0
        let newTemperature = room.temperature || 22

        const hour = new Date().getHours()
        const isBusinessHours = hour >= 9 && hour <= 17

        if (isBusinessHours) {
          // Higher chance of occupancy during business hours
          if (room.availabilityStatus === "Available" && random < 0.4) {
            newStatus = "Occupied"
            newOccupancy = Math.floor(Math.random() * (room.capacity * 0.8)) + 1
          } else if (room.availabilityStatus === "Occupied" && random < 0.3) {
            newStatus = "Available"
            newOccupancy = 0
          }
        } else {
          // Lower occupancy outside business hours
          if (room.availabilityStatus === "Occupied" && random < 0.7) {
            newStatus = "Available"
            newOccupancy = 0
          }
        }

        const baseTemp = 22
        const tempVariation = Math.sin(Date.now() / (1000 * 60 * 30)) * 2 // 30-minute cycle
        newTemperature = Math.round(baseTemp + tempVariation + (Math.random() - 0.5))
        newTemperature = Math.max(18, Math.min(26, newTemperature))

        return {
          ...room,
          availabilityStatus: newStatus,
          occupancyCount: newOccupancy,
          temperature: newTemperature,
          updatedAt: new Date().toISOString(),
        }
      }

      return room
    })

    // Save the simulated changes
    this.saveRooms(simulatedRooms)
    return simulatedRooms
  }

  static saveRooms(rooms: Room[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
  }

  static addRoom(room: Omit<Room, "id" | "createdAt" | "updatedAt">): Room {
    const rooms = this.getRooms()
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
      amenities: room.amenities || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    rooms.push(newRoom)
    this.saveRooms(rooms)
    return newRoom
  }

  static updateRoom(id: string, updates: Partial<Omit<Room, "id" | "createdAt">>): Room | null {
    const rooms = this.getRooms()
    const index = rooms.findIndex((room) => room.id === id)
    if (index === -1) return null

    rooms[index] = {
      ...rooms[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.saveRooms(rooms)
    return rooms[index]
  }

  static deleteRoom(id: string): boolean {
    const rooms = this.getRooms()
    const filteredRooms = rooms.filter((room) => room.id !== id)
    if (filteredRooms.length === rooms.length) return false

    this.saveRooms(filteredRooms)
    return true
  }

  static getRoomById(id: string): Room | null {
    const rooms = this.getRooms()
    return rooms.find((room) => room.id === id) || null
  }

  static getStats() {
    const rooms = this.getRooms()
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0)
    const currentOccupancy = rooms.reduce((sum, room) => sum + (room.occupancyCount || 0), 0)

    return {
      total: rooms.length,
      available: rooms.filter((r) => r.availabilityStatus === "Available").length,
      occupied: rooms.filter((r) => r.availabilityStatus === "Occupied").length,
      maintenance: rooms.filter((r) => r.availabilityStatus === "Maintenance").length,
      reserved: rooms.filter((r) => r.availabilityStatus === "Reserved").length,
      totalCapacity,
      currentOccupancy,
      utilizationRate: totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0,
      averageTemperature: Math.round(rooms.reduce((sum, room) => sum + (room.temperature || 22), 0) / rooms.length),
    }
  }

  static getBookings(): Booking[] {
    if (typeof window === "undefined") return sampleBookings

    const stored = localStorage.getItem(BOOKINGS_KEY)
    let bookings: Booking[]

    if (!stored) {
      const enhancedBookings = [
        ...sampleBookings,
        {
          id: "b3",
          roomId: "1",
          title: "Product Review",
          organizer: "Alex Thompson",
          startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          attendees: 6,
          status: "Confirmed" as const,
          createdAt: new Date().toISOString(),
        },
        {
          id: "b4",
          roomId: "3",
          title: "Training Session",
          organizer: "Emma Wilson",
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
          attendees: 15,
          status: "Pending" as const,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(enhancedBookings))
      bookings = enhancedBookings
    } else {
      bookings = JSON.parse(stored)
    }

    return bookings
  }

  static addBooking(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const bookings = this.getBookings()
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    bookings.push(newBooking)
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
    return newBooking
  }

  static getMaintenanceRecords(): MaintenanceRecord[] {
    if (typeof window === "undefined") return sampleMaintenance

    const stored = localStorage.getItem(MAINTENANCE_KEY)
    if (!stored) {
      localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(sampleMaintenance))
      return sampleMaintenance
    }
    return JSON.parse(stored)
  }

  static addMaintenanceRecord(record: Omit<MaintenanceRecord, "id" | "createdAt">): MaintenanceRecord {
    const records = this.getMaintenanceRecords()
    const newRecord: MaintenanceRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    records.push(newRecord)
    localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(records))
    return newRecord
  }
}
