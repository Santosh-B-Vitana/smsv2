import { UserCheck, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StaffIdCardTemplate } from "@/components/id-cards/StaffIdCardTemplate";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayrollManager } from "@/components/payroll/PayrollManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { IdCardTemplate } from "@/components/id-cards/IdCardTemplate";
import { ExperienceCertificateTemplate } from "@/components/certificates/ExperienceCertificateTemplate";
import { SalaryCertificateTemplate } from "@/components/certificates/SalaryCertificateTemplate";
import { useToast } from "@/hooks/use-toast";
import placeholderImg from '/placeholder.svg';
import { useLanguage } from "@/contexts/LanguageContext";

export default function StaffProfile() {
  // Late dialog state
  const [lateDialog, setLateDialog] = useState<{ open: boolean; index?: number }>({ open: false });
  const [lateReason, setLateReason] = useState("");
  // Leave dialog calendar state
  const [leaveEndDate, setLeaveEndDate] = useState<Date | null>(null);
  const [leaveStartDate, setLeaveStartDate] = useState<Date | null>(null);
  const [leaveDates, setLeaveDates] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  // Leave dialog state
  const [leaveDialog, setLeaveDialog] = useState<{ open: boolean; index?: number }>({ open: false });
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState("");
  // Attendance tab state
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
  const { t } = useLanguage();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !staff) return;
    try {
      const dataUrl = await mockApi.uploadStaffPhoto(staff.id, file);
      setStaff({ ...staff, photoUrl: dataUrl });
      toast({ title: t('staffProfilePage.photoUpdated'), description: t('staffProfilePage.photoSavedSuccess') });
    } catch (err) {
      console.error(err);
      toast({ title: t('staffProfilePage.uploadFailed'), description: t('staffProfilePage.couldNotSavePhoto'), variant: "destructive" });
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

  // State for document dialogs
  const [showIdCardDialog, setShowIdCardDialog] = useState(false);
  const [showExperienceCertDialog, setShowExperienceCertDialog] = useState(false);
  const [showSalaryCertDialog, setShowSalaryCertDialog] = useState(false);

  const handleDocumentGeneration = (type: string) => {
    if (type === "ID Card") {
      setShowIdCardDialog(true);
    } else if (type === "Experience Certificate") {
      setShowExperienceCertDialog(true);
    } else if (type === "Salary Certificate") {
      setShowSalaryCertDialog(true);
    }
  };

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
        title: t('staffProfilePage.errorTitle'),
        description: t('staffProfilePage.failedToLoad'),
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
        title: t('staffProfilePage.successTitle'),
        description: newStatus === 'active' ? t('staffProfilePage.reactivatedSuccess') : t('staffProfilePage.deactivatedSuccess'),
      });
    } catch (error) {
      toast({
        title: t('staffProfilePage.errorTitle'),
        description: t('staffProfilePage.failedToUpdate'),
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('staffProfilePage.loadingProfile')}</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 mb-4">{t('staffProfilePage.staffNotFound')}</div>
        <Button onClick={() => navigate("/staff")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('staffProfilePage.backToStaff')}
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
            {t('staffProfilePage.back')}
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{t('staffProfilePage.title')}</h1>
            <p className="text-muted-foreground">{t('staffProfilePage.completeInfo')}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate(`/staff/${staff.id}/edit`)}
            variant="default"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('staffProfilePage.editProfile')}
          </Button>
          
          {staff.status === 'active' ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange('inactive')}
            >
              {t('staffProfilePage.deactivate')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange('active')}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('staffProfilePage.reactivate')}
            </Button>
          )}
        </div>
      </div>

      {/* Staff Basic Info Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border border-gray-300 mb-2 flex items-center justify-center">
                {staff.photoUrl ? (
                  <img src={staff.photoUrl} alt={staff.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={placeholderImg} alt="No photo" className="w-full h-full object-cover opacity-60" />
                )}
              </div>
              <label htmlFor="staff-photo-upload" className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer font-semibold text-base block border-2 border-blue-800">
                {t('staffProfilePage.uploadPhoto')}
                <input
                  id="staff-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              <Badge variant={staff.status === 'active' ? 'default' : 'secondary'} className="mt-2 mb-2">
                {staff.status === 'active' ? t('common.active') : t('common.inactive')}
              </Badge>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    {t('staffProfilePage.personalDetails')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="font-semibold text-lg">{staff.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {staff.id}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.phone')}</div>
                      <div className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {staff.phone}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.email')}</div>
                      <div className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {staff.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Briefcase className="h-4 w-4" />
                    {t('staffProfilePage.professionalDetails')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.designation')}</div>
                      <div className="text-sm">{staff.designation}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.department')}</div>
                      <div className="text-sm">{staff.department}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.experience')}</div>
                      <div className="text-sm">{staff.experience} {t('staffProfilePage.years')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    {t('staffProfilePage.contactInfo')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.address')}</div>
                      <div className="text-sm">{staff.address}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('staffProfilePage.emergencyContact')}</div>
                      <div className="text-sm">{staff.phone}</div>
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
        <div className="tabs-list-container overflow-x-auto">
          <TabsList className="tabs-list grid w-full grid-cols-3 lg:grid-cols-6 min-w-[600px] md:min-w-[720px]">
            <TabsTrigger value="classes" className="tabs-trigger">{t('staffProfilePage.classes')}</TabsTrigger>
            <TabsTrigger value="attendance" className="tabs-trigger">{t('staffProfilePage.attendance')}</TabsTrigger>
            <TabsTrigger value="payroll" className="tabs-trigger">{t('staffProfilePage.payroll')}</TabsTrigger>
            <TabsTrigger value="documents" className="tabs-trigger">{t('staffProfilePage.documents')}</TabsTrigger>
            <TabsTrigger value="certificates" className="tabs-trigger">{t('staffProfilePage.certificates')}</TabsTrigger>
            <TabsTrigger value="performance" className="tabs-trigger">{t('staffProfilePage.performance')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t('staffProfilePage.assignedClasses')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('staffProfilePage.class')}</TableHead>
                      <TableHead>{t('staffProfilePage.subject')}</TableHead>
                      <TableHead>{t('staffProfilePage.students')}</TableHead>
                      <TableHead>{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClasses.map((classInfo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{classInfo.class}</TableCell>
                        <TableCell>{classInfo.subject}</TableCell>
                        <TableCell>{classInfo.students}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Attendance Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAttendance.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === 'Present' ? 'default' :
                            record.status === 'Late' ? 'secondary' :
                            'destructive'
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.method}</TableCell>
                        <TableCell>{record.comment || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditDialog({ open: true, index });
                              setEditStatus(record.status);
                              setEditComment(record.comment || '');
                            }}
                          >
                            <Edit className="h-4 w-4" />
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
          {/* ID Card Dialog */}
          {showIdCardDialog && staff && (
            <Dialog open={showIdCardDialog} onOpenChange={setShowIdCardDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Staff ID Card Preview</DialogTitle>
                </DialogHeader>
                <div className="print-container">
                  <IdCardTemplate 
                    person={staff}
                    type="staff"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4 print:hidden">
                  <Button variant="outline" onClick={() => setShowIdCardDialog(false)}>
                    Close
                  </Button>
                  <Button onClick={() => window.print()}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Experience Certificate Dialog */}
          {showExperienceCertDialog && staff && (
            <Dialog open={showExperienceCertDialog} onOpenChange={setShowExperienceCertDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Experience Certificate</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <ExperienceCertificateTemplate
                    staffName={staff.name}
                    designation={staff.designation}
                    department={staff.department}
                    employeeId={staff.id}
                    joiningDate="01/04/2020"
                    relievingDate={new Date().toLocaleDateString()}
                    workDuration="5 years"
                    responsibilities={[
                      "Teaching assigned subjects to students",
                      "Conducting regular assessments and evaluations",
                      "Maintaining student records and progress reports",
                      "Participating in school events and activities"
                    ]}
                    performance="Excellent"
                    issueDate={new Date().toLocaleDateString()}
                    certificateNumber={`EXP${Date.now().toString().slice(-6)}`}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Salary Certificate Dialog */}
          {showSalaryCertDialog && staff && (
            <Dialog open={showSalaryCertDialog} onOpenChange={setShowSalaryCertDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Salary Certificate</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <SalaryCertificateTemplate
                    staffName={staff.name}
                    designation={staff.designation}
                    department={staff.department}
                    employeeId={staff.id}
                    joiningDate="01/04/2020"
                    basicSalary="45,000"
                    allowances="8,000"
                    totalSalary="53,000"
                    issueDate={new Date().toLocaleDateString()}
                    certificateNumber={`SAL${Date.now().toString().slice(-6)}`}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 document-grid">
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center document-button"
                  onClick={() => handleDocumentGeneration("ID Card")}
                >
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Generate ID Card</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center document-button"
                  onClick={() => handleDocumentGeneration("Experience Certificate")}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Experience Certificate</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center document-button"
                  onClick={() => handleDocumentGeneration("Salary Certificate")}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Salary Certificate</span>
                </Button>
              </div>

              {/* Uploaded Documents Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  {mockDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.type} • {doc.uploadDate}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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

        <TabsContent value="payroll">
          <PayrollManager staffId={staff?.id} />
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

      {/* Edit Attendance Dialog */}
      {editDialog.open && (
        <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Attendance Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <select 
                  className="w-full mt-1 p-2 border rounded-md"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Comment</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Optional comment..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialog({ open: false })}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (editDialog.index !== undefined) {
                      const updatedAttendance = [...mockAttendance];
                      updatedAttendance[editDialog.index] = {
                        ...updatedAttendance[editDialog.index],
                        status: editStatus,
                        comment: editComment
                      };
                      setMockAttendance(updatedAttendance);
                    }
                    setEditDialog({ open: false });
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}