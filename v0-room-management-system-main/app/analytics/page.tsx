"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RoomStorage } from "@/lib/room-storage"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Thermometer,
  AlertTriangle,
  Download,
  Calendar,
  Clock,
  Building,
  BarChart3,
  FileText,
  Filter,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { subDays } from "date-fns"
import type { Room } from "@/lib/room-storage"
import type { DateRange } from "react-day-picker"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [stats, setStats] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadData = () => {
      const roomData = RoomStorage.getRooms()
      const statsData = RoomStorage.getStats()
      setRooms(roomData)
      setStats(statsData)
      setIsLoading(false)
    }

    loadData()
    // Refresh data every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const roomData = RoomStorage.getRooms()
    const statsData = RoomStorage.getStats()
    setRooms(roomData)
    setStats(statsData)
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information.",
    })
  }

  const handleExportReport = (type: string) => {
    toast({
      title: "Export Started",
      description: `Your ${type} report is being generated and will be ready for download shortly.`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="container mx-auto p-6 flex-1">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const filteredRooms = selectedBuilding === "all" ? rooms : rooms.filter((room) => room.location === selectedBuilding)

  const buildings = [...new Set(rooms.map((room) => room.location))]

  const statusData = [
    { name: "Available", value: stats.available, color: "#00C49F" },
    { name: "Occupied", value: stats.occupied, color: "#FF8042" },
    { name: "Maintenance", value: stats.maintenance, color: "#FFBB28" },
    { name: "Reserved", value: stats.reserved || 0, color: "#8884D8" },
  ]

  const capacityData = filteredRooms.map((room) => ({
    name: room.roomNumber,
    capacity: room.capacity,
    occupancy: room.occupancyCount || 0,
    utilization: room.capacity > 0 ? Math.round(((room.occupancyCount || 0) / room.capacity) * 100) : 0,
    location: room.location,
  }))

  const floorData = filteredRooms.reduce(
    (acc, room) => {
      const floor = `Floor ${room.floor}`
      if (!acc[floor]) {
        acc[floor] = { floor, total: 0, available: 0, occupied: 0, maintenance: 0 }
      }
      acc[floor].total++
      if (room.availabilityStatus === "Available") acc[floor].available++
      if (room.availabilityStatus === "Occupied") acc[floor].occupied++
      if (room.availabilityStatus === "Maintenance") acc[floor].maintenance++
      return acc
    },
    {} as Record<string, any>,
  )

  const floorChartData = Object.values(floorData)

  const temperatureData = filteredRooms.map((room) => ({
    name: room.roomNumber,
    temperature: room.temperature || 22,
    optimal: room.temperature && room.temperature >= 20 && room.temperature <= 24,
  }))

  const buildingData = rooms.reduce(
    (acc, room) => {
      if (!acc[room.location]) {
        acc[room.location] = { building: room.location, rooms: 0, capacity: 0, occupied: 0, available: 0 }
      }
      acc[room.location].rooms++
      acc[room.location].capacity += room.capacity
      acc[room.location].occupied += room.occupancyCount || 0
      if (room.availabilityStatus === "Available") acc[room.location].available++
      return acc
    },
    {} as Record<string, any>,
  )

  const buildingChartData = Object.values(buildingData).map((building: any) => ({
    ...building,
    utilization: building.capacity > 0 ? Math.round((building.occupied / building.capacity) * 100) : 0,
    availability: building.rooms > 0 ? Math.round((building.available / building.rooms) * 100) : 0,
  }))

  const timeAnalyticsData = [
    { time: "8:00", bookings: 5, occupancy: 15 },
    { time: "9:00", bookings: 12, occupancy: 35 },
    { time: "10:00", bookings: 18, occupancy: 52 },
    { time: "11:00", bookings: 22, occupancy: 68 },
    { time: "12:00", bookings: 15, occupancy: 45 },
    { time: "13:00", bookings: 8, occupancy: 25 },
    { time: "14:00", bookings: 20, occupancy: 58 },
    { time: "15:00", bookings: 25, occupancy: 72 },
    { time: "16:00", bookings: 18, occupancy: 48 },
    { time: "17:00", bookings: 10, occupancy: 28 },
  ]

  const roomTypeData = [
    { type: "Conference Room", count: 8, utilization: 75 },
    { type: "Meeting Room", count: 12, utilization: 68 },
    { type: "Training Room", count: 4, utilization: 45 },
    { type: "Office", count: 6, utilization: 82 },
    { type: "Huddle Room", count: 10, utilization: 58 },
  ]

  const weeklyTrendData = [
    { day: "Mon", bookings: 45, utilization: 72 },
    { day: "Tue", bookings: 52, utilization: 78 },
    { day: "Wed", bookings: 48, utilization: 75 },
    { day: "Thu", bookings: 55, utilization: 82 },
    { day: "Fri", bookings: 38, utilization: 65 },
    { day: "Sat", bookings: 12, utilization: 25 },
    { day: "Sun", bookings: 8, utilization: 18 },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header with Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Analytics & Reports</h1>
              <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("comprehensive")}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building} value={building}>
                    {building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPeriod === "custom" && <DatePickerWithRange date={dateRange} setDate={setDateRange} />}
          </div>

          {/* Enhanced Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCapacity}</div>
                <p className="text-xs text-muted-foreground">{stats.currentOccupancy} currently occupied</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+5% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                  {stats.utilizationRate > 70 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.utilizationRate}%</div>
                <Progress value={stats.utilizationRate} className="mt-2" />
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.3% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <Thermometer className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageTemperature}°C</div>
                <p className="text-xs text-muted-foreground">Optimal range: 20-24°C</p>
                <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                  Within Range
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.occupied || 0}</div>
                <p className="text-xs text-muted-foreground">{stats.maintenance || 0} maintenance scheduled</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600">Peak: 2-4 PM</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="utilization">Utilization</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Status Distribution</CardTitle>
                    <CardDescription>Current availability across all rooms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rooms by Floor</CardTitle>
                    <CardDescription>Distribution and availability by floor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={floorChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="floor" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="available" stackId="a" fill="#00C49F" name="Available" />
                        <Bar dataKey="occupied" stackId="a" fill="#FF8042" name="Occupied" />
                        <Bar dataKey="maintenance" stackId="a" fill="#FFBB28" name="Maintenance" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Usage Pattern</CardTitle>
                  <CardDescription>Booking activity and occupancy throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={timeAnalyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="occupancy"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Occupancy %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="utilization" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Type Performance</CardTitle>
                    <CardDescription>Utilization by room category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={roomTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="utilization" fill="#8884d8" name="Utilization %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Building Efficiency</CardTitle>
                    <CardDescription>Comparative performance across buildings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={buildingChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="building" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="utilization" fill="#8884d8" name="Utilization %" />
                        <Line
                          type="monotone"
                          dataKey="availability"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          name="Availability %"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Room Utilization Ranking</CardTitle>
                  <CardDescription>Top performing rooms by efficiency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {capacityData
                      .sort((a, b) => b.utilization - a.utilization)
                      .slice(0, 10)
                      .map((room, index) => (
                        <div
                          key={room.name}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{room.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {room.location} • Capacity: {room.capacity}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{room.utilization}%</div>
                            <Progress value={room.utilization} className="w-20 h-2 mt-1" />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Booking Trends</CardTitle>
                  <CardDescription>Booking patterns and utilization across the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="bookings" fill="#8884d8" name="Bookings" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="utilization"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Utilization %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Peak Usage Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Thursday</div>
                    <p className="text-xs text-muted-foreground">82% average utilization</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Busiest Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2:00 PM</div>
                    <p className="text-xs text-muted-foreground">Peak booking hour</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Average Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.5 hrs</div>
                    <p className="text-xs text-muted-foreground">Typical meeting length</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="environment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Monitoring</CardTitle>
                  <CardDescription>Environmental conditions across all facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[18, 26]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {temperatureData.slice(0, 6).map((room) => (
                  <Card key={room.name} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{room.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">{room.temperature}°C</div>
                        <Badge variant={room.optimal ? "default" : "destructive"}>
                          {room.optimal ? "Optimal" : "Adjust"}
                        </Badge>
                      </div>
                      <Progress value={((room.temperature - 18) / (26 - 18)) * 100} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleExportReport("utilization")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Utilization Report
                    </CardTitle>
                    <CardDescription>Detailed room usage and efficiency metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleExportReport("occupancy")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Occupancy Report
                    </CardTitle>
                    <CardDescription>Space utilization and capacity analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleExportReport("maintenance")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Maintenance Report
                    </CardTitle>
                    <CardDescription>Equipment status and maintenance schedules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleExportReport("financial")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Financial Report
                    </CardTitle>
                    <CardDescription>Cost analysis and ROI metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleExportReport("environmental")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      Environmental Report
                    </CardTitle>
                    <CardDescription>Temperature and air quality monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleExportReport("comprehensive")}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Executive Summary
                    </CardTitle>
                    <CardDescription>Complete facility management overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Automated report generation and delivery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Weekly Utilization Summary</div>
                      <div className="text-sm text-muted-foreground">Every Monday at 9:00 AM</div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Monthly Executive Report</div>
                      <div className="text-sm text-muted-foreground">First day of each month</div>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Maintenance Alert Summary</div>
                      <div className="text-sm text-muted-foreground">Daily at 8:00 AM</div>
                    </div>
                    <Badge variant="secondary">Paused</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
