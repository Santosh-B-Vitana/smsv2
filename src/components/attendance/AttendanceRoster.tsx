import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar,
  CheckCircle, 
  XCircle, 
  Timer, 
  AlertCircle,
  Download,
  Save
} from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  photoUrl?: string;
}

interface AttendanceRosterProps {
  classId: string;
  students: Student[];
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
  reason?: string;
}

export default function AttendanceRoster({ classId, students }: AttendanceRosterProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceEntry>>({});
  const [saving, setSaving] = useState(false);

  const handleStatusChange = (studentId: string, status: AttendanceStatus, reason?: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
        reason: reason || ''
      }
    }));
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        reason
      }
    }));
  };

  const handleBulkAction = (status: AttendanceStatus) => {
    const bulkAttendance: Record<string, AttendanceEntry> = {};
    students.forEach(student => {
      bulkAttendance[student.id] = {
        studentId: student.id,
        status,
        reason: ''
      };
    });
    setAttendance(bulkAttendance);
    toast.success(`Marked all students as ${status}`);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const attendanceEntries = Object.values(attendance);
      console.log('Saving attendance:', {
        classId,
        date: selectedDate,
        entries: attendanceEntries
      });
      
      toast.success("Attendance saved successfully");
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Timer className="h-4 w-4 text-yellow-600" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: AttendanceStatus): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'present':
        return 'default';
      case 'absent':
        return 'destructive';
      case 'late':
        return 'secondary';
      case 'excused':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Selection and Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction('present')}
          >
            Mark All Present
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction('absent')}
          >
            Mark All Absent
          </Button>
          <Button
            size="sm"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Import from Biometric
          </Button>
        </div>
      </div>

      {/* Attendance Roster */}
      <div className="space-y-3">
        {students.map((student) => {
          const currentAttendance = attendance[student.id];
          
          return (
            <Card key={student.id} className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Student Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {student.photoUrl ? (
                      <img 
                        src={student.photoUrl} 
                        alt={student.name} 
                        className="w-full h-full object-cover rounded-full" 
                      />
                    ) : (
                      <span className="text-sm font-medium">{student.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{student.name}</div>
                    <div className="text-sm text-muted-foreground">Roll No: {student.rollNo}</div>
                  </div>
                </div>

                {/* Status Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={currentAttendance?.status === status ? getStatusVariant(status) : "outline"}
                      onClick={() => handleStatusChange(student.id, status)}
                      className="flex items-center gap-2"
                    >
                      {getStatusIcon(status)}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Reason Input (shown if absent, late, or excused) */}
                {currentAttendance?.status && currentAttendance.status !== 'present' && (
                  <Input
                    placeholder="Reason (optional)"
                    value={currentAttendance.reason || ''}
                    onChange={(e) => handleReasonChange(student.id, e.target.value)}
                    className="w-40 flex-shrink-0"
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          {Object.keys(attendance).length} of {students.length} students marked
        </div>
        <Button 
          onClick={handleSaveAttendance}
          disabled={saving || Object.keys(attendance).length === 0}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>
    </div>
  );
}