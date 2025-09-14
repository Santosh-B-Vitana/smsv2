import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Users, UserCheck, UserX, Clock, Edit, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi, Student } from "@/services/mockApi";

interface AttendanceEntry {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

interface ClassInfo {
  id: string;
  name: string;
  section: string;
  students: Student[];
}

export default function StaffAttendanceTeacher() {
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Mock class assignment for current teacher
        const mockClass: ClassInfo = {
          id: 'CLASS001',
          name: '10',
          section: 'A',
          students: await mockApi.getStudents().then(students => 
            students.filter(s => s.class === '10' && s.section === 'A')
          )
        };
        setClassInfo(mockClass);
        
        // Initialize attendance for all students
        const initialAttendance = mockClass.students.map(student => ({
          studentId: student.id,
          status: 'present' as const,
          reason: ''
        }));
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Failed to fetch class data:", error);
        toast({
          title: "Error",
          description: "Failed to load class data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [toast]);

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late', reason?: string) => {
    setAttendance(prev => prev.map(entry => 
      entry.studentId === studentId 
        ? { ...entry, status, reason: reason || '' }
        : entry
    ));
  };

  const handleStatusChange = (student: Student, status: 'present' | 'absent' | 'late') => {
    if (status === 'absent' || status === 'late') {
      setSelectedStudent({ id: student.id, name: student.name });
      setReason('');
      setShowReasonDialog(true);
    } else {
      updateAttendance(student.id, status);
    }
  };

  const handleReasonSubmit = () => {
    if (selectedStudent) {
      const currentEntry = attendance.find(a => a.studentId === selectedStudent.id);
      const status = currentEntry?.status === 'late' ? 'late' : 'absent';
      updateAttendance(selectedStudent.id, status, reason);
      setShowReasonDialog(false);
      setSelectedStudent(null);
      setReason('');
    }
  };

  const saveAttendance = async () => {
    if (!classInfo) return;
    
    try {
      await mockApi.markStudentAttendanceByTeacher(
        classInfo.id,
        selectedDate,
        attendance
      );
      
      toast({
        title: "Success",
        description: "Attendance saved successfully"
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCounts = () => {
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    return { present, absent, late, total: attendance.length };
  };

  const stats = getStatusCounts();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!classInfo) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No class assigned to you</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Student Attendance</h1>
          <p className="text-muted-foreground">Mark attendance for Class {classInfo.name}-{classInfo.section}</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          {isEditing ? (
            <div className="flex gap-2">
              <Button onClick={saveAttendance}>
                <Save className="h-4 w-4 mr-2" />
                Save Attendance
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Take Attendance
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Class {classInfo.name}-{classInfo.section} Attendance - {selectedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
                {isEditing && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {classInfo.students.map((student) => {
                const attendanceEntry = attendance.find(a => a.studentId === student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(attendanceEntry?.status || 'present')}>
                        {attendanceEntry?.status || 'present'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {attendanceEntry?.reason && (
                        <span className="text-sm text-muted-foreground">
                          {attendanceEntry.reason}
                        </span>
                      )}
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant={attendanceEntry?.status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(student, 'present')}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceEntry?.status === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusChange(student, 'absent')}
                          >
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={attendanceEntry?.status === 'late' ? 'secondary' : 'outline'}
                            onClick={() => handleStatusChange(student, 'late')}
                          >
                            Late
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reason for {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for absence/late arrival</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason..."
                className="min-h-20"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowReasonDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReasonSubmit} disabled={!reason.trim()}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}