import { type NextRequest, NextResponse } from "next/server"
import { RoomStorage } from "@/lib/room-storage"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const room = RoomStorage.getRoomById(params.id)
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }
    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedRoom = RoomStorage.updateRoom(params.id, body)

    if (!updatedRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(updatedRoom)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = RoomStorage.deleteRoom(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Room deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
  }
}
