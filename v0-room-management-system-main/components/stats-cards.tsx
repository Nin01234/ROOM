"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Building, Users, Wrench, Clock, TrendingUp, Thermometer, Activity } from "lucide-react"
import { useRoomStats } from "@/hooks/use-rooms"

export function StatsCards() {
  const { stats, isLoading } = useRoomStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      title: "Total Rooms",
      value: stats?.total || 0,
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      subtitle: "Across all buildings",
    },
    {
      title: "Available Now",
      value: stats?.available || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      subtitle: `${Math.round(((stats?.available || 0) / (stats?.total || 1)) * 100)}% available`,
      progress: ((stats?.available || 0) / (stats?.total || 1)) * 100,
    },
    {
      title: "Currently Occupied",
      value: stats?.occupied || 0,
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      subtitle: `${stats?.currentOccupancy || 0}/${stats?.totalCapacity || 0} people`,
      progress: ((stats?.currentOccupancy || 0) / (stats?.totalCapacity || 1)) * 100,
    },
    {
      title: "Utilization Rate",
      value: `${stats?.utilizationRate || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      subtitle: "Overall efficiency",
      progress: stats?.utilizationRate || 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">
                {item.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-lg ${item.bgColor} flex-shrink-0`}>
                <item.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-1 sm:space-y-2 px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
              {item.progress !== undefined && <Progress value={item.progress} className="h-1.5 sm:h-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Average Temperature</CardTitle>
            <div className="p-1.5 sm:p-2 rounded-lg bg-orange-50 dark:bg-orange-950">
              <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{stats?.averageTemperature || 22}°C</div>
            <p className="text-xs text-muted-foreground">Optimal range: 20-24°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Maintenance Status</CardTitle>
            <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{stats?.maintenance || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.maintenance === 0 ? "All systems operational" : "Rooms under maintenance"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <div className="p-1.5 sm:p-2 rounded-lg bg-green-50 dark:bg-green-950">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                Online
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Real-time monitoring active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
