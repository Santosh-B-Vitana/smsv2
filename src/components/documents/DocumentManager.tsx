
import { useState, useRef } from "react";
import { FileText, Download, Eye, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CertificateTemplate } from "./CertificateTemplate";
import { useToast } from "@/hooks/use-toast";
import { ReportCardTemplate } from "../examinations/ReportCardTemplate";
import { ErrorBoundary, LoadingState, EmptyState } from "@/components/common";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AnimatedWrapper } from "@/components/common/AnimatedWrapper";
import { ModernCard } from "@/components/common/ModernCard";

interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  type: 'bonafide' | 'conduct' | 'transfer' | 'character';
  issuedDate: string;
  status: 'issued' | 'pending';
}

const mockCertificates: Certificate[] = [
  {
    id: 'CERT001',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    studentClass: '10-A',
    type: 'bonafide',
    issuedDate: '2024-03-15',
    status: 'issued'
  },
  {
    id: 'CERT002',
    studentId: 'STU002',
    studentName: 'David Chen',
    studentClass: '9-B',
    type: 'transfer',
    issuedDate: '2024-03-10',
    status: 'issued'
  }
];

export function DocumentManager() {
  const [viewReportStudent, setViewReportStudent] = useState(null);
  const [selectedReportSection, setSelectedReportSection] = useState("");
  // Mock students for demo
  const mockStudents = [
    { id: 'STU001', name: 'Alice Johnson' },
    { id: 'STU002', name: 'David Chen' },
    { id: 'STU003', name: 'Priya Singh' },
    { id: 'STU004', name: 'Rahul Verma' },
    { id: 'STU005', name: 'Sneha Patel' }
  ];
  const [selectedReportClass, setSelectedReportClass] = useState("");
  const [selectedReportTerm, setSelectedReportTerm] = useState("");
  const [showStudentTable, setShowStudentTable] = useState(false);
  // Track generated status for each student
  const [studentReportStatus, setStudentReportStatus] = useState<{[id: string]: 'generated' | 'pending'}>({});
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [certificateType, setCertificateType] = useState("");
  const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateCertificate = () => {
    if (!selectedStudent || !certificateType || !selectedClass) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCertificate: Certificate = {
      id: `CERT${String(certificates.length + 1).padStart(3, '0')}`,
      studentId: selectedStudent,
      studentName: `Student ${selectedStudent}`,
      studentClass: selectedClass,
      type: certificateType as any,
      issuedDate: new Date().toISOString().split('T')[0],
      status: 'issued'
    };

    setCertificates(prev => [newCertificate, ...prev]);
    setSelectedStudent("");
    setCertificateType("");
    setSelectedClass("");
    
    toast({
      title: "Success",
      description: "Certificate generated successfully",
    });
  };

  const handlePrint = () => {
    if (certificateRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificate</title>
              <style>
                body { margin: 0; padding: 20px; font-family: serif; }
                @media print { body { padding: 0; } }
              </style>
            </head>
            <body>
              ${certificateRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <AnimatedBackground variant="mesh" className="fixed inset-0 -z-10 opacity-30" />
        
        <div className="space-y-6 relative z-10">
          <AnimatedWrapper variant="fadeInUp" delay={0.05}>
            <h1 className="text-display gradient-text">Document Management</h1>
          </AnimatedWrapper>

          <AnimatedWrapper variant="fadeInUp" delay={0.1}>
            <Tabs defaultValue="certificates" className="space-y-4">
              <TabsList>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="certificates">
                <div className="space-y-6">
                  <ModernCard variant="glass">
                    <CardHeader>
                      <CardTitle>Generate Certificate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium">Student ID</label>
                          <Input
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            placeholder="Enter student ID"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Class</label>
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10-A">10-A</SelectItem>
                              <SelectItem value="10-B">10-B</SelectItem>
                              <SelectItem value="9-A">9-A</SelectItem>
                              <SelectItem value="9-B">9-B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Certificate Type</label>
                          <Select value={certificateType} onValueChange={setCertificateType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bonafide">Bonafide Certificate</SelectItem>
                              <SelectItem value="conduct">Conduct Certificate</SelectItem>
                              <SelectItem value="character">Character Certificate</SelectItem>
                              <SelectItem value="transfer">Transfer Certificate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <Button 
                            onClick={generateCertificate}
                            disabled={!selectedStudent || !certificateType || !selectedClass}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Generate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </ModernCard>

                  <ModernCard variant="glass">
                    <CardHeader>
                      <CardTitle>Certificate History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Certificate ID</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Issued Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {certificates.map((cert) => (
                            <TableRow key={cert.id}>
                              <TableCell className="font-medium">{cert.id}</TableCell>
                              <TableCell>{cert.studentName}</TableCell>
                              <TableCell>{cert.studentClass}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {cert.type.charAt(0).toUpperCase() + cert.type.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{cert.issuedDate}</TableCell>
                              <TableCell>
                                <Badge variant={cert.status === 'issued' ? 'default' : 'secondary'}>
                                  {cert.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setPreviewCertificate(cert)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </ModernCard>
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <ModernCard variant="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" /> Academic Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Select value={selectedReportClass} onValueChange={setSelectedReportClass}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class-1">Class 1</SelectItem>
                            <SelectItem value="class-2">Class 2</SelectItem>
                            <SelectItem value="class-3">Class 3</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedReportSection} onValueChange={setSelectedReportSection}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                            <SelectItem value="D">Section D</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedReportTerm} onValueChange={setSelectedReportTerm}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select term" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="term-1">Term 1</SelectItem>
                            <SelectItem value="term-2">Term 2</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={() => setShowStudentTable(true)}>
                          Search
                        </Button>
                      </div>
                      {showStudentTable && (
                        <>
                          <div className="flex justify-between items-center mt-6 mb-2">
                            <Button variant="outline" onClick={() => {
                              const newStatus: {[id: string]: 'generated' | 'pending'} = {};
                              mockStudents.forEach(s => newStatus[s.id] = 'generated');
                              setStudentReportStatus(newStatus);
                            }}>
                              Generate for Everyone
                            </Button>
                            <div className="flex gap-4">
                              <span className="font-semibold">Stats:</span>
                              <span className="text-green-600">Generated: {Object.values(studentReportStatus).filter(s => s === 'generated').length}</span>
                              <span className="text-yellow-600">Pending: {mockStudents.length - Object.values(studentReportStatus).filter(s => s === 'generated').length}</span>
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {mockStudents.map(student => (
                                <TableRow key={student.id}>
                                  <TableCell>{student.name}</TableCell>
                                  <TableCell>
                                    <Badge variant={studentReportStatus[student.id] === 'generated' ? 'default' : 'secondary'}>
                                      {studentReportStatus[student.id] === 'generated' ? 'Generated' : 'Pending'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" onClick={() => {
                                        setStudentReportStatus(prev => ({ ...prev, [student.id]: 'generated' }));
                                      }}>
                                        {studentReportStatus[student.id] === 'generated' ? 'Regenerate' : 'Generate'}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setViewReportStudent(student)}
                                        disabled={studentReportStatus[student.id] !== 'generated'}
                                        className={studentReportStatus[student.id] !== 'generated' ? 'opacity-50 cursor-not-allowed' : ''}
                                      >
                                        <Eye className="h-4 w-4" /> View
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        disabled={studentReportStatus[student.id] !== 'generated'}
                                        className={studentReportStatus[student.id] !== 'generated' ? 'opacity-50 cursor-not-allowed' : ''}
                                        onClick={async () => {
                                          const message = `Report card for ${student.name} is now available.`;
                                          const res = await import('../../services/mockApi');
                                          const api = res.sendSMSToParent;
                                          const result = await api(student.id, message);
                                          window.location.href = `/parent/${result.parentId}`;
                                        }}
                                      >
                                        Send to Parent
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={studentReportStatus[student.id] !== 'generated'}
                                        className={studentReportStatus[student.id] !== 'generated' ? 'opacity-50 cursor-not-allowed' : ''}
                                      >
                                        <Download className="h-4 w-4" /> Download
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </>
                      )}
                    </div>
                  </CardContent>
                </ModernCard>
              </TabsContent>

              <TabsContent value="templates">
                <ModernCard variant="glass">
                  <CardHeader>
                    <CardTitle>Document Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold">Transfer Certificate</h4>
                            <p className="text-sm text-muted-foreground">Official transfer document</p>
                            <Button variant="outline" size="sm" className="mt-3">Edit Template</Button>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold">Character Certificate</h4>
                            <p className="text-sm text-muted-foreground">Character reference document</p>
                            <Button variant="outline" size="sm" className="mt-3">Edit Template</Button>
                          </div>
                        </div>
                        <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                          <div className="text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold">Bonafide Certificate</h4>
                            <p className="text-sm text-muted-foreground">Student verification document</p>
                            <Button variant="outline" size="sm" className="mt-3">Edit Template</Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </ModernCard>
              </TabsContent>
            </Tabs>
          </AnimatedWrapper>

          {/* Report Card Dialog */}
          <Dialog open={!!viewReportStudent} onOpenChange={() => setViewReportStudent(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Report Card Preview</DialogTitle>
                  <Button onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Report Card</title>
                            <style>
                              body { background: #fff; margin: 0; padding: 0; }
                              .print-container {
                                width: 800px;
                                margin: 0 auto;
                                background: #fff;
                                border-radius: 12px;
                                box-shadow: 0 4px 32px rgba(0,0,0,0.08);
                                border: 1px solid #e0e7ef;
                                padding: 16px 24px;
                                font-family: 'serif', 'Georgia', 'Times New Roman', Times, serif;
                                page-break-inside: avoid;
                                height: 100vh;
                                overflow: hidden;
                              }
                              h1, h2, h3, h4 { color: #1e40af; }
                              .text-blue-800 { color: #1e40af; }
                              .text-blue-600 { color: #2563eb; }
                              .text-green-600 { color: #16a34a; }
                              .text-yellow-600 { color: #ca8a04; }
                              .text-red-600 { color: #dc2626; }
                              .border-blue-800 { border-color: #1e40af; }
                              .border-blue-200 { border-color: #bfdbfe; }
                              .bg-blue-50 { background: #eff6ff; }
                              .bg-gray-50 { background: #f9fafb; }
                              .border { border: 1px solid #e5e7eb; }
                              table { border-collapse: collapse; width: 100%; page-break-inside: avoid; }
                              th, td { border: 1px solid #e5e7eb; padding: 8px; }
                              th { background: #eff6ff; }
                              .font-bold { font-weight: bold; }
                              .font-semibold { font-weight: 600; }
                              .rounded-lg { border-radius: 0.5rem; }
                              .rounded { border-radius: 0.25rem; }
                              .mx-auto { margin-left: auto; margin-right: auto; }
                              .text-center { text-align: center; }
                              .mb-8 { margin-bottom: 2rem; }
                              .mb-6 { margin-bottom: 1.5rem; }
                              .mb-4 { margin-bottom: 1rem; }
                              .mb-3 { margin-bottom: 0.75rem; }
                              .mb-2 { margin-bottom: 0.5rem; }
                              .pb-6 { padding-bottom: 1.5rem; }
                              .pt-4 { padding-top: 1rem; }
                              .pt-8 { padding-top: 2rem; }
                              .p-4 { padding: 1rem; }
                              .p-8 { padding: 2rem; }
                              .gap-4 { gap: 1rem; }
                              .max-w-4xl { max-width: 56rem; }
                              .border-t { border-top: 1px solid #e5e7eb; }
                              @media print {
                                html, body {
                                  width: 100vw;
                                  height: 100vh;
                                  background: #fff;
                                  margin: 0;
                                  padding: 0;
                                }
                                .print-container {
                                  width: 800px;
                                  margin: 0 auto;
                                  box-shadow: none;
                                  border-radius: 0;
                                  page-break-inside: avoid;
                                  page-break-before: avoid;
                                  page-break-after: avoid;
                                  height: 100vh;
                                  overflow: hidden;
                                  padding: 8px 0;
                                }
                                table, tr, td, th { page-break-inside: avoid !important; }
                                .mb-8, .mb-6, .mb-4, .mb-3, .mb-2, .pb-6, .pt-4, .pt-8, .p-4, .p-8 { margin-bottom: 0 !important; padding-bottom: 0 !important; padding-top: 0 !important; }
                              }
                            </style>
                          </head>
                          <body>
                            <div class="print-container">
                              ${document.getElementById('report-card-preview')?.innerHTML}
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }} className="gap-2">
                    Print
                  </Button>
                </div>
              </DialogHeader>
              {viewReportStudent && (
                <div id="report-card-preview">
                  <ReportCardTemplate
                    reportCard={{
                      id: 'RC001',
                      studentId: viewReportStudent.id,
                      studentName: viewReportStudent.name,
                      class: selectedReportClass.replace('class-', ''),
                      section: selectedReportSection,
                      term: selectedReportTerm,
                      subjects: [
                        { name: 'Mathematics', marksObtained: 88, totalMarks: 100, grade: 'A' },
                        { name: 'Science', marksObtained: 92, totalMarks: 100, grade: 'A+' },
                        { name: 'English', marksObtained: 85, totalMarks: 100, grade: 'A' },
                        { name: 'Social Studies', marksObtained: 78, totalMarks: 100, grade: 'B+' },
                        { name: 'Hindi', marksObtained: 80, totalMarks: 100, grade: 'A' }
                      ],
                      totalMarks: 500,
                      totalObtained: 423,
                      percentage: 84.6,
                      grade: 'A',
                      attendance: 96,
                      rank: 5,
                      remarks: 'Excellent performance. Keep up the good work!',
                      generatedDate: new Date().toISOString()
                    }}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Certificate Preview Dialog */}
          <Dialog open={!!previewCertificate} onOpenChange={() => setPreviewCertificate(null)}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>Certificate Preview</DialogTitle>
                  <Button onClick={handlePrint} className="gap-2">
                    <Printer className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </DialogHeader>
              {previewCertificate && (
                <CertificateTemplate
                  ref={certificateRef}
                  type={previewCertificate.type}
                  studentName={previewCertificate.studentName}
                  studentId={previewCertificate.studentId}
                  class={previewCertificate.studentClass}
                  issuedDate={previewCertificate.issuedDate}
                  certificateId={previewCertificate.id}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ErrorBoundary>
  );
}
