import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  FileText, 
  CreditCard, 
  Users, 
  Calendar,
  Phone,
  MapPin,
  User,
  GraduationCap,
  RotateCcw,
  Award
} from "lucide-react";
import { ParentFeePayment } from "@/components/fees/ParentFeePayment";
import { mockApi, Student } from "@/services/mockApi";

import { Input } from "@/components/ui/input";
import { IdCardTemplate } from "@/components/id-cards/IdCardTemplate";
import { BonafideCertificateTemplate } from "@/components/documents/BonafideCertificateTemplate";
import { ConductCertificateTemplate } from "@/components/documents/ConductCertificateTemplate";
import { TransferCertificateTemplate } from "@/components/documents/TransferCertificateTemplate";
import { CertificateTemplate } from "@/components/documents/CertificateTemplate";
import { ReportCardTemplate } from "@/components/examinations/ReportCardTemplate";
import { useToast } from "@/hooks/use-toast";
import placeholderImg from '/placeholder.svg';
import { useLanguage } from "@/contexts/LanguageContext";

export default function StudentProfile() {
  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await mockApi.uploadStudentPhoto(id as string, file);
      setPhotoPreview(dataUrl);
      if (student) {
        setStudent({ ...student, photoUrl: dataUrl });
      }
      toast({ title: t('studentProfilePage.photoUpdated'), description: t('studentProfilePage.photoSavedSuccess') });
    } catch (err) {
      console.error(err);
      toast({ title: t('studentProfilePage.uploadFailed'), description: t('studentProfilePage.couldNotSavePhoto'), variant: "destructive" });
    }
  };
  // Awards & Achievements dialog state
  const [showAwardDialog, setShowAwardDialog] = useState(false);
  const [awardTitle, setAwardTitle] = useState("");
  const [awardDesc, setAwardDesc] = useState("");
  const [awardDate, setAwardDate] = useState("");
  const [awards, setAwards] = useState<Array<{ title: string; desc: string; date: string }>>([]);

  const handlePrintAward = () => {
    const printContent = `Award/Achievement\nTitle: ${awardTitle}\nDescription: ${awardDesc}\nDate: ${awardDate}`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
    setShowAwardDialog(false);
    setAwardTitle("");
    setAwardDesc("");
    setAwardDate("");
  };

  const handleSaveAward = () => {
    setAwards(prev => [...prev, { title: awardTitle, desc: awardDesc, date: awardDate }]);
    setShowAwardDialog(false);
    setAwardTitle("");
    setAwardDesc("");
    setAwardDate("");
  };
  // State for printable ID card dialog
  const [showIdCardDialog, setShowIdCardDialog] = useState(false);
  // State for manual add dialog
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualType, setManualType] = useState("SMS");
  const [manualMessage, setManualMessage] = useState("");
  const [manualStatus, setManualStatus] = useState("Sent");
  // State for parent communication dialog
  const [showCommDialog, setShowCommDialog] = useState(false);
  const [commType, setCommType] = useState("SMS");
  const [commMessage, setCommMessage] = useState("");
  const [mockCommunications, setMockCommunications] = useState([
    { date: "2024-01-10", type: "SMS", message: "Parent-teacher meeting scheduled", status: "Sent" },
    { date: "2024-01-08", type: "Email", message: "Monthly progress report", status: "Delivered" },
    { date: "2024-01-05", type: "Phone", message: "Discussed academic performance", status: "Completed" },
  ]);
  // Marks tab filter state
  const [selectedExam, setSelectedExam] = useState("Midterm");
  const [selectedYear, setSelectedYear] = useState("2024");
  const examOptions = ["Midterm", "Final", "Unit Test 1", "Unit Test 2"];
  const yearOptions = ["2024", "2023", "2022"];

  // Mock marks API implementation
  function mockMarksApi({ exam, year }) {
    const data = [
      { subject: "Mathematics", marks: 85, total: 100, grade: "A", exam: "Midterm", year: "2024" },
      { subject: "English", marks: 78, total: 100, grade: "B+", exam: "Midterm", year: "2024" },
      { subject: "Science", marks: 92, total: 100, grade: "A+", exam: "Final", year: "2024" },
      { subject: "History", marks: 76, total: 100, grade: "B+", exam: "Final", year: "2024" },
      { subject: "Mathematics", marks: 80, total: 100, grade: "A", exam: "Midterm", year: "2023" },
      { subject: "English", marks: 75, total: 100, grade: "B", exam: "Final", year: "2023" },
    ];
    return data.filter(mark => mark.exam === exam && mark.year === year);
  }
  // Calendar filter state
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState("");
  const [editDialog, setEditDialog] = useState<{ open: boolean, index?: number }>({ open: false });
  const [editStatus, setEditStatus] = useState<string>('Present');
  const [editComment, setEditComment] = useState<string>('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Mock data for additional tabs
  const [mockAttendance, setMockAttendance] = useState([
  { date: "2024-01-15", status: "Present", subject: "Mathematics", comment: "", method: "manual" },
  { date: "2024-01-14", status: "Present", subject: "English", comment: "", method: "biometric" },
  { date: "2024-01-13", status: "Absent", subject: "Science", comment: "Was sick", method: "manual" },
  { date: "2024-01-12", status: "Late", subject: "History", comment: "Traffic delay", method: "biometric" },
  ]);

  const mockMarks = [
    { subject: "Mathematics", marks: 85, total: 100, grade: "A" },
    { subject: "English", marks: 78, total: 100, grade: "B+" },
    { subject: "Science", marks: 92, total: 100, grade: "A+" },
    { subject: "History", marks: 76, total: 100, grade: "B+" },
  ];

  // Mock API for parent communication
  function mockParentCommApi(records) {
    // This can be replaced with a real API call later
    return records;
  }

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    if (!id) return;
    try {
      const data = await mockApi.getStudent(id);
      setStudent(data);
    } catch (error) {
      console.error("Failed to fetch student:", error);
      toast({
        title: t('studentProfilePage.errorTitle'),
        description: t('studentProfilePage.failedToLoad'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive') => {
    if (!student) return;
    setActionLoading(true);
    try {
      await mockApi.updateStudent(student.id, { status: newStatus });
      setStudent({ ...student, status: newStatus });
      toast({
        title: t('studentProfilePage.successTitle'),
        description: newStatus === 'active' ? t('studentProfilePage.reactivatedSuccess') : t('studentProfilePage.deactivatedSuccess'),
      });
    } catch (error) {
      toast({
        title: t('studentProfilePage.errorTitle'),
        description: t('studentProfilePage.failedToUpdate'),
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [certificateType, setCertificateType] = useState<string>("");
  const [showReportCardDialog, setShowReportCardDialog] = useState(false);

  const handleDocumentGeneration = (type: string) => {
    if (type === "ID Card") {
      setShowIdCardDialog(true);
      return;
    }
    
    if (["Bonafide Certificate", "Conduct Certificate", "Character Certificate", "Transfer Certificate"].includes(type)) {
      setCertificateType(type);
      setShowCertificateDialog(true);
      return;
    }
    
    // For other types like Report Card
    const fileName = `${type.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    const fileContent = `This is a mock ${type} for student ${student?.name || ''}.`;
    const blob = new Blob([fileContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: `${type} Generated`,
      description: `Mock ${type} has been downloaded as ${fileName}.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('studentProfilePage.loadingProfile')}</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 mb-4">{t('studentProfilePage.studentNotFound')}</div>
        <Button onClick={() => navigate("/students")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('studentProfilePage.backToStudents')}
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
            onClick={() => navigate("/students")} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('studentProfilePage.back')}
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{t('studentProfilePage.title')}</h1>
            <p className="text-muted-foreground">{t('studentProfilePage.completeInfo')}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate(`/students/${student.id}/edit`)}
            variant="default"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('studentProfilePage.editProfile')}
          </Button>
          
          {student.status === 'active' ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange('inactive')}
            >
              {t('studentProfilePage.deactivate')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={actionLoading}
              onClick={() => handleStatusChange('active')}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('studentProfilePage.reactivate')}
            </Button>
          )}
        </div>
      </div>

      {/* Student Basic Info Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border border-gray-300 mb-2 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                ) : student.photoUrl ? (
                  <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <img src={placeholderImg} alt="No photo" className="w-full h-full object-cover opacity-60" />
                )}
              </div>
              {/* Always visible upload button below photo circle */}
              <label htmlFor="student-photo-upload" className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 cursor-pointer font-semibold text-base block border-2 border-blue-800">
                {t('studentProfilePage.uploadPhoto')}
                <input
                  id="student-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="mt-2 mb-2">
                {student.status === 'active' ? t('common.active') : t('common.inactive')}
              </Badge>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    {t('studentProfilePage.personalDetails')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="font-semibold text-lg">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{t('studentProfilePage.rollNo')}: {student.rollNo}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('studentProfilePage.dateOfBirth')}</div>
                      <div className="text-sm">{student.dob}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('studentProfilePage.category')}</div>
                      <div className="text-sm">{student.category}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <GraduationCap className="h-4 w-4" />
                    {t('studentProfilePage.academicDetails')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">{t('studentProfilePage.classSection')}</div>
                      <div className="text-sm">{student.class}-{student.section}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t('studentProfilePage.admissionDate')}</div>
                      <div className="text-sm">{student.admissionDate}</div>
                    </div>
                    {student.previousSchool && (
                      <div>
                        <div className="text-sm font-medium">{t('studentProfilePage.previousSchool')}</div>
                        <div className="text-sm">{student.previousSchool}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    {t('studentProfilePage.guardianDetails')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium">{t('studentProfilePage.guardianName')}</div>
                      <div className="text-sm">{student.guardianName}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <div className="text-sm">{student.guardianPhone}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                      <div className="text-sm">{student.address}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <div className="tabs-list-container overflow-x-auto">
          <TabsList className="tabs-list grid w-full grid-cols-2 lg:grid-cols-6 min-w-[600px] md:min-w-[720px]">
            <TabsTrigger value="attendance" className="tabs-trigger">{t('studentProfilePage.attendance')}</TabsTrigger>
            <TabsTrigger value="academic" className="tabs-trigger">{t('studentProfilePage.academicPerformance')}</TabsTrigger>
            <TabsTrigger value="communication" className="tabs-trigger">{t('studentProfilePage.communication')}</TabsTrigger>
            <TabsTrigger value="documents" className="tabs-trigger">{t('studentProfilePage.documents')}</TabsTrigger>
            <TabsTrigger value="awards" className="tabs-trigger">{t('studentProfilePage.awards')}</TabsTrigger>
            <TabsTrigger value="fee" className="tabs-trigger">{t('studentProfilePage.fee')}</TabsTrigger>
          </TabsList>
        <TabsContent value="fee">
          {/* Fee info and payment for this student */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Fee Information & Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ParentFeePayment studentId={student?.id || ""} />
            </CardContent>
          </Card>
        </TabsContent>
        </div>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">Filter by Date:</span>
                <input type="date" className="border rounded px-2 py-1" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} />
                <Button variant="outline" size="sm" onClick={() => setCalendarDate("")}>Clear</Button>
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
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {record.method === 'biometric' ? (
                            <>
                              <span className="inline-flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 1.104.896 2 2 2s2-.896 2-2zm0 0c0-2.21-1.79-4-4-4s-4 1.79-4 4c0 2.21 1.79 4 4 4s4-1.79 4-4zm0 0c0-3.314-2.686-6-6-6S0 7.686 0 11c0 3.314 2.686 6 6 6s6-2.686 6-6zm0 0c0-4.418-3.582-8-8-8S-4 6.582-4 11c0 4.418 3.582 8 8 8s8-3.582 8-8z" /></svg>
                                Biometric
                              </span>
                            </>
                          ) : (
                            'Manual'
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setEditDialog({ open: true, index })}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {/* Edit Dialog */}
                  <>
                    {/* Calendar Filter Dialog */}
                    {showCalendar && (
                      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Select Date</DialogTitle>
                          </DialogHeader>
                          <input type="date" className="w-full border rounded px-2 py-1 mb-4" value={calendarDate} onChange={e => setCalendarDate(e.target.value)} />
                          {calendarDate && (() => {
                            const record = mockAttendance.find(r => r.date === calendarDate);
                            if (record) {
                              return (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">Status:</span>
                                    <Badge variant={
                                      record.status === 'Present' ? 'default' :
                                      record.status === 'Late' ? 'secondary' :
                                      record.status === 'Excused' ? 'outline' :
                                      'destructive'
                                    }>{record.status}</Badge>
                                  </div>
                                  {record.comment && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">Reason:</span>
                                      <span>{record.comment}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return <div className="text-muted-foreground">No attendance record for this date.</div>;
                            }
                          })()}
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" onClick={() => setShowCalendar(false)}>Close</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {/* Edit Dialog */}
                    {editDialog?.open && (
                      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ ...editDialog, open })}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Attendance</DialogTitle>
                          </DialogHeader>
                          <div className="flex gap-2 mb-2">
                            <Button variant={editStatus === 'Present' ? 'default' : 'outline'} onClick={() => setEditStatus('Present')}>Present</Button>
                            <Button variant={editStatus === 'Absent' ? 'destructive' : 'outline'} onClick={() => setEditStatus('Absent')}>Absent</Button>
                            <Button variant={editStatus === 'Late' ? 'secondary' : 'outline'} onClick={() => setEditStatus('Late')}>Late</Button>
                            <Button variant={editStatus === 'Excused' ? 'outline' : 'outline'} onClick={() => setEditStatus('Excused')}>Excused</Button>
                          </div>
                          {(editStatus === 'Absent' || editStatus === 'Late' || editStatus === 'Excused') && (
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
                  </>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

  <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Exam</label>
                    <select className="border rounded px-2 py-1" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
                      {examOptions.map(exam => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select className="border rounded px-2 py-1" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="h-10 flex items-center gap-2"
                  onClick={() => setShowReportCardDialog(true)}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate Report Card</span>
                  <span className="sm:hidden">Report Card</span>
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMarksApi({ exam: selectedExam, year: selectedYear }).map((mark, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{mark.subject}</TableCell>
                        <TableCell>{mark.marks}</TableCell>
                        <TableCell>{mark.total}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{mark.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Parent Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end mb-4">
                <Button variant="default" onClick={() => setShowCommDialog(true)}>
                  Reach Parent
                </Button>
                <Button variant="outline" onClick={() => setShowManualDialog(true)}>
                  Manual Add
                </Button>
              </div>
              {/* Manual Add Dialog */}
              {typeof showManualDialog !== 'undefined' && showManualDialog && (
                <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manual Add Communication</DialogTitle>
                    </DialogHeader>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input type="date" className="border rounded px-2 py-1 w-full" value={manualDate} onChange={e => setManualDate(e.target.value)} />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select className="border rounded px-2 py-1 w-full" value={manualType} onChange={e => setManualType(e.target.value)}>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea className="border rounded px-2 py-1 w-full" rows={3} value={manualMessage} onChange={e => setManualMessage(e.target.value)} placeholder="Enter your message..." />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Status</label>
                      <select className="border rounded px-2 py-1 w-full" value={manualStatus} onChange={e => setManualStatus(e.target.value)}>
                        <option value="Sent">Sent</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowManualDialog(false)}>Cancel</Button>
                      <Button onClick={() => {
                        setMockCommunications(prev => [
                          ...prev,
                          {
                            date: manualDate || new Date().toISOString().split('T')[0],
                            type: manualType,
                            message: manualMessage,
                            status: manualStatus
                          }
                        ]);
                        setManualDate("");
                        setManualType("SMS");
                        setManualMessage("");
                        setManualStatus("Sent");
                        setShowManualDialog(false);
                      }}>Add</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockParentCommApi(mockCommunications).map((comm, index) => (
                      <TableRow key={index}>
                        <TableCell>{comm.date}</TableCell>
                        <TableCell>{comm.type}</TableCell>
                        <TableCell>{comm.message}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{comm.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Communication Dialog */}
              {showCommDialog && (
                <Dialog open={showCommDialog} onOpenChange={setShowCommDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reach Parent</DialogTitle>
                    </DialogHeader>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select className="border rounded px-2 py-1 w-full" value={commType} onChange={e => setCommType(e.target.value)}>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea className="border rounded px-2 py-1 w-full" rows={3} value={commMessage} onChange={e => setCommMessage(e.target.value)} placeholder="Enter your message..." />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCommDialog(false)}>Cancel</Button>
                      <Button onClick={() => {
                        setMockCommunications(prev => [
                          ...prev,
                          {
                            date: new Date().toISOString().split('T')[0],
                            type: commType,
                            message: commMessage,
                            status: 'Sent'
                          }
                        ]);
                        setCommMessage("");
                        setCommType("SMS");
                        setShowCommDialog(false);
                      }}>Send</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          {/* Document Generation Dialogs */}
          {showIdCardDialog && student && (
            <Dialog open={showIdCardDialog} onOpenChange={setShowIdCardDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Printable Student ID Card</DialogTitle>
                </DialogHeader>
                <div className="print-container">
                  <IdCardTemplate person={student} type="student" />
                </div>
                <div className="flex justify-end gap-2 mt-4 print:hidden">
                  <Button variant="outline" onClick={() => setShowIdCardDialog(false)}>Close</Button>
                  <Button variant="default" onClick={() => {
                    window.print();
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Certificate Generation Dialog */}
          {showCertificateDialog && student && (
            <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>{certificateType}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {certificateType === "Bonafide Certificate" && (
                    <BonafideCertificateTemplate
                      studentName={student.name}
                      fatherName={student.guardianName}
                      className={`${student.class}-${student.section}`}
                      schoolName="St. Mary's Senior Secondary School"
                      principalName="Dr. John Smith"
                      academicYear="2024-25"
                      rollNumber={student.rollNo}
                      purpose="Higher Education"
                      certificateNumber={`BC${Date.now().toString().slice(-6)}`}
                      issueDate={new Date().toLocaleDateString()}
                    />
                  )}
                  {certificateType === "Conduct Certificate" && (
                    <ConductCertificateTemplate
                      studentName={student.name}
                      className={`${student.class}-${student.section}`}
                      schoolName="St. Mary's Senior Secondary School"
                      principalName="Dr. John Smith"
                      academicYear="2024-25"
                      conduct="Excellent"
                      issueDate={new Date().toLocaleDateString()}
                      certificateNumber={`CC${Date.now().toString().slice(-6)}`}
                    />
                  )}
                  {certificateType === "Character Certificate" && (
                    <CertificateTemplate
                      type="character"
                      studentName={student.name}
                      studentId={student.id}
                      class={`${student.class}-${student.section}`}
                      issuedDate={new Date().toLocaleDateString()}
                      certificateId={`CHC${Date.now().toString().slice(-6)}`}
                    />
                  )}
                  {certificateType === "Transfer Certificate" && (
                    <TransferCertificateTemplate
                      studentName={student.name}
                      fatherName={student.guardianName}
                      motherName="Mother Name"
                      className={`${student.class}-${student.section}`}
                      schoolName="St. Mary's Senior Secondary School"
                      principalName="Dr. John Smith"
                      academicYear="2024-25"
                      dateOfBirth={student.dob}
                      dateOfAdmission={student.admissionDate}
                      dateOfLeaving={new Date().toLocaleDateString()}
                      reasonForLeaving="Higher Studies"
                      conduct="Excellent"
                      certificateNumber={`TC${Date.now().toString().slice(-6)}`}
                      issueDate={new Date().toLocaleDateString()}
                    />
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4 print:hidden">
                  <Button variant="outline" onClick={() => setShowCertificateDialog(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    window.print();
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Report Card Generation Dialog */}
          {showReportCardDialog && student && (
            <Dialog open={showReportCardDialog} onOpenChange={setShowReportCardDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Student Report Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <ReportCardTemplate
                    reportCard={{
                      id: `RC${Date.now()}`,
                      studentId: student.id,
                      studentName: student.name,
                      class: student.class,
                      section: student.section,
                      term: selectedExam,
                      subjects: mockMarksApi({ exam: selectedExam, year: selectedYear }).map(mark => ({
                        name: mark.subject,
                        marksObtained: mark.marks,
                        totalMarks: mark.total,
                        grade: mark.grade
                      })),
                      totalMarks: mockMarksApi({ exam: selectedExam, year: selectedYear }).reduce((sum, mark) => sum + mark.total, 0),
                      totalObtained: mockMarksApi({ exam: selectedExam, year: selectedYear }).reduce((sum, mark) => sum + mark.marks, 0),
                      percentage: mockMarksApi({ exam: selectedExam, year: selectedYear }).length > 0 ? 
                        (mockMarksApi({ exam: selectedExam, year: selectedYear }).reduce((sum, mark) => sum + mark.marks, 0) / 
                         mockMarksApi({ exam: selectedExam, year: selectedYear }).reduce((sum, mark) => sum + mark.total, 0)) * 100 : 0,
                      grade: "A",
                      attendance: 95,
                      rank: 5,
                      remarks: "Excellent performance. Keep up the good work!",
                      generatedDate: new Date().toISOString()
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4 print:hidden">
                  <Button variant="outline" onClick={() => setShowReportCardDialog(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    window.print();
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Print
                  </Button>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center"
                  onClick={() => handleDocumentGeneration("ID Card")}
                >
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Generate ID Card</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center"
                  onClick={() => handleDocumentGeneration("Transfer Certificate")}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Transfer Certificate</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center"
                  onClick={() => handleDocumentGeneration("Bonafide Certificate")}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Bonafide Certificate</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center"
                  onClick={() => handleDocumentGeneration("Conduct Certificate")}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Conduct Certificate</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 sm:h-20 flex-col justify-center"
                  onClick={() => handleDocumentGeneration("Character Certificate")}
                >
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm">Character Certificate</span>
                </Button>
              </div>

              {/* Uploaded Documents Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Admission Form</p>
                        <p className="text-xs text-muted-foreground">PDF • 2024-01-15</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">Birth Certificate</p>
                        <p className="text-xs text-muted-foreground">PDF • 2024-01-10</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="awards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Awards & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="mb-4" onClick={() => setShowAwardDialog(true)}>
                Add New Award/Achievement
              </Button>
              {awards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No awards or achievements available</p>
                  <p className="text-sm">Awards and achievements will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {awards.map((award, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="font-semibold text-lg">{award.title}</div>
                      <div className="text-muted-foreground mb-2">{award.date}</div>
                      <div>{award.desc}</div>
                    </div>
                  ))}
                </div>
              )}
              <Dialog open={showAwardDialog} onOpenChange={setShowAwardDialog}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Award / Achievement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input placeholder="Award or Achievement Title" value={awardTitle} onChange={e => setAwardTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Input placeholder="Description" value={awardDesc} onChange={e => setAwardDesc(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" value={awardDate} onChange={e => setAwardDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={handleSaveAward} disabled={!awardTitle || !awardDate}>Save</Button>
                    <Button variant="outline" onClick={() => setShowAwardDialog(false)}>Cancel</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}