import { useEffect, useState } from "react";
import { User, Calendar, Award, MessageSquare, BadgeIndianRupee, TrendingUp, Clock } from "lucide-react";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { ParentChildSelector } from "../../components/parent/ParentChildSelector";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AnimatedWrapper } from "@/components/common/AnimatedWrapper";
import { ModernCard } from "@/components/common/ModernCard";
import { TransportTrackingWidget } from "@/components/parent/TransportTrackingWidget";

const attendanceTrendData = [
  { month: 'Sep', attendance: 92 },
  { month: 'Oct', attendance: 94 },
  { month: 'Nov', attendance: 93 },
  { month: 'Dec', attendance: 95 },
  { month: 'Jan', attendance: 94 },
  { month: 'Feb', attendance: 96 }
];

const subjectGradesData = [
  { subject: 'Math', grade: 92 },
  { subject: 'Science', grade: 88 },
  { subject: 'English', grade: 95 },
  { subject: 'History', grade: 87 },
  { subject: 'Geography', grade: 90 }
];

export default function ParentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
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

  if (!childInfo) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen p-6">
      <AnimatedBackground variant="gradient" className="fixed inset-0 -z-10" />
      
      <div className="space-y-8 relative z-10 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <AnimatedWrapper variant="fadeInUp" delay={0.1}>
          <div>
        <h1 className="text-display">{t('dashboard.welcomeUser')}, {user?.name}</h1>
        <p className="text-muted-foreground mt-2">
            {t('dashboard.trackProgress')}
          </p>
          </div>
        </AnimatedWrapper>

        {/* Child Selector */}
        <AnimatedWrapper variant="fadeInUp" delay={0.2}>
          <ParentChildSelector
            selectedChildId={selectedChildId}
            onChildSelect={setSelectedChildId}
          />
        </AnimatedWrapper>

        {/* Stats Cards */}
        <AnimatedWrapper variant="fadeInUp" delay={0.3}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('dashboard.attendance')}
          value={`${childInfo.attendance}%`}
          icon={Calendar}
        />
        <StatsCard
          title={t('dashboard.pendingFees')}
          value={`₹${childInfo.pendingFees.toLocaleString()}`}
          icon={BadgeIndianRupee}
        />
        <StatsCard
          title={t('dashboard.lastExamGrade')}
          value={childInfo.lastExamGrade}
          icon={Award}
        />
        <StatsCard
          title={t('dashboard.unreadMessages')}
            value={3}
            icon={MessageSquare}
          />
          </div>
        </AnimatedWrapper>

        <AnimatedWrapper variant="fadeInUp" delay={0.4}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Recent Grades */}
            <ModernCard variant="glass">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.recentGrades')}</h3>
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
            </ModernCard>

            {/* Child Achievements */}
            <ModernCard variant="glass">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.achievementsTitle')}</h3>
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
            </ModernCard>

            {/* Upcoming Events */}
            <ModernCard variant="glass">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.upcomingEvents')}</h3>
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
            </ModernCard>

            {/* Direct Teacher Contact */}
            <ModernCard variant="glass">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.contactClassTeacher')}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-medium">Mr. James Thompson</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">Mathematics & Homeroom Teacher</div>
                <a href="mailto:james.thompson@vitanaSchools.edu" className="inline-block px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/80 transition">Email Teacher</a>
              </div>
            </ModernCard>
          </div>
        </AnimatedWrapper>

        {/* Transport Tracking */}
        <AnimatedWrapper variant="fadeInUp" delay={0.5}>
          <TransportTrackingWidget childId={selectedChildId} />
        </AnimatedWrapper>

        {/* Academic Analytics */}
        <AnimatedWrapper variant="fadeInUp" delay={0.6}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance Trend
            </CardTitle>
            <CardDescription>Monthly attendance pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[85, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Line type="monotone" dataKey="attendance" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ fill: 'hsl(var(--chart-3))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Subject-wise Performance
            </CardTitle>
            <CardDescription>Latest test scores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectGradesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="grade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </AnimatedWrapper>

        {/* Performance Goals */}
        <AnimatedWrapper variant="fadeInUp" delay={0.7}>
          <Card>
        <CardHeader>
          <CardTitle className="text-base">Semester Goals Progress</CardTitle>
          <CardDescription>Track your child's progress towards academic goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Academic Performance</span>
              <span className="text-sm text-muted-foreground">90%</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Attendance Target</span>
              <span className="text-sm text-muted-foreground">95%</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Homework Completion</span>
              <span className="text-sm text-muted-foreground">88%</span>
            </div>
            <Progress value={88} className="h-2" />
          </div>
        </CardContent>
      </Card>
        </AnimatedWrapper>
      </div>
    </div>
  );
}