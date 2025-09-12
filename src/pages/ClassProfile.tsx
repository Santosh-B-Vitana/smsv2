import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Users, 
  Calendar,
  Clock,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Timer,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import AttendanceRoster from "@/components/attendance/AttendanceRoster";
import { SubjectsTab } from "@/components/academics/SubjectsTab";

interface ClassInfo {
  id: string;
  standard: string;
  section: string;
  academicYear: string;
  classTeacher: string;
  totalStudents: number;
  students: Array<{
    id: string;
    name: string;
    rollNo: string;
    photoUrl?: string;
  }>;
}

export default function ClassProfile() {
  // Mock timetable for the class
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const timeSlots = [
    { period: 1, start: "09:00", end: "09:40" },
    { period: 2, start: "09:40", end: "10:20" },
    { period: 3, start: "10:40", end: "11:20" },
    { period: 4, start: "11:20", end: "12:00" },
    { period: 5, start: "01:00", end: "01:40" },
    { period: 6, start: "01:40", end: "02:20" },
    { period: 7, start: "02:20", end: "03:00" },
    { period: 8, start: "03:00", end: "03:40" }
  ];
  const timetableEntries = [
    { day: "Monday", period: 1, subject: "Mathematics", teacher: "Ms. Sarah" },
    { day: "Monday", period: 2, subject: "English", teacher: "Mr. John" },
    { day: "Monday", period: 3, subject: "Science", teacher: "Ms. Lisa" },
    { day: "Tuesday", period: 1, subject: "Hindi", teacher: "Ms. Priya" },
    { day: "Tuesday", period: 2, subject: "Mathematics", teacher: "Ms. Sarah" },
    { day: "Wednesday", period: 1, subject: "EVS", teacher: "Mr. Kumar" },
    { day: "Thursday", period: 1, subject: "Games", teacher: "Coach Amit" },
    { day: "Friday", period: 1, subject: "Art", teacher: "Ms. Ritu" },
    { day: "Saturday", period: 1, subject: "Music", teacher: "Mr. Dev" }
  ];
  function getTimetableEntry(day: string, period: number) {
    return timetableEntries.find(e => e.day === day && e.period === period);
  }
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock class data
  const mockClassData: ClassInfo = {
    id: classId || "cls_10a",
    standard: "Class 10",
    section: "A",
    academicYear: "2024-2025",
    classTeacher: "Mrs. Priya Singh",
    totalStudents: 30,
    students: [
      { id: "STU001", name: "Aarav Gupta", rollNo: "001", photoUrl: undefined },
      { id: "STU002", name: "Rohan Mehra", rollNo: "002", photoUrl: undefined },
      { id: "STU003", name: "Ananya Sharma", rollNo: "003", photoUrl: undefined },
    ]
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setClassInfo(mockClassData);
      setLoading(false);
    }, 500);
  }, [classId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading class profile...</p>
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 mb-4">Class not found</div>
        <Button onClick={() => navigate("/academics")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Academics
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => navigate("/academics")} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              {classInfo.standard} - {classInfo.section}
            </h1>
            <p className="text-muted-foreground">
              Class Profile • {classInfo.academicYear}
            </p>
          </div>
        </div>
      </div>

      {/* Class Overview Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Students</div>
                <div className="text-xl font-semibold">{classInfo.totalStudents}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Present Today</div>
                <div className="text-xl font-semibold">28</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Absent Today</div>
                <div className="text-xl font-semibold">2</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Class Teacher</div>
                <div className="text-sm font-medium">{classInfo.classTeacher}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 min-w-[600px]">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="timetable">Timetable</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceRoster classId={classInfo.id} students={classInfo.students} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectsTab classId={classInfo.id} />
        </TabsContent>

        <TabsContent value="timetable">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Class Timetable
              </CardTitle>
              <div className="text-muted-foreground text-sm mt-1">
                Academic Year: {classInfo.academicYear}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Period</TableHead>
                      <TableHead className="w-24">Time</TableHead>
                      {days.map(day => (
                        <TableHead key={day} className="text-center min-w-32">{day}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periods.map(period => {
                      const timeSlot = timeSlots.find(slot => slot.period === period);
                      return (
                        <TableRow key={period}>
                          <TableCell className="font-medium">{period}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {timeSlot ? `${timeSlot.start}-${timeSlot.end}` : "-"}
                          </TableCell>
                          {days.map(day => {
                            const entry = getTimetableEntry(day, period);
                            return (
                              <TableCell key={`${day}-${period}`} className="text-center">
                                {entry ? (
                                  <div className="space-y-1">
                                    <div className="font-medium text-sm">{entry.subject}</div>
                                    <div className="text-xs text-muted-foreground">{entry.teacher}</div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Class Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classInfo.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.rollNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {student.photoUrl ? (
                                <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <span className="text-xs font-medium">{student.name.charAt(0)}</span>
                              )}
                            </div>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/students/${student.id}`)}
                          >
                            Manage Student
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Class Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents available</p>
                <p className="text-sm">Class documents will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Class Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Class settings management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}