"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRooms } from "@/hooks/use-rooms"
import type { Room } from "@/lib/room-storage"
import { Plus, Save } from "lucide-react"

interface RoomFormDialogProps {
  room?: Room | null
  trigger?: React.ReactNode
  onClose?: () => void
}

export function RoomFormDialog({ room, trigger, onClose }: RoomFormDialogProps) {
  const { addRoom, updateRoom } = useRooms()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    roomNumber: "",
    location: "",
    floor: 1,
    capacity: 1,
    roomType: "Meeting" as Room["roomType"],
    availabilityStatus: "Available" as Room["availabilityStatus"],
  })

  // Reset form when room changes or dialog opens
  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        location: room.location,
        floor: room.floor,
        capacity: room.capacity,
        roomType: room.roomType,
        availabilityStatus: room.availabilityStatus,
      })
    } else {
      setFormData({
        roomNumber: "",
        location: "",
        floor: 1,
        capacity: 1,
        roomType: "Meeting",
        availabilityStatus: "Available",
      })
    }
  }, [room, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (room) {
        await updateRoom(room.id, formData)
      } else {
        await addRoom(formData)
      }
      setOpen(false)
      onClose?.()
    } catch (error) {
      alert(`Failed to ${room ? "update" : "create"} room`)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      onClose?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="e.g., A101"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location/Building</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Building A"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number.parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select
              value={formData.roomType}
              onValueChange={(value: Room["roomType"]) => setFormData({ ...formData, roomType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Storage">Storage</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availabilityStatus">Availability Status</Label>
            <Select
              value={formData.availabilityStatus}
              onValueChange={(value: Room["availabilityStatus"]) =>
                setFormData({ ...formData, availabilityStatus: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : room ? "Update Room" : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
