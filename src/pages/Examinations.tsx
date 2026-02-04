
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, TrendingUp, Users, Plus, FileText, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import ExaminationManager from "./academics/ExaminationManager";

export default function Examinations() {
  const navigate = useNavigate();
  const [reportsOpen, setReportsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalExams: 12,
    upcomingExams: 3,
    completedExams: 8,
    averagePerformance: 78.5,
    totalStudents: 450,
    resultsPublished: 8
  });

  const reportOptions = [
    {
      title: "Result Summary Report",
      description: "Overall performance metrics across all exams",
      icon: "📊",
      action: () => { setReportsOpen(false); navigate("/reports/exam-summary"); }
    },
    {
      title: "Exam Performance Report",
      description: "Detailed exam-wise performance analysis",
      icon: "📈",
      action: () => { setReportsOpen(false); navigate("/reports/exam-performance"); }
    },
    {
      title: "Student Wise Report",
      description: "Individual student marks and grades",
      icon: "👤",
      action: () => { setReportsOpen(false); navigate("/reports/student-marks"); }
    },
    {
      title: "Class Analysis Report",
      description: "Class-wise performance comparison",
      icon: "👥",
      action: () => { setReportsOpen(false); navigate("/reports/class-analysis"); }
    },
    {
      title: "Grade Distribution",
      description: "Statistical distribution of grades",
      icon: "📉",
      action: () => { setReportsOpen(false); navigate("/reports/grade-distribution"); }
    },
    {
      title: "Subject Performance",
      description: "Subject-wise performance metrics",
      icon: "📚",
      action: () => { setReportsOpen(false); navigate("/reports/subject-performance"); }
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display flex items-center gap-3">
            <Award className="h-8 w-8" />
            Examinations
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage exams, results, and report cards efficiently
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setReportsOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* Reports Dialog */}
      <Dialog open={reportsOpen} onOpenChange={setReportsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Examination Reports
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {reportOptions.map((report, idx) => (
              <button
                key={idx}
                onClick={report.action}
                className="p-4 border rounded-lg hover:bg-accent transition-colors text-left group"
              >
                <div className="text-2xl mb-2">{report.icon}</div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{report.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Exams</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalExams}</h3>
                <p className="text-xs text-muted-foreground mt-1">This Academic Year</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Exams</p>
                <h3 className="text-2xl font-bold mt-2">{stats.upcomingExams}</h3>
                <p className="text-xs text-green-600 mt-1">Next 30 days</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Performance</p>
                <h3 className="text-2xl font-bold mt-2">{stats.averagePerformance}%</h3>
                <p className="text-xs text-muted-foreground mt-1">Across all exams</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Results Published</p>
                <h3 className="text-2xl font-bold mt-2">{stats.resultsPublished}/{stats.completedExams}</h3>
                <p className="text-xs text-muted-foreground mt-1">Exams completed</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Examination Manager */}
      <ExaminationManager />
    </div>
  );
}
