
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck, Calendar, DollarSign } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { QuickActions } from "../components/dashboard/QuickActions";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { mockApi, DashboardStats } from "../services/mockApi";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect staff, parent, and super_admin to their dashboards
    if (user) {
      if (user.role === 'staff') {
        navigate('/staff-dashboard', { replace: true });
        return;
      }
      if (user.role === 'parent') {
        navigate('/parent-dashboard', { replace: true });
        return;
      }
      if (user.role === 'super_admin') {
        navigate('/super-admin-dashboard', { replace: true });
        return;
      }
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
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-display">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
        />
        <StatsCard
          title="Total Staff"
          value={stats?.totalStaff || 0}
          icon={UserCheck}
        />
        <StatsCard
          title="Today's Attendance"
          value={`${stats?.attendanceToday || 0}%`}
          icon={Calendar}
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${stats?.pendingFees?.toLocaleString() || 0}`}
          icon={DollarSign}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Upcoming Events */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
                <p className="font-medium text-sm">Parent-Teacher Meeting</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/5 border-l-4 border-warning">
                <p className="font-medium text-sm">Mid-term Examinations</p>
                <p className="text-xs text-muted-foreground">Next Week</p>
              </div>
              <div className="p-3 rounded-lg bg-success/5 border-l-4 border-success">
                <p className="font-medium text-sm">Sports Day</p>
                <p className="text-xs text-muted-foreground">March 15, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
