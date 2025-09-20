"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import {
  Settings,
  Bell,
  Shield,
  Database,
  Palette,
  Download,
  Upload,
  AlertTriangle,
  Save,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    // General Settings
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "12h",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    maintenanceAlerts: true,
    systemUpdates: false,
    weeklyReports: true,

    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    dataRetention: "365",

    // System Preferences
    autoRefresh: true,
    refreshInterval: "30",
    defaultView: "grid",
    itemsPerPage: "20",

    // Theme Settings
    theme: "system",
    compactMode: false,
    animations: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Settings Saved",
      description: "Your preferences have been successfully updated.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready for download shortly.",
    })
  }

  const handleImportData = () => {
    toast({
      title: "Import Ready",
      description: "Please select a file to import your data.",
    })
  }

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      toast({
        title: "Settings Reset",
        description: "All settings have been restored to default values.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">Settings</h1>
              <p className="text-muted-foreground">Manage your application preferences and account settings</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Settings</CardTitle>
                  <CardDescription>Configure your language, timezone, and format preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings({ ...settings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={settings.dateFormat}
                        onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={settings.timeFormat}
                        onValueChange={(value) => setSettings({ ...settings, timeFormat: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>Configure how the application behaves and displays information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-muted-foreground">Automatically refresh data in real-time</p>
                    </div>
                    <Switch
                      checked={settings.autoRefresh}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoRefresh: checked })}
                    />
                  </div>

                  {settings.autoRefresh && (
                    <div className="space-y-2">
                      <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                      <Select
                        value={settings.refreshInterval}
                        onValueChange={(value) => setSettings({ ...settings, refreshInterval: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultView">Default View</Label>
                      <Select
                        value={settings.defaultView}
                        onValueChange={(value) => setSettings({ ...settings, defaultView: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid View</SelectItem>
                          <SelectItem value="list">List View</SelectItem>
                          <SelectItem value="table">Table View</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemsPerPage">Items Per Page</Label>
                      <Select
                        value={settings.itemsPerPage}
                        onValueChange={(value) => setSettings({ ...settings, itemsPerPage: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how and when you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Booking Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming bookings</p>
                    </div>
                    <Switch
                      checked={settings.bookingReminders}
                      onCheckedChange={(checked) => setSettings({ ...settings, bookingReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive alerts about maintenance activities</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceAlerts}
                      onCheckedChange={(checked) => setSettings({ ...settings, maintenanceAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified about system updates and changes</p>
                    </div>
                    <Switch
                      checked={settings.systemUpdates}
                      onCheckedChange={(checked) => setSettings({ ...settings, systemUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly utilization reports</p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Manage your account security and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={settings.twoFactorAuth ? "default" : "secondary"}>
                        {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention (days)</Label>
                    <Select
                      value={settings.dataRetention}
                      onValueChange={(value) => setSettings({ ...settings, dataRetention: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="730">2 years</SelectItem>
                        <SelectItem value="0">Never delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Display</CardTitle>
                  <CardDescription>Customize the look and feel of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => setSettings({ ...settings, theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, compactMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                    </div>
                    <Switch
                      checked={settings.animations}
                      onCheckedChange={(checked) => setSettings({ ...settings, animations: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Import, export, and manage your application data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button
                      onClick={handleImportData}
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Upload className="h-4 w-4" />
                      Import Data
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span>Danger Zone</span>
                    </div>

                    <Button onClick={handleResetSettings} variant="destructive" className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reset All Settings
                    </Button>

                    <p className="text-sm text-muted-foreground">
                      This will reset all your preferences to their default values. This action cannot be undone.
                    </p>
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
