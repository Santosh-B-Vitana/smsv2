
import { useState } from "react";
import { Shield, School, Users, Settings, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { PermissionsManager } from "@/components/permissions/PermissionsManager";

import SchoolManagement from "../superadmin/SchoolManagement";
import UserManagement from "../superadmin/UserManagement";

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const systemStats = {
    totalSchools: 24,
    activeUsers: 1847,
    totalStudents: 12459,
    systemUptime: "99.9%"
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-0">
      {/* Header - Mobile Responsive */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">Super Admin Portal</h1>
            <p className="text-sm text-muted-foreground">System-wide management and permissions control</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        {/* Mobile-First Tab Navigation */}
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-[320px] h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm">
              <School className="w-4 h-4" />
              <span>Schools</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 px-2 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* System Stats - Mobile Responsive Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Schools</CardTitle>
                <School className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold text-foreground">{systemStats.totalSchools}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold text-foreground">{systemStats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+127 from last week</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold text-foreground">{systemStats.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+543 from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold text-foreground">{systemStats.systemUptime}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Mobile Optimized */}
          <Card className="border-border">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Recent System Activity</CardTitle>
              <CardDescription className="text-sm">Latest changes and updates across all schools</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Vitana Schools permissions updated</p>
                    <p className="text-xs text-muted-foreground">Fees module access granted • 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">New school onboarded</p>
                    <p className="text-xs text-muted-foreground">Riverside High School added to system • 1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">System maintenance completed</p>
                    <p className="text-xs text-muted-foreground">Performance optimizations deployed • 3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4 sm:space-y-6">
          <PermissionsManager />
        </TabsContent>

        <TabsContent value="schools" className="space-y-4 sm:space-y-6">
          <SchoolManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4 sm:space-y-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
