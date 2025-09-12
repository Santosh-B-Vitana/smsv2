import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  Bell, 
  BookOpen, 
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Award,
  CreditCard,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdatedParentDashboard() {
  const navigate = useNavigate();
  
  // Mock data for parent dashboard
  const childInfo = {
    name: "Arjun Sharma",
    class: "Class 10-A",
    rollNo: "2024001",
    attendance: "92%",
    performance: "Excellent"
  };

  const recentActivities = [
    { type: "Assignment", title: "Math Assignment submitted", time: "2 hours ago", status: "completed" },
    { type: "Exam", title: "Physics Unit Test", time: "Yesterday", status: "completed" },
    { type: "Fee", title: "Monthly fee payment due", time: "3 days", status: "pending" },
    { type: "Event", title: "Science Fair participation", time: "1 week ago", status: "completed" }
  ];

  const upcomingEvents = [
    { title: "Parent-Teacher Meeting", date: "Sept 15, 2025", type: "meeting" },
    { title: "Annual Sports Day", date: "Sept 20, 2025", type: "event" },
    { title: "Half-yearly Exams", date: "Oct 1, 2025", type: "exam" }
  ];

  const notifications = [
    { title: "Fee Payment Reminder", message: "Monthly fee payment is due in 3 days", type: "warning", time: "1 day ago" },
    { title: "Assignment Submitted", message: "Math assignment has been submitted successfully", type: "success", time: "2 hours ago" },
    { title: "Attendance Alert", message: "Please ensure regular attendance", type: "info", time: "3 days ago" },
    { title: "Exam Results", message: "Physics unit test results are available", type: "info", time: "1 week ago" }
  ];

  const feesSummary = {
    totalDue: 15000,
    pendingAmount: 5000,
    nextDueDate: "Sept 15, 2025",
    status: "pending"
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Parent!</h1>
        <p className="text-muted-foreground">
          Here's an overview of {childInfo.name}'s academic progress and school activities.
        </p>
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student</p>
                <p className="font-semibold">{childInfo.name}</p>
                <p className="text-xs text-muted-foreground">{childInfo.class} • Roll: {childInfo.rollNo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="font-semibold text-green-600">{childInfo.attendance}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance</p>
                <p className="font-semibold text-blue-600">{childInfo.performance}</p>
                <p className="text-xs text-muted-foreground">Overall grade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fees Due</p>
                <p className="font-semibold text-orange-600">₹{feesSummary.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Due: {feesSummary.nextDueDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'Assignment' ? 'bg-blue-100' :
                        activity.type === 'Exam' ? 'bg-purple-100' :
                        activity.type === 'Fee' ? 'bg-orange-100' :
                        'bg-green-100'
                      }`}>
                        {activity.type === 'Assignment' && <BookOpen className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'Exam' && <GraduationCap className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'Fee' && <AlertCircle className="h-4 w-4 text-orange-600" />}
                        {activity.type === 'Event' && <Award className="h-4 w-4 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                      {activity.status === 'completed' ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fees Summary Card */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Fee Summary
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/fees')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-xl font-bold">₹{feesSummary.totalDue.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold text-orange-600">₹{feesSummary.pendingAmount.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Next Due</p>
                  <p className="text-sm font-medium">{feesSummary.nextDueDate}</p>
                  <Button size="sm" className="mt-2 w-full">
                    Pay Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events & Notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className={`mt-1 ${
                        notification.type === 'warning' ? 'text-orange-500' :
                        notification.type === 'success' ? 'text-green-500' :
                        'text-blue-500'
                      }`}>
                        {notification.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                        {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
                        {notification.type === 'info' && <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}