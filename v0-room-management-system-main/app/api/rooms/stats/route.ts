import { NextResponse } from "next/server"
import { RoomStorage } from "@/lib/room-storage"

export async function GET() {
  try {
    const stats = RoomStorage.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch room statistics" }, { status: 500 })
  }
}
