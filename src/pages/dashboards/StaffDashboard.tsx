
import { useEffect, useState } from "react";
import { Calendar, Users, BookOpen, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
  const { user } = useAuth();
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
        <h1 className="text-display">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          Your teaching schedule and important updates for today.
        </p>
      </div>

      {/* Stats Cards - Mobile responsive for Teachers */}
      <div className="mobile-stats grid gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Classes Today"
          value={4}
          icon={BookOpen}
          trend={{ value: 0, label: "scheduled" }}
        />
        <StatsCard
          title="Upcoming Events"
          value={2}
          icon={Calendar}
          trend={{ value: 1, label: "this week" }}
        />
        <StatsCard
          title="Student Highlights"
          value={3}
          icon={Users}
          trend={{ value: 2, label: "achievements" }}
        />
        <StatsCard
          title="Messages"
          value={5}
          icon={MessageSquare}
          trend={{ value: 2, label: "unread" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Assigned Classes */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Assigned Classes
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
                <Badge variant="secondary">Active</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/leave-management')}>
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">Apply Leave</p>
            </button>
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/my-classes')}>
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">My Classes</p>
            </button>
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/assignments')}>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">Grade Assignments</p>
            </button>
            <button className="p-2 sm:p-3 lg:p-4 rounded-lg border hover:bg-muted/50 transition-colors" onClick={() => navigate('/communication')}>
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mx-auto mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm font-medium">Send Message</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
