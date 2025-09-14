import { useEffect, useState } from "react";
import { mockApi } from "../services/mockApi";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    standard: "",
    section: "",
    academicYear: "",
    classTeacher: ""
  });

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const cls = await mockApi.getClass(classId);
        if (cls) {
          setClassInfo({
            ...cls,
            students: Array.isArray((cls as any).students) ? (cls as any).students : []
          });
          setEditForm({
            standard: cls.standard,
            section: cls.section,
            academicYear: cls.academicYear,
            classTeacher: cls.classTeacher || ""
          });
        } else {
          setClassInfo(null);
        }
      } catch (err) {
        setClassInfo(null);
      }
      setLoading(false);
    })();
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
        <div className="text-red-500 mb-4">Class not found for ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{String(classId)}</span></div>
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
        <div className="flex gap-2">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Class Details</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    // Fetch all classes to check for duplicates
                    const allClasses = await mockApi.getClasses();
                    const duplicate = allClasses.find(cls =>
                      cls.id !== classId &&
                      cls.standard === editForm.standard &&
                      cls.section === editForm.section &&
                      cls.academicYear === editForm.academicYear
                    );
                    if (duplicate) {
                      toast.error("Another class with this standard, section, and academic year already exists.");
                      return;
                    }
                    await mockApi.updateClass(classId, {
                      standard: editForm.standard,
                      section: editForm.section,
                      academicYear: editForm.academicYear,
                      classTeacher: editForm.classTeacher
                    });
                    toast.success("Class updated successfully");
                    // Reload class info
                    const updated = await mockApi.getClass(classId);
                    setClassInfo({
                      ...updated,
                      students: Array.isArray((updated as any).students) ? (updated as any).students : []
                    });
                    setEditDialogOpen(false);
                  } catch {
                    toast.error("Failed to update class");
                  }
                }}
              >
                <div>
                  <Label htmlFor="standard">Standard</Label>
                  <Input
                    id="standard"
                    value={editForm.standard}
                    onChange={e => setEditForm(f => ({ ...f, standard: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={editForm.section}
                    onChange={e => setEditForm(f => ({ ...f, section: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={editForm.academicYear}
                    onChange={e => setEditForm(f => ({ ...f, academicYear: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="classTeacher">Class Teacher</Label>
                  <Input
                    id="classTeacher"
                    value={editForm.classTeacher}
                    onChange={e => setEditForm(f => ({ ...f, classTeacher: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Update</Button>
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
          <TabsList className="grid w-full grid-cols-5 min-w-[500px]">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
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