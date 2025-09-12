
import { useEffect, useState } from "react";
import { Calendar, Users, BookOpen, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { useAuth } from "../../contexts/AuthContext";

export default function StaffDashboard() {
  const { user } = useAuth();
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

      {/* Stats Cards - Engaging for Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </h3>
          <div className="space-y-3">
            {todaySchedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{schedule.subject}</p>
                  <p className="text-xs text-muted-foreground">Class {schedule.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{schedule.time}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    45 min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Take Attendance</p>
            </button>
            <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <BookOpen className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">View Timetable</p>
            </button>
            <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <CheckCircle className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Grade Assignments</p>
            </button>
            <button className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <MessageSquare className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Send Message</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
