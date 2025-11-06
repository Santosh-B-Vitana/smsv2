import { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, Award, TrendingUp, TrendingDown, BadgeIndianRupee, ArrowUpRight, Clock, CheckCircle2, XCircle, AlertCircle, Settings, Target, Zap } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { mockApi, DashboardStats } from "../../services/mockApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SettingsPage from "../Settings";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If URL contains ?tab=, activate that tab (useful for deep-linking from header)
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab) setActiveTab(tab);
    } catch (e) {
      // ignore
    }

    const fetchStats = async () => {
      try {
        const data = await mockApi.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [location.search]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-64 bg-muted rounded-lg lg:col-span-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

  <TabsContent value="dashboard">
          {/* Header with gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 mb-8 border">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-muted-foreground text-lg">
                Your school at a glance - today's overview and quick actions
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Total Students
                  <Users className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalStudents || 0}</div>
                {/* Removed small metrics text */}
                <button 
                  onClick={() => navigate('/students')}
                  className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View all students <ArrowUpRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Total Staff
                  <UserCheck className="h-4 w-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalStaff || 0}</div>
                {/* Removed small metrics text */}
                <button 
                  onClick={() => navigate('/staff')}
                  className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View all staff <ArrowUpRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Today's Attendance
                  <Calendar className="h-4 w-4 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.attendanceToday || 0}%</div>
                <Progress value={stats?.attendanceToday || 0} className="mt-3 h-2" />
                <button 
                  onClick={() => navigate('/staff-attendance')}
                  className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Mark attendance <ArrowUpRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Pending Fees
                  <BadgeIndianRupee className="h-4 w-4 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{stats?.pendingFees?.toLocaleString() || 0}</div>
                {/* Removed small metrics text */}
                <button 
                  onClick={() => navigate('/fees')}
                  className="mt-3 text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Manage fees <ArrowUpRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Two Column Layout - Quick Actions & Events/Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 space-y-6">
              <QuickActions />
              
              {/* Quick Stats Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Present Today</p>
                        <p className="text-lg font-bold text-green-600">145/160</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Staff on Duty</p>
                        <p className="text-lg font-bold text-blue-600">28/32</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <BadgeIndianRupee className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Today's Collection</p>
                        <p className="text-lg font-bold text-amber-600">₹45,200</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Active Classes</p>
                        <p className="text-lg font-bold text-purple-600">12</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-lg bg-primary/5 border-l-4 border-primary hover:bg-primary/10 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">Mid-term Examinations</p>
                        <p className="text-xs text-muted-foreground mt-1">Classes 6-10 | All Subjects</p>
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Mar 20-25</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/5 border-l-4 border-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Parent-Teacher Meeting</p>
                        <p className="text-xs text-muted-foreground mt-1">Class 8-A, 8-B | Main Hall</p>
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-500/10 px-2 py-1 rounded">Mar 18, 2PM</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/5 border-l-4 border-green-500 hover:bg-green-500/10 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm group-hover:text-green-600 transition-colors">Sports Day</p>
                        <p className="text-xs text-muted-foreground mt-1">All Classes | Sports Ground</p>
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">Mar 30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Latest Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">School Reopening After Winter Break</p>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">All students are requested to report by 8:00 AM on March 15th with completed holiday homework.</p>
                  </div>
                  <div className="p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">New Library Timings</p>
                      <span className="text-xs text-muted-foreground">5 days ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Library will remain open from 8:00 AM to 6:00 PM starting next week. Saturday hours: 9:00 AM - 2:00 PM.</p>
                  </div>
                  <div className="p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">Uniform Policy Update</p>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Updated uniform guidelines for summer season. Please refer to the handbook for complete details.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Center */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Action Center - Requires Attention
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/admissions')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-2xl font-bold text-blue-600">5</span>
                  </div>
                  <p className="text-sm font-medium">Pending Admissions</p>
                  <p className="text-xs text-muted-foreground mt-1">Applications awaiting review</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/fees')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                      <BadgeIndianRupee className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-2xl font-bold text-amber-600">23</span>
                  </div>
                  <p className="text-sm font-medium">Urgent Fee Reminders</p>
                  <p className="text-xs text-muted-foreground mt-1">Overdue by 30+ days</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/staff-attendance')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-2xl font-bold text-red-600">3</span>
                  </div>
                  <p className="text-sm font-medium">Low Attendance Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">Classes below 75%</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate('/examinations')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-2xl font-bold text-purple-600">2</span>
                  </div>
                  <p className="text-sm font-medium">Upcoming Exams</p>
                  <p className="text-xs text-muted-foreground mt-1">Within next 7 days</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Highlights */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              This Week's Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600" />
                    Top Performing Class
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-1">Class 10-A</p>
                  <p className="text-sm text-muted-foreground">Average score: 92%</p>
                  <Progress value={92} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BadgeIndianRupee className="h-4 w-4 text-blue-600" />
                    Fee Collection Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-1">78%</p>
                  <p className="text-sm text-muted-foreground">This month's collection</p>
                  <Progress value={78} className="mt-3 h-2" />
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Average Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-1">91%</p>
                  <p className="text-sm text-muted-foreground">This week's average</p>
                  <Progress value={91} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
