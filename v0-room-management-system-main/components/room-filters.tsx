"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import type { Room } from "@/lib/room-storage"

export interface FilterState {
  roomType: string
  availabilityStatus: string
  location: string
  floor: string
  minCapacity: string
  maxCapacity: string
}

interface RoomFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  rooms: Room[]
}

export function RoomFilters({ filters, onFiltersChange, rooms }: RoomFiltersProps) {
  const uniqueLocations = [...new Set(rooms.map((room) => room.location))]
  const uniqueFloors = [...new Set(rooms.map((room) => room.floor.toString()))].sort()

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilter = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: "" })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      roomType: "",
      availabilityStatus: "",
      location: "",
      floor: "",
      minCapacity: "",
      maxCapacity: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Room Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Room Type</label>
          <Select value={filters.roomType} onValueChange={(value) => updateFilter("roomType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Conference">Conference</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Storage">Storage</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.availabilityStatus}
            onValueChange={(value) => updateFilter("availabilityStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {uniqueLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Floor Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Floor</label>
          <Select value={filters.floor} onValueChange={(value) => updateFilter("floor", value)}>
            <SelectTrigger>
              <SelectValue placeholder="All floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All floors</SelectItem>
              {uniqueFloors.map((floor) => (
                <SelectItem key={floor} value={floor}>
                  Floor {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Capacity Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Capacity</label>
          <Select value={filters.minCapacity} onValueChange={(value) => updateFilter("minCapacity", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
              <SelectItem value="10">10+</SelectItem>
              <SelectItem value="20">20+</SelectItem>
              <SelectItem value="50">50+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Capacity Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Max Capacity</label>
          <Select value={filters.maxCapacity} onValueChange={(value) => updateFilter("maxCapacity", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="10">10 or less</SelectItem>
              <SelectItem value="20">20 or less</SelectItem>
              <SelectItem value="50">50 or less</SelectItem>
              <SelectItem value="100">100 or less</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.roomType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {filters.roomType}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("roomType")} />
            </Badge>
          )}
          {filters.availabilityStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.availabilityStatus}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("availabilityStatus")} />
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.location}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("location")} />
            </Badge>
          )}
          {filters.floor && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Floor: {filters.floor}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("floor")} />
            </Badge>
          )}
          {filters.minCapacity && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Min: {filters.minCapacity}+
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("minCapacity")} />
            </Badge>
          )}
          {filters.maxCapacity && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Max: {filters.maxCapacity}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter("maxCapacity")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
