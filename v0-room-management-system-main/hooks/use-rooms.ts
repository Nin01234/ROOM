"use client"

import useSWR from "swr"
import type { Room } from "@/lib/room-storage"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useRooms() {
  const { data, error, mutate } = useSWR<Room[]>("/api/rooms", fetcher)

  const addRoom = async (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roomData),
    })

    if (!response.ok) {
      throw new Error("Failed to create room")
    }

    mutate() // Revalidate the data
    return response.json()
  }

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    const response = await fetch(`/api/rooms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update room")
    }

    mutate() // Revalidate the data
    return response.json()
  }

  const deleteRoom = async (id: string) => {
    const response = await fetch(`/api/rooms/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete room")
    }

    mutate() // Revalidate the data
    return response.json()
  }

  return {
    rooms: data || [],
    isLoading: !error && !data,
    isError: error,
    addRoom,
    updateRoom,
    deleteRoom,
    mutate,
  }
}

export function useRoomStats() {
  const { data, error } = useSWR("/api/rooms/stats", fetcher)

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
  }
}
