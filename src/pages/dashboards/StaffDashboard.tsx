
import { useEffect, useState } from "react";
import { Calendar, Users, BookOpen, CheckCircle, Clock, MessageSquare, AlertCircle, Bell, Award, TrendingUp } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { CalendarWidget } from "../../components/dashboard/CalendarWidget";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AnimatedWrapper } from "@/components/common/AnimatedWrapper";
import { ModernCard } from "@/components/common/ModernCard";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <div className="relative min-h-screen">
      <AnimatedBackground variant="gradient" className="fixed inset-0 -z-10 opacity-20" />
      
      <div className="relative space-y-8 animate-fade-in">
        {/* Header with gradient - matching Admin */}
        <AnimatedWrapper variant="fadeInUp" delay={0.1}>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 border">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                {t('dashboard.welcomeBack')}, {user?.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('dashboard.teachingSchedule')} - Manage your classes and students
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </AnimatedWrapper>

        {/* Stats Cards - Enhanced with colors like Admin */}
        <AnimatedWrapper variant="fadeInUp" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernCard variant="glass" className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Classes Today
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">10-A, 10-B, 9-A, 9-B</p>
              </CardContent>
            </ModernCard>

            <ModernCard variant="glass" className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Attendance Today
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">92%</div>
                <Progress value={92} className="mt-3 h-2" />
              </CardContent>
            </ModernCard>

            <ModernCard variant="glass" className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Assignments to Grade
                  <Clock className="h-4 w-4 text-amber-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-1">Due this week</p>
              </CardContent>
            </ModernCard>

            <ModernCard variant="glass" className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  Total Students
                  <Users className="h-4 w-4 text-blue-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
              </CardContent>
            </ModernCard>
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper variant="fadeInUp" delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule - Enhanced */}
            <ModernCard variant="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySchedule.map((schedule, index) => (
                  <div key={index} className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary hover:bg-primary/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{schedule.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">Class {schedule.class}</p>
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{schedule.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ModernCard>

            {/* Assigned Classes & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <ModernCard variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    My Assigned Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { subject: "Mathematics", class: "10-A", section: "A", students: 45 },
                    { subject: "Mathematics", class: "10-B", section: "B", students: 42 },
                    { subject: "Algebra", class: "9-A", section: "A", students: 38 },
                    { subject: "Geometry", class: "9-B", section: "B", students: 31 }
                  ].map((assignment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-sm">{assignment.subject}</p>
                        <p className="text-xs text-muted-foreground">Class {assignment.class} - Section {assignment.section} • {assignment.students} students</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">Active</Badge>
                    </div>
                  ))}
                </CardContent>
              </ModernCard>

              {/* Quick Actions - Enhanced */}
              <ModernCard variant="glass">
                <CardHeader>
                  <CardTitle className="text-lg">{t('dashboard.quickActions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all group" 
                      onClick={() => navigate('/leave-management')}
                    >
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium">{t('dashboard.applyLeave')}</p>
                    </button>
                    <button 
                      className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group" 
                      onClick={() => navigate('/my-classes')}
                    >
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium">{t('dashboard.myClasses')}</p>
                    </button>
                    <button 
                      className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 hover:border-green-500/30 transition-all group" 
                      onClick={() => navigate('/assignments')}
                    >
                      <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium">{t('dashboard.gradeAssignments')}</p>
                    </button>
                    <button 
                      className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all group" 
                      onClick={() => navigate('/communication')}
                    >
                      <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-medium">{t('dashboard.sendMessage')}</p>
                    </button>
                  </div>
                </CardContent>
              </ModernCard>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Upcoming Events & Announcements */}
        <AnimatedWrapper variant="fadeInUp" delay={0.4}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModernCard variant="glass">
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
                      <p className="text-xs text-muted-foreground mt-1">Grade papers for Classes 9-10</p>
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Mar 20-25</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/5 border-l-4 border-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors">Parent-Teacher Meeting</p>
                      <p className="text-xs text-muted-foreground mt-1">Class 10-A, 10-B discussion</p>
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-500/10 px-2 py-1 rounded">Mar 18, 2PM</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/5 border-l-4 border-green-500 hover:bg-green-500/10 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm group-hover:text-green-600 transition-colors">Faculty Meeting</p>
                      <p className="text-xs text-muted-foreground mt-1">Department coordination</p>
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">Tomorrow, 4PM</span>
                  </div>
                </div>
              </CardContent>
            </ModernCard>

            <ModernCard variant="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Important Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">Submit Lesson Plans</p>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Please submit your lesson plans for next month by Friday.</p>
                </div>
                <div className="p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">New Assessment Guidelines</p>
                    <span className="text-xs text-muted-foreground">5 days ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Updated CCE assessment guidelines have been shared via email.</p>
                </div>
              </CardContent>
            </ModernCard>
          </div>
        </AnimatedWrapper>

        {/* Calendar Widget */}
        <AnimatedWrapper variant="fadeInUp" delay={0.5}>
          <ModernCard variant="glass">
            <CalendarWidget />
          </ModernCard>
        </AnimatedWrapper>
      </div>
    </div>
  );
}
