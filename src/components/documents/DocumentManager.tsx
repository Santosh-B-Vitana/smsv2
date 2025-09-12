
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Document Management</h1>

      <Tabs defaultValue="certificates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates">
          <div className="space-y-6">
            <Card>
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
            </Card>

            <Card>
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
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Academic Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-1">Class 1</SelectItem>
                      <SelectItem value="class-2">Class 2</SelectItem>
                      <SelectItem value="class-3">Class 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term-1">Term 1</SelectItem>
                      <SelectItem value="term-2">Term 2</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Generate Report</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Progress Reports</h4>
                    <p className="text-sm text-muted-foreground mb-3">Student academic progress reports</p>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Mark Sheets</h4>
                    <p className="text-sm text-muted-foreground mb-3">Detailed examination mark sheets</p>
                    <Button variant="outline" size="sm">Generate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
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
          </Card>
        </TabsContent>
      </Tabs>

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
  );
}
