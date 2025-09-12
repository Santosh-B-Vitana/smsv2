
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Calendar, Target, Award } from "lucide-react";

interface AnalyticsData {
  studentPerformance: Array<{
    month: string;
    average: number;
    topPerformers: number;
    needsImprovement: number;
  }>;
  attendanceTrends: Array<{
    date: string;
    attendance: number;
    target: number;
  }>;
  financialMetrics: Array<{
    month: string;
    collected: number;
    pending: number;
    overdue: number;
  }>;
  subjectWisePerformance: Array<{
    subject: string;
    average: number;
    students: number;
  }>;
  classWiseStats: Array<{
    class: string;
    students: number;
    avgAttendance: number;
    avgMarks: number;
  }>;
}

export function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    studentPerformance: [
      { month: 'Apr', average: 82, topPerformers: 45, needsImprovement: 12 },
      { month: 'May', average: 85, topPerformers: 52, needsImprovement: 8 },
      { month: 'Jun', average: 88, topPerformers: 58, needsImprovement: 6 },
      { month: 'Jul', average: 84, topPerformers: 48, needsImprovement: 10 },
      { month: 'Aug', average: 87, topPerformers: 55, needsImprovement: 7 },
      { month: 'Sep', average: 90, topPerformers: 62, needsImprovement: 5 }
    ],
    attendanceTrends: [
      { date: '2024-01-01', attendance: 92, target: 95 },
      { date: '2024-01-02', attendance: 88, target: 95 },
      { date: '2024-01-03', attendance: 94, target: 95 },
      { date: '2024-01-04', attendance: 91, target: 95 },
      { date: '2024-01-05', attendance: 96, target: 95 },
      { date: '2024-01-06', attendance: 89, target: 95 },
      { date: '2024-01-07', attendance: 93, target: 95 }
    ],
    financialMetrics: [
      { month: 'Apr', collected: 450000, pending: 50000, overdue: 25000 },
      { month: 'May', collected: 480000, pending: 40000, overdue: 30000 },
      { month: 'Jun', collected: 520000, pending: 35000, overdue: 20000 },
      { month: 'Jul', collected: 490000, pending: 60000, overdue: 35000 },
      { month: 'Aug', collected: 510000, pending: 45000, overdue: 25000 },
      { month: 'Sep', collected: 535000, pending: 30000, overdue: 15000 }
    ],
    subjectWisePerformance: [
      { subject: 'Mathematics', average: 78, students: 120 },
      { subject: 'English', average: 85, students: 120 },
      { subject: 'Science', average: 82, students: 120 },
      { subject: 'History', average: 88, students: 120 },
      { subject: 'Geography', average: 80, students: 120 }
    ],
    classWiseStats: [
      { class: 'Class 9', students: 45, avgAttendance: 92, avgMarks: 82 },
      { class: 'Class 10', students: 50, avgAttendance: 94, avgMarks: 85 },
      { class: 'Class 11', students: 40, avgAttendance: 89, avgMarks: 79 },
      { class: 'Class 12', students: 35, avgAttendance: 91, avgMarks: 88 }
    ]
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState("6months");
  const [selectedClass, setSelectedClass] = useState("all");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Calculate key metrics
  const currentMonthData = analyticsData.studentPerformance[analyticsData.studentPerformance.length - 1];
  const previousMonthData = analyticsData.studentPerformance[analyticsData.studentPerformance.length - 2];
  
  const performanceGrowthValue = ((currentMonthData.average - previousMonthData.average) / previousMonthData.average * 100);
  const performanceGrowth = performanceGrowthValue.toFixed(1);
  const totalStudents = analyticsData.classWiseStats.reduce((sum, cls) => sum + cls.students, 0);
  const avgAttendance = (analyticsData.classWiseStats.reduce((sum, cls) => sum + cls.avgAttendance, 0) / analyticsData.classWiseStats.length).toFixed(1);
  
  const currentFinancials = analyticsData.financialMetrics[analyticsData.financialMetrics.length - 1];
  const collectionRate = ((currentFinancials.collected / (currentFinancials.collected + currentFinancials.pending + currentFinancials.overdue)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="9">Class 9</SelectItem>
              <SelectItem value="10">Class 10</SelectItem>
              <SelectItem value="11">Class 11</SelectItem>
              <SelectItem value="12">Class 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+5.2%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">{currentMonthData.average}%</p>
                <div className="flex items-center gap-1 mt-1">
                  {performanceGrowthValue >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${performanceGrowthValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {performanceGrowthValue > 0 ? '+' : ''}{performanceGrowth}%
                  </span>
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">{avgAttendance}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Target: 95%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fee Collection</p>
                <p className="text-2xl font-bold">{collectionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+2.1%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Trends</TabsTrigger>
          <TabsTrigger value="financial">Financial Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.studentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="topPerformers" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.subjectWisePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="average" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Class-wise Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Class</th>
                      <th className="text-left p-2">Students</th>
                      <th className="text-left p-2">Avg Attendance</th>
                      <th className="text-left p-2">Avg Marks</th>
                      <th className="text-left p-2">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.classWiseStats.map((stat, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{stat.class}</td>
                        <td className="p-2">{stat.students}</td>
                        <td className="p-2">{stat.avgAttendance}%</td>
                        <td className="p-2">{stat.avgMarks}%</td>
                        <td className="p-2">
                          <Badge variant={stat.avgMarks >= 85 ? 'default' : stat.avgMarks >= 75 ? 'secondary' : 'destructive'}>
                            {stat.avgMarks >= 85 ? 'Excellent' : stat.avgMarks >= 75 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends vs Target</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.attendanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="attendance" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="target" stroke="#ff7300" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Collection Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.financialMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="collected" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="pending" stackId="a" fill="#ffc658" />
                  <Bar dataKey="overdue" stackId="a" fill="#ff7c7c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Academic Performance Forecast</h4>
                  <p className="text-sm text-blue-700 mt-2">
                    Based on current trends, Class 10 students are likely to achieve 92% average marks in final exams.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Improvement Opportunities</h4>
                  <p className="text-sm text-green-700 mt-2">
                    Mathematics scores show potential for 15% improvement with additional practice sessions.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Risk Alert</h4>
                  <p className="text-sm text-yellow-700 mt-2">
                    12 students show declining attendance patterns and may need intervention.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Boost Mathematics Performance</h5>
                      <p className="text-sm text-muted-foreground">Schedule additional practice sessions for struggling students</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Improve Attendance</h5>
                      <p className="text-sm text-muted-foreground">Implement attendance tracking notifications for parents</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium">Fee Collection</h5>
                      <p className="text-sm text-muted-foreground">Send automated reminders for pending fee payments</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
