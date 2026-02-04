import ConfigurationSettings from "./pages/ConfigurationSettings";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SchoolProvider } from "@/contexts/SchoolContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/layout/Layout";
import { NetworkErrorHandler } from "@/components/common/NetworkErrorHandler";

// Import all pages
import Login from "@/pages/Login";
import SuperAdminLogin from "@/pages/SuperAdminLogin";
import Dashboard from "@/pages/Dashboard";
import StaffDashboard from "@/pages/dashboards/StaffDashboard";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import ParentDashboard from "@/pages/dashboards/ParentDashboard";
import SuperAdminDashboard from "@/pages/dashboards/SuperAdminDashboard";
import Students from "@/pages/Students";
import StudentProfile from "@/pages/StudentProfile";
import StudentEdit from "@/pages/StudentEdit";
import Staff from "@/pages/Staff";
import StaffProfile from "@/pages/StaffProfile";
import StaffEdit from "@/pages/StaffEdit";
import Academics from "@/pages/academics";
import StaffAttendance from "@/pages/StaffAttendance";
import Grades from "@/pages/Grades";
import MyClasses from "@/pages/MyClasses";
import Assignments from "@/pages/Assignments";
import Examinations from "@/pages/Examinations";
import Reports from "@/pages/Reports";
import Timetable from "@/pages/Timetable";
import Transport from "@/pages/Transport";
import Library from "@/pages/Library";
import Hostel from "@/pages/Hostel";
import Health from "@/pages/Health";
import Fees from "@/pages/Fees";
import Communication from "@/pages/Communication";
import Announcements from "@/pages/Announcements";
import Documents from "@/pages/Documents";
import IdCards from "@/pages/IdCards";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import ClassManager from "@/pages/academics/ClassManager";
import ClassDetail from "@/pages/academics/ClassDetail";
import ClassProfile from "@/pages/ClassProfile";
import StaffClassProfile from "@/pages/StaffClassProfile";
import StudentFeeDetails from "./pages/StudentFeeDetails";
import MyClassDetail from "./pages/MyClassDetail";
import ParentFees from "./pages/ParentFees";
import ParentChildFeeDetails from "./pages/ParentChildFeeDetails";
import ParentChildFeePayment from "./pages/ParentChildFeePayment";
import ParentNotifications from "./pages/ParentNotifications";
import StudentAttendance from "./pages/StudentAttendance";
import Alumni from "./pages/Alumni";
import StaffAttendanceTeacher from "./pages/StaffAttendanceTeacher";
import Wallet from "./pages/Wallet";
import SchoolConnect from "./pages/SchoolConnect";
import Store from "./pages/Store";
import CCEManagement from "./pages/CCEManagement";
import FeeConcession from "./pages/FeeConcession";
import PaymentGateway from "./pages/PaymentGateway";
import PFESIManagement from "./pages/PFESIManagement";
import OfflineAttendance from "./pages/OfflineAttendance";

import NotFound from "./pages/NotFound";
import ChildProfile from "./pages/ChildProfile"; // Updated import
import LeaveManagement from "./pages/LeaveManagement";
import VisitorManagement from "./pages/VisitorManagement";

import SchoolManagement from "@/pages/superadmin/SchoolManagement";
import ExamSummary from "@/pages/reports/ExamSummary";
import ExamPerformance from "@/pages/reports/ExamPerformance";
import StudentMarks from "@/pages/reports/StudentMarks";
import ClassAnalysis from "@/pages/reports/ClassAnalysis";
import GradeDistribution from "@/pages/reports/GradeDistribution";
import SubjectPerformance from "@/pages/reports/SubjectPerformance";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="school-ui-theme">
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <SchoolProvider>
                <PermissionsProvider>
              <Router>
                <Routes>
                  {/* Default route redirects to dashboard based on user role */}
                      {/* Default route shows login screen */}
                      <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/super-admin-login" element={<SuperAdminLogin />} />
                  
                  {/* Protected routes with layout */}
                  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                  <Route path="/staff-dashboard" element={<Layout><StaffDashboard /></Layout>} />
                  <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
                  <Route path="/parent-dashboard" element={<Layout><ParentDashboard /></Layout>} />
                  <Route path="/super-admin-dashboard" element={<Layout><SuperAdminDashboard /></Layout>} />
                  <Route path="/academics" element={<Layout><Academics /></Layout>} />
                  <Route path="/superadmin/schools" element={<Layout><SchoolManagement /></Layout>} />
                   <Route path="/students" element={<Layout><Students /></Layout>} />
                   <Route path="/students/:id" element={<Layout><StudentProfile /></Layout>} />
                   <Route path="/students/:id/edit" element={<Layout><StudentEdit /></Layout>} />
                   <Route path="/staff" element={<Layout><Staff /></Layout>} />
                   <Route path="/staff/:id" element={<Layout><StaffProfile /></Layout>} />
                   <Route path="/staff/:id/edit" element={<Layout><StaffEdit /></Layout>} />
                   <Route path="/attendance" element={<Layout><StaffAttendanceTeacher /></Layout>} />
                   <Route path="/staff-attendance" element={<Layout><StaffAttendance /></Layout>} />
                   <Route path="/student-attendance" element={<Layout><StudentAttendance /></Layout>} />
                   <Route path="/alumni" element={<Layout><Alumni /></Layout>} />
                  <Route path="/grades" element={<Layout><Grades /></Layout>} />
                   <Route path="/my-classes" element={<Layout><MyClasses /></Layout>} />
                   <Route path="/my-classes/:classId" element={<Layout><MyClassDetail /></Layout>} />
                   <Route path="/assignments" element={<Layout><Assignments /></Layout>} />
                  <Route path="/examinations" element={<Layout><Examinations /></Layout>} />
                   <Route path="/reports/exam-summary" element={<Layout><ExamSummary /></Layout>} />
                   <Route path="/reports/exam-performance" element={<Layout><ExamPerformance /></Layout>} />
                   <Route path="/reports/student-marks" element={<Layout><StudentMarks /></Layout>} />
                   <Route path="/reports/class-analysis" element={<Layout><ClassAnalysis /></Layout>} />
                   <Route path="/reports/grade-distribution" element={<Layout><GradeDistribution /></Layout>} />
                   <Route path="/reports/subject-performance" element={<Layout><SubjectPerformance /></Layout>} />
                   <Route path="/cce-management" element={<Layout><CCEManagement /></Layout>} />
                   <Route path="/fee-concession" element={<Layout><FeeConcession /></Layout>} />
                   <Route path="/payment-gateway" element={<Layout><PaymentGateway /></Layout>} />
                   <Route path="/pf-esi" element={<Layout><PFESIManagement /></Layout>} />
                   <Route path="/offline-attendance" element={<Layout><OfflineAttendance /></Layout>} />
                  <Route path="/reports" element={<Layout><Reports /></Layout>} />
                  <Route path="/timetable" element={<Layout><Timetable /></Layout>} />
                  <Route path="/transport" element={<Layout><Transport /></Layout>} />
                  <Route path="/library" element={<Layout><Library /></Layout>} />
                  <Route path="/configuration-settings" element={<Layout><ConfigurationSettings /></Layout>} />
                   <Route path="/hostel" element={<Layout><Hostel /></Layout>} />
                   <Route path="/health" element={<Layout><Health /></Layout>} />
                   <Route path="/visitor-management" element={<Layout><VisitorManagement /></Layout>} />
                   <Route path="/fees" element={<Layout><Fees /></Layout>} />
                   <Route path="/wallet" element={<Layout><Wallet /></Layout>} />
                   <Route path="/school-connect" element={<Layout><SchoolConnect /></Layout>} />
                   <Route path="/store" element={<Layout><Store /></Layout>} />
                   <Route path="/communication" element={<Layout><Communication /></Layout>} />
                  <Route path="/announcements" element={<Layout><Announcements /></Layout>} />
                  <Route path="/documents" element={<Layout><Documents /></Layout>} />
                  <Route path="/id-cards" element={<Layout><IdCards /></Layout>} />
                  <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                  <Route path="/settings" element={<Layout><Settings /></Layout>} />
                   <Route path="/child-profile" element={<Layout><ChildProfile /></Layout>} />
                   <Route path="/leave-management" element={<Layout><LeaveManagement /></Layout>} />
                    <Route path="/academics/classes/manage" element={<Layout><ClassManager /></Layout>} />
                    <Route path="/academics/classes/:classId" element={<Layout><ClassDetail /></Layout>} />
                    <Route path="/class/:classId" element={<Layout><ClassProfile /></Layout>} />
                    <Route path="/staff-class/:classId" element={<Layout><StaffClassProfile /></Layout>} />
                    <Route path="/student-fee-details/:studentId" element={<StudentFeeDetails />} />
                    <Route path="/my-class-detail/:classId" element={<Layout><MyClassDetail /></Layout>} />
                     <Route path="/parent-fees" element={<Layout><ParentFees /></Layout>} />
                     <Route path="/parent-fees/:childId" element={<Layout><ParentChildFeeDetails /></Layout>} />
                     <Route path="/parent-fees/:childId/pay" element={<Layout><ParentChildFeePayment /></Layout>} />
                     <Route path="/parent-notifications" element={<Layout><ParentNotifications /></Layout>} />
                  
                  {/* 404 route */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </Router>
                <Toaster />
                <NetworkErrorHandler />
                </PermissionsProvider>
              </SchoolProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
