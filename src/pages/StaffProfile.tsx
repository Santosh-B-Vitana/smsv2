import { UserCheck, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StaffIdCardTemplate } from "@/components/id-cards/StaffIdCardTemplate";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// ...existing code...
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  FileText, 
  CreditCard, 
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  RotateCcw
} from "lucide-react";
import { mockApi, Staff } from "@/services/mockApi";
import { useToast } from "@/hooks/use-toast";
import placeholderImg from '/placeholder.svg';

export default function StaffProfile() {
  // Late dialog state
  const [lateDialog, setLateDialog] = useState<{ open: boolean; index?: number }>({ open: false });
  const [lateReason, setLateReason] = useState("");
  // Leave dialog calendar state
  const [leaveEndDate, setLeaveEndDate] = useState<Date | null>(null);
  // Leave dialog calendar state
  const [leaveStartDate, setLeaveStartDate] = useState<Date | null>(null);
  // Leave dialog calendar state
  const [leaveDates, setLeaveDates] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  // Leave dialog state
  const [leaveDialog, setLeaveDialog] = useState<{ open: boolean; index?: number }>({ open: false });
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState("");
  // Attendance tab state (moved from inline function)
  const [calendarDate, setCalendarDate] = useState("");
  const [editDialog, setEditDialog] = useState<{ open: boolean; index?: number }>({ open: false });
  const [editStatus, setEditStatus] = useState("Present");
  const [editComment, setEditComment] = useState("");
  const [mockAttendance, setMockAttendance] = useState([
    { date: "2025-09-01", status: "Present", method: "manual", comment: "" },
    { date: "2025-09-02", status: "Absent", method: "manual", comment: "Sick leave" },
    { date: "2025-09-03", status: "Late", method: "manual", comment: "Traffic" },
    { date: "2025-09-04", status: "Present", method: "manual", comment: "" },
  ]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !staff) return;
    try {
      const dataUrl = await mockApi.uploadStaffPhoto(staff.id, file);
      setStaff({ ...staff, photoUrl: dataUrl });
      toast({ title: "Photo updated", description: "Staff photo saved successfully" });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload failed", description: "Could not save photo", variant: "destructive" });
    }
  };

  // Mock data for additional tabs
  const mockClasses = [
    { class: "10-A", subject: "Mathematics", students: 32 },
    { class: "10-B", subject: "Mathematics", students: 30 },
    { class: "9-A", subject: "Algebra", students: 35 },
  ];

  const mockSchedule = [
    { day: "Monday", time: "09:00-10:00", class: "10-A", subject: "Mathematics" },
    { day: "Monday", time: "11:00-12:00", class: "10-B", subject: "Mathematics" },
    { day: "Tuesday", time: "10:00-11:00", class: "9-A", subject: "Algebra" },
    { day: "Wednesday", time: "09:00-10:00", class: "10-A", subject: "Mathematics" },
  ];

  const mockDocuments = [
    { name: "Resume", type: "PDF", uploadDate: "2024-01-01" },
    { name: "Teaching Certificate", type: "PDF", uploadDate: "2024-01-01" },
    { name: "ID Proof", type: "PDF", uploadDate: "2024-01-01" },
  ];

  useEffect(() => {
    if (id) {
      fetchStaff();
    }
  }, [id]);

  const fetchStaff = async () => {
    if (!id) return;
    try {
      const staffList = await mockApi.getStaff();
      const staffMember = staffList.find(s => s.id === id);
      setStaff(staffMember || null);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      toast({
        title: "Error",
        description: "Failed to load staff profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
    if (!staff) return;
    setActionLoading(true);
    try {
      await mockApi.updateStaff(staff.id, { status: newStatus });
      setStaff({ ...staff, status: newStatus });
      toast({
        title: "Success",
        description: `Staff ${newStatus === 'active' ? 'reactivated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const handleDocumentGeneration = (type: string) => {
    if (type === "ID Card") {
      setIdCardDialogOpen(true);
      return;
    }
    toast({
      title: "Generating Document",
      description: `${type} is being generated and will be downloaded shortly`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading staff profile...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 mb-4">Staff member not found</div>
        <Button onClick={() => navigate("/staff")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff
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
            onClick={() => navigate("/staff")} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Staff Profile</h1>
            <p className="text-muted-foreground">Complete staff information and records</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate(`/staff/${staff.id}/edit`)}
            variant="default"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          
          {staff.status === 'active' ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange('inactive')}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange('active')}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reactivate
            </Button>
          )}
        </div>
      </div>

      {/* Staff Basic Info Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border border-gray-300 mb-4">
                {staff.photoUrl ? (
                  <img src={staff.photoUrl} alt={staff.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={placeholderImg} alt="No photo" className="w-full h-full object-cover opacity-60" />
                )}
              </div>
              <label htmlFor="staff-photo-upload" className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer font-semibold text-base block border-2 border-blue-800">
                Upload Recent Photo
                <input
                  id="staff-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              <Badge variant={staff.status === 'active' ? 'default' : 'secondary'} className="mb-2">
                {staff.status}
              </Badge>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Personal Details
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="font-semibold text-lg">{staff.name}</div>
                      <div className="text-sm text-muted-foreground">Staff ID: {staff.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <div className="text-sm">{staff.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <div className="text-sm">{staff.phone}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                      <div className="text-sm">{staff.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Briefcase className="h-4 w-4" />
                    Professional Details
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">Designation</div>
                      <div className="text-sm">{staff.designation}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Department</div>
                      <div className="text-sm">{staff.department}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Experience</div>
                      <div className="text-sm">{staff.experience || 0} years</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Qualification</div>
                      <div className="text-sm">{staff.qualification || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Employment Details
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">Joining Date</div>
                      <div className="text-sm">{staff.joiningDate}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Employment Type</div>
                      <div className="text-sm">Full-time</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Salary</div>
                      <div className="text-sm">₹{staff.salary?.toLocaleString() || 'Not set'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="classes" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 min-w-[600px]">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            {/* Hide Schedule tab for now */}
            {false && <TabsTrigger value="schedule">Schedule</TabsTrigger>}
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-4 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Filter by Date:</span>
                    <input type="date" className="border rounded px-2 py-1" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} />
                    <Button variant="outline" size="sm" onClick={() => setCalendarDate("")}>Clear</Button>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setLeaveDialog({ open: true, index: 0 })}>
                    Leave Management
                  </Button>
                </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(calendarDate
                      ? mockAttendance.filter(record => record.date === calendarDate)
                      : mockAttendance
                    ).map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'Present' ? 'default' :
                            record.status === 'Late' ? 'secondary' :
                            record.status === 'Excused' ? 'outline' :
                            'destructive'
                          }>
                            {record.status === 'Absent' ? 'On Leave' : record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{record.method}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <Button variant={record.status === 'Present' ? 'default' : 'ghost'} size="icon" title="Mark Present" onClick={() => {
                              setMockAttendance(prev => prev.map((rec, idx) => idx === index ? { ...rec, status: 'Present', comment: '' } : rec));
                            }}>
                              <UserCheck className={record.status === 'Present' ? 'text-green-600' : 'text-muted-foreground'} />
                            </Button>
                            <Button variant={record.status === 'Absent' ? 'destructive' : 'ghost'} size="icon" title="Mark On Leave" onClick={() => {
                              setLeaveDialog({ open: true, index });
                            }}>
                              <Calendar className={record.status === 'Absent' ? 'text-yellow-600' : 'text-muted-foreground'} />
                            </Button>
              {/* Leave Dialog */}
              {leaveDialog.open && (
                <Dialog open={leaveDialog.open} onOpenChange={open => setLeaveDialog({ ...leaveDialog, open })}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark On Leave</DialogTitle>
                    </DialogHeader>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Number of Days</label>
                      <input type="number" min={1} className="w-full border rounded px-2 py-1" value={leaveDays} onChange={e => setLeaveDays(Number(e.target.value))} placeholder="Enter days..." />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Select Date{leaveDays > 1 ? ' Range' : ''}</label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="w-full border rounded px-2 py-1"
                          value={leaveStartDate ? leaveStartDate.toISOString().split('T')[0] : ''}
                          onChange={e => setLeaveStartDate(e.target.value ? new Date(e.target.value) : null)}
                        />
                        {leaveDays > 1 && (
                          <input
                            type="date"
                            className="w-full border rounded px-2 py-1"
                            value={leaveEndDate ? leaveEndDate.toISOString().split('T')[0] : ''}
                            onChange={e => setLeaveEndDate(e.target.value ? new Date(e.target.value) : null)}
                            min={leaveStartDate ? leaveStartDate.toISOString().split('T')[0] : ''}
                          />
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Reason</label>
                      <input type="text" className="w-full border rounded px-2 py-1" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} placeholder="Enter reason..." />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setLeaveDialog({ open: false })}>Cancel</Button>
                      <Button onClick={() => {
                        if (typeof leaveDialog.index === 'number') {
                          let comment = '';
                          if (leaveDays > 1 && leaveStartDate && leaveEndDate) {
                            comment = `On Leave: ${leaveDays} day(s), ${leaveStartDate.toLocaleDateString()} - ${leaveEndDate.toLocaleDateString()}, Reason: ${leaveReason}`;
                          } else if (leaveStartDate) {
                            comment = `On Leave: 1 day, ${leaveStartDate.toLocaleDateString()}, Reason: ${leaveReason}`;
                          }
                          setMockAttendance(prev => prev.map((rec, idx) => idx === leaveDialog.index ? { ...rec, status: 'Absent', comment } : rec));
                        }
                        setLeaveDialog({ open: false });
                        setLeaveStartDate(null);
                        setLeaveEndDate(null);
                        setLeaveDays(1);
                        setLeaveReason("");
                      }}>Approve</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
                            <Button variant={record.status === 'Late' ? 'secondary' : 'ghost'} size="icon" title="Mark Late" onClick={() => {
                              setLateDialog({ open: true, index });
                            }}>
                              <Clock className={record.status === 'Late' ? 'text-orange-600' : 'text-muted-foreground'} />
                            </Button>
              {/* Late Dialog */}
              {lateDialog.open && (
                <Dialog open={lateDialog.open} onOpenChange={open => setLateDialog({ ...lateDialog, open })}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mark Late</DialogTitle>
                    </DialogHeader>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Reason (optional)</label>
                      <input type="text" className="w-full border rounded px-2 py-1" value={lateReason} onChange={e => setLateReason(e.target.value)} placeholder="Enter reason..." />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setLateDialog({ open: false })}>Cancel</Button>
                      <Button onClick={() => {
                        if (typeof lateDialog.index === 'number') {
                          setMockAttendance(prev => prev.map((rec, idx) => idx === lateDialog.index ? { ...rec, status: 'Late', comment: lateReason } : rec));
                        }
                        setLateDialog({ open: false });
                        setLateReason("");
                      }}>Approve</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
                            <Button variant="outline" size="icon" title="Edit" onClick={() => setEditDialog({ open: true, index })}>
                              <Edit className="text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Edit Dialog */}
              {editDialog.open && (
                <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ ...editDialog, open })}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Take Attendance</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mb-2">
                      <Button variant={editStatus === 'Present' ? 'default' : 'outline'} onClick={() => setEditStatus('Present')}>Present</Button>
                      <Button variant={editStatus === 'Absent' ? 'destructive' : 'outline'} onClick={() => setEditStatus('Absent')}>On Leave</Button>
                      <Button variant={editStatus === 'Late' ? 'secondary' : 'outline'} onClick={() => setEditStatus('Late')}>Late</Button>
                    </div>
                    {(editStatus === 'Absent' || editStatus === 'Late') && (
                      <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Reason (optional)</label>
                        <input type="text" className="w-full border rounded px-2 py-1" value={editComment} onChange={e => setEditComment(e.target.value)} placeholder="Enter reason..." />
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditDialog({ open: false })}>Cancel</Button>
                      <Button onClick={() => {
                        if (typeof editDialog.index === 'number') {
                          setMockAttendance(prev => prev.map((rec, idx) => idx === editDialog.index ? { ...rec, status: editStatus, comment: editComment } : rec));
                        }
                        setEditDialog({ open: false });
                      }}>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        </div>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Assigned Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClasses.map((cls, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cls.class}</TableCell>
                        <TableCell>{cls.subject}</TableCell>
                        <TableCell>{cls.students}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSchedule.map((schedule, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{schedule.day}</TableCell>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.class}</TableCell>
                        <TableCell>{schedule.subject}</TableCell>
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
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => handleDocumentGeneration("ID Card")}
                  >
                    <CreditCard className="h-6 w-6 mb-2" />
                    Generate ID Card
                  </Button>
                  <Dialog open={idCardDialogOpen} onOpenChange={setIdCardDialogOpen}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Staff ID Card Preview</DialogTitle>
                      </DialogHeader>
                      {staff && <StaffIdCardTemplate staff={staff} />}
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t print:hidden">
                        <Button variant="outline" onClick={() => setIdCardDialogOpen(false)}>
                          Close
                        </Button>
                        <Button onClick={() => window.print()}>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => handleDocumentGeneration("Experience Certificate")}
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Experience Certificate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => handleDocumentGeneration("Salary Certificate")}
                  >
                    <Download className="h-6 w-6 mb-2" />
                    Salary Certificate
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Uploaded Documents</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockDocuments.map((doc, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>{doc.uploadDate}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Certificates & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No certificates available</p>
                <p className="text-sm">Teaching certificates and achievements will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Performance Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No performance reviews available</p>
                <p className="text-sm">Performance evaluations and feedback will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}