
import { useEffect, useState } from "react";
import { BookOpen, Calendar, Award, Users, Clock, MessageSquare } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { useAuth } from "../../contexts/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState({
    attendance: 96.2,
    averageGrade: "A",
    assignmentsPending: 3,
    upcomingExams: 2
  });

  const todayClasses = [
  { time: "08:00 - 08:45", subject: "Mathematics", teacher: "Mr. Anil Kumar", room: "Room 101" },
  { time: "09:00 - 09:45", subject: "English", teacher: "Ms. Priya Singh", room: "Room 205" },
  { time: "11:00 - 11:45", subject: "Science", teacher: "Dr. Rajesh Sharma", room: "Lab 1" },
  { time: "14:00 - 14:45", subject: "History", teacher: "Ms. Ananya Sharma", room: "Room 303" }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-display">Hello, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Your daily schedule and academic progress overview.
        </p>
      </div>

      {/* Stats Cards - Mobile responsive */}
      <div className="mobile-stats grid gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="My Attendance"
          value={`${studentData.attendance}%`}
          icon={Calendar}
        />
        <StatsCard
          title="Average Grade"
          value={studentData.averageGrade}
          icon={Award}
        />
        <StatsCard
          title="Pending Assignments"
          value={studentData.assignmentsPending}
          icon={BookOpen}
        />
        <StatsCard
          title="Upcoming Exams"
          value={studentData.upcomingExams}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        {/* Today's Classes */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Today's Classes
          </h3>
          <div className="space-y-3">
            {todayClasses.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{classItem.subject}</p>
                  <p className="text-xs text-muted-foreground">{classItem.teacher} • {classItem.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{classItem.time}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    45 min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments & Exams */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">Assignments & Exams</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-warning/5 border-l-4 border-warning">
              <p className="font-medium text-sm">Math Assignment</p>
              <p className="text-xs text-muted-foreground">Due: Tomorrow</p>
            </div>
            <div className="p-3 rounded-lg bg-destructive/5 border-l-4 border-destructive">
              <p className="font-medium text-sm">Science Project</p>
              <p className="text-xs text-muted-foreground">Due: March 15, 2024</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
              <p className="font-medium text-sm">History Exam</p>
              <p className="text-xs text-muted-foreground">March 18, 2024</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
              <p className="font-medium text-sm">English Exam</p>
              <p className="text-xs text-muted-foreground">March 20, 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
