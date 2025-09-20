import { type NextRequest, NextResponse } from "next/server"
import { RoomStorage } from "@/lib/room-storage"

export async function GET() {
  try {
    const rooms = RoomStorage.getRooms()
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["roomNumber", "location", "floor", "capacity", "roomType", "availabilityStatus"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const newRoom = RoomStorage.addRoom(body)
    return NextResponse.json(newRoom, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
