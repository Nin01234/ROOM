"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomStorage, type Room, type MaintenanceRecord } from "@/lib/room-storage"
import {
  CalendarIcon,
  Plus,
  Search,
  Filter,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  MapPin,
} from "lucide-react"
import { format, parseISO, isBefore } from "date-fns"
import { cn } from "@/lib/utils"

export default function MaintenancePage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [maintenanceType, setMaintenanceType] = useState<string>("")
  const [description, setDescription] = useState("")
  const [technician, setTechnician] = useState("")
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const [estimatedCost, setEstimatedCost] = useState("")

  useEffect(() => {
    const loadData = () => {
      const roomData = RoomStorage.getRooms()
      const maintenanceData = RoomStorage.getMaintenanceRecords()
      setRooms(roomData)
      setMaintenanceRecords(maintenanceData)
      setIsLoading(false)
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = maintenanceRecords

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.technician.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.type === typeFilter)
    }

    setFilteredRecords(filtered)
  }, [maintenanceRecords, searchTerm, statusFilter, typeFilter])

  const handleCreateMaintenanceRecord = () => {
    if (!selectedRoom || !maintenanceType || !description || !technician || !scheduledDate) {
      alert("Please fill in all required fields")
      return
    }

    const newRecord = {
      roomId: selectedRoom,
      type: maintenanceType as "Cleaning" | "Repair" | "Inspection" | "Upgrade",
      description,
      technician,
      scheduledDate: scheduledDate.toISOString(),
      status: "Scheduled" as const,
      cost: estimatedCost ? Number.parseFloat(estimatedCost) : undefined,
    }

    RoomStorage.addMaintenanceRecord(newRecord)

    // Reset form
    setSelectedRoom("")
    setMaintenanceType("")
    setDescription("")
    setTechnician("")
    setScheduledDate(undefined)
    setEstimatedCost("")
    setIsDialogOpen(false)

    // Refresh data
    const maintenanceData = RoomStorage.getMaintenanceRecords()
    setMaintenanceRecords(maintenanceData)
  }

  const getRoomName = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? `${room.roomNumber} - ${room.location}` : "Unknown Room"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "secondary"
      case "In Progress":
        return "default"
      case "Completed":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cleaning":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Repair":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Inspection":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Upgrade":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const activeRecords = filteredRecords.filter(
    (record) => record.status === "Scheduled" || record.status === "In Progress",
  )

  const completedRecords = filteredRecords.filter((record) => record.status === "Completed")

  const overdueRecords = filteredRecords.filter(
    (record) => record.status === "Scheduled" && isBefore(parseISO(record.scheduledDate), new Date()),
  )

  const stats = {
    total: maintenanceRecords.length,
    scheduled: maintenanceRecords.filter((r) => r.status === "Scheduled").length,
    inProgress: maintenanceRecords.filter((r) => r.status === "In Progress").length,
    completed: maintenanceRecords.filter((r) => r.status === "Completed").length,
    overdue: overdueRecords.length,
    totalCost: maintenanceRecords
      .filter((r) => r.status === "Completed" && r.cost)
      .reduce((sum, r) => sum + (r.cost || 0), 0),
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Maintenance Tracking</h1>
          <p className="text-muted-foreground">Monitor and manage facility maintenance</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>Create a new maintenance record for a room.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room">Room *</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.roomNumber} - {room.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Maintenance Type *</Label>
                  <Select value={maintenanceType} onValueChange={setMaintenanceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Upgrade">Upgrade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the maintenance work needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technician">Assigned Technician *</Label>
                  <Input
                    id="technician"
                    placeholder="Technician name"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Estimated Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="0.00"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Scheduled Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMaintenanceRecord}>Schedule Maintenance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by description or technician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Cleaning">Cleaning</SelectItem>
            <SelectItem value="Repair">Repair</SelectItem>
            <SelectItem value="Inspection">Inspection</SelectItem>
            <SelectItem value="Upgrade">Upgrade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activeRecords.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedRecords.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueRecords.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No active maintenance records found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeRecords.map((record) => {
                const StatusIcon = getStatusIcon(record.status)
                return (
                  <Card key={record.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
                        <Badge variant={getStatusColor(record.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {record.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{record.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {getRoomName(record.roomId)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          {record.technician}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {format(parseISO(record.scheduledDate), "MMM dd, yyyy")}
                        </div>
                        {record.cost && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />${record.cost.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No completed maintenance records found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedRecords.map((record) => (
                <Card key={record.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
                      <Badge variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{record.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {getRoomName(record.roomId)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        {record.technician}
                      </div>
                      {record.completedDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4" />
                          Completed {format(parseISO(record.completedDate), "MMM dd, yyyy")}
                        </div>
                      )}
                      {record.cost && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />${record.cost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <p className="text-muted-foreground text-center">Great! No overdue maintenance records.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {overdueRecords.map((record) => (
                <Card key={record.id} className="border-red-200 dark:border-red-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Overdue
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{record.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {getRoomName(record.roomId)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        {record.technician}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <CalendarIcon className="h-4 w-4" />
                        Due: {format(parseISO(record.scheduledDate), "MMM dd, yyyy")}
                      </div>
                      {record.cost && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />${record.cost.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
