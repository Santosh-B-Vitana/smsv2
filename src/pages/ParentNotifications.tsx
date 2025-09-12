import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, AlertCircle, Info, CheckCircle, Archive } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "announcement";
  date: string;
  time: string;
  isRead: boolean;
  category: "academic" | "fees" | "events" | "general";
  priority: "high" | "medium" | "low";
}

export default function ParentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif_001",
      title: "Fee Payment Reminder",
      message: "Monthly fee payment for Alice Johnson is due on September 30th, 2025. Please make the payment to avoid late charges.",
      type: "warning",
      date: "2025-09-10",
      time: "09:30 AM",
      isRead: false,
      category: "fees",
      priority: "high"
    },
    {
      id: "notif_002",
      title: "Parent-Teacher Meeting Scheduled",
      message: "Parent-teacher meeting has been scheduled for September 15th, 2025 at 2:00 PM. Please confirm your attendance.",
      type: "info",
      date: "2025-09-09",
      time: "02:15 PM",
      isRead: false,
      category: "academic",
      priority: "medium"
    },
    {
      id: "notif_003",
      title: "Assignment Submitted Successfully",
      message: "Alice Johnson has successfully submitted the Mathematics assignment for Chapter 5: Quadratic Equations.",
      type: "success",
      date: "2025-09-08",
      time: "04:45 PM",
      isRead: true,
      category: "academic",
      priority: "low"
    },
    {
      id: "notif_004",
      title: "Annual Sports Day Announcement",
      message: "Annual Sports Day will be held on September 20th, 2025. Registration forms have been sent home with students.",
      type: "announcement",
      date: "2025-09-07",
      time: "11:00 AM",
      isRead: false,
      category: "events",
      priority: "medium"
    },
    {
      id: "notif_005",
      title: "Library Book Return Reminder",
      message: "Please return the library book 'Advanced Physics' by September 12th, 2025 to avoid late fees.",
      type: "warning",
      date: "2025-09-06",
      time: "03:20 PM",
      isRead: true,
      category: "general",
      priority: "low"
    },
    {
      id: "notif_006",
      title: "Exam Schedule Released",
      message: "Mid-term examination schedule for Class 10-A has been released. Please check the school portal for detailed timetable.",
      type: "info",
      date: "2025-09-05",
      time: "01:10 PM",
      isRead: true,
      category: "academic",
      priority: "high"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "announcement":
        return <Bell className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  const filteredNotifications = selectedCategory === "all" 
    ? notifications 
    : notifications.filter(notif => notif.category === selectedCategory);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with school announcements and important information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {unreadCount} Unread
          </Badge>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{notifications.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{unreadCount}</p>
            <p className="text-sm text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {notifications.filter(n => n.category === "events").length}
            </p>
            <p className="text-sm text-muted-foreground">Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {notifications.filter(n => n.priority === "high").length}
            </p>
            <p className="text-sm text-muted-foreground">Important</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory}>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-semibold ${!notification.isRead ? 'text-primary' : ''}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {notification.date}
                        </span>
                        <span>{notification.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {notification.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredNotifications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    No notifications found for the selected category.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}