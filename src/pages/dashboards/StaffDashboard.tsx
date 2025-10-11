
import { useEffect, useState } from "react";
import { Calendar, Users, BookOpen, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

export default function StaffDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [todaySchedule, setTodaySchedule] = useState([
    { time: "08:00 - 08:45", subject: "Mathematics", class: "10-A" },
    { time: "09:00 - 09:45", subject: "Mathematics", class: "10-B" },
    { time: "11:00 - 11:45", subject: "Algebra", class: "9-A" },
    { time: "14:00 - 14:45", subject: "Geometry", class: "9-B" }
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-display">{t('dashboard.welcomeBack')}, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          {t('dashboard.teachingSchedule')}
        </p>
      </div>

      {/* Stats Cards - Mobile responsive for Teachers */}
      <div className="mobile-stats grid gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title={t('dashboard.classesToday')}
          value={4}
          icon={BookOpen}
        />
        <StatsCard
          title="Attendance Today"
          value="92%"
          icon={CheckCircle}
        />
        <StatsCard
          title="Assignments to Grade"
          value={7}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Assigned Classes */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('dashboard.myAssignedClasses')}
          </h3>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", class: "10-A", section: "A" },
              { subject: "Mathematics", class: "10-B", section: "B" },
              { subject: "Algebra", class: "9-A", section: "A" },
              { subject: "Geometry", class: "9-B", section: "B" }
            ].map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{assignment.subject}</p>
                  <p className="text-xs text-muted-foreground">Class {assignment.class} - Section {assignment.section}</p>
                </div>
                <Badge variant="secondary">{t('dashboard.active')}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/leave-management')}>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">{t('dashboard.applyLeave')}</p>
            </button>
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/my-classes')}>
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">{t('dashboard.myClasses')}</p>
            </button>
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/assignments')}>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">{t('dashboard.gradeAssignments')}</p>
            </button>
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/communication')}>
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">{t('dashboard.sendMessage')}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
