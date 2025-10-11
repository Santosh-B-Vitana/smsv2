import { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, Award, GraduationCap, AlertTriangle, BadgeIndianRupee, BookOpen, FileText } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { mockApi, DashboardStats } from "../../services/mockApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataImportManager } from "@/components/superadmin/DataImportManager";
import { PayrollManager } from "@/components/payroll/PayrollManager";
import { Settings, Upload, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
      {/* Header */}
      <div>
        <h1 className="text-display">{t('dashboard.welcome')}</h1>
        <p className="text-muted-foreground mt-2">
          Complete overview of school operations and management.
        </p>
      </div>

      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title={t('dashboard.totalStudents')}
            value={stats?.totalStudents || 0}
            icon={Users}
            onClick={() => navigate('/students')}
          />
          <StatsCard
            title={t('dashboard.totalStaff')}
            value={stats?.totalStaff || 0}
            icon={UserCheck}
            onClick={() => navigate('/staff')}
          />
          <StatsCard
            title={t('dashboard.todayAttendance')}
            value={`${stats?.attendanceToday || 0}%`}
            icon={Calendar}
            onClick={() => navigate('/staff-attendance')}
          />
          <StatsCard
            title={t('dashboard.pendingFees')}
            value={`₹${stats?.pendingFees?.toLocaleString() || 0}`}
            icon={BadgeIndianRupee}
            onClick={() => navigate('/fees')}
          />
        </div>

        {/* Navigation Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div 
              onClick={() => navigate('/students')}
              className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">{t('nav.students')}</p>
            </div>
            
            <div 
              onClick={() => navigate('/staff')}
              className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
            >
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">{t('nav.staff')}</p>
            </div>
            
            <div 
              onClick={() => navigate('/staff-attendance')}
              className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Attendance</p>
            </div>
            
            <div 
              onClick={() => navigate('/examinations')}
              className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
            >
              <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Examinations</p>
            </div>
            
            <div 
              onClick={() => navigate('/documents')}
              className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Document Manager</p>
            </div>
            <div 
              onClick={() => navigate('/id-cards')}
              className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 text-center p-6"
            >
              <BadgeIndianRupee className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Generate ID Cards</p>
            </div>
          </div>
      </div>
    </div>
  );
}
