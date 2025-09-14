import { useEffect, useState } from "react";
import { User, Calendar, Award, MessageSquare, BadgeIndianRupee } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { ParentChildSelector } from "../../components/parent/ParentChildSelector";
import { useAuth } from "../../contexts/AuthContext";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [selectedChildId, setSelectedChildId] = useState<string>("child1");
  
  const childrenData = {
    child1: {
      name: "Alice Johnson",
      class: "10-A", 
      rollNo: "001",
      attendance: 94.5,
      pendingFees: 25000,
      lastExamGrade: "A+"
    },
    child2: {
      name: "Bob Johnson",
      class: "8-B",
      rollNo: "045", 
      attendance: 88.2,
      pendingFees: 15000,
      lastExamGrade: "B+"
    }
  };

  const childInfo = childrenData[selectedChildId as keyof typeof childrenData];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-display">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
          Track your child's academic progress and school activities.
        </p>
      </div>

      {/* Child Selector */}
      <ParentChildSelector 
        selectedChildId={selectedChildId}
        onChildSelect={setSelectedChildId}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Attendance"
          value={`${childInfo.attendance}%`}
          icon={Calendar}
          trend={{ value: 2.1, label: "this month" }}
        />
        <StatsCard
          title="Pending Fees"
          value={`₹${childInfo.pendingFees.toLocaleString()}`}
          icon={BadgeIndianRupee}
          trend={{ value: 0, label: "due date: 30th" }}
        />
        <StatsCard
          title="Last Exam Grade"
          value={childInfo.lastExamGrade}
          icon={Award}
          trend={{ value: 5, label: "improvement" }}
        />
        <StatsCard
          title="Unread Messages"
          value={3}
          icon={MessageSquare}
          trend={{ value: 1, label: "new today" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Grades */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Recent Grades</h3>
          <div className="space-y-3">
            {[
              { subject: "Mathematics", grade: "A+", date: "2024-03-10" },
              { subject: "English", grade: "A", date: "2024-03-08" },
              { subject: "Science", grade: "A+", date: "2024-03-05" },
              { subject: "History", grade: "B+", date: "2024-03-03" }
            ].map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{grade.subject}</p>
                  <p className="text-xs text-muted-foreground">{grade.date}</p>
                </div>
                <div className="text-lg font-bold text-primary">{grade.grade}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Child Achievements */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-success/10 border-l-4 border-success">
              <p className="font-medium text-sm">Won 1st Prize in Science Fair</p>
              <p className="text-xs text-muted-foreground">March 2024</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border-l-4 border-primary">
              <p className="font-medium text-sm">Selected for School Debate Team</p>
              <p className="text-xs text-muted-foreground">February 2024</p>
            </div>
          </div>
        </div>

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

        {/* Direct Teacher Contact */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Contact Class Teacher</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <span className="font-medium">Mr. James Thompson</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">Mathematics & Homeroom Teacher</div>
            <a href="mailto:james.thompson@vitanaSchools.edu" className="inline-block px-3 py-1 rounded bg-primary text-white text-xs font-semibold hover:bg-primary/80 transition">Email Teacher</a>
          </div>
        </div>
      </div>
    </div>
  );
}