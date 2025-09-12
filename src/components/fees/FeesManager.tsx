import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CreditCard, Receipt, AlertCircle, Download, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentGatewayManager } from "./PaymentGatewayManager";
import { AdvancedFeesManager } from "./AdvancedFeesManager";

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  lastPaymentDate?: string;
  academicYear: string;
}

interface PaymentTransaction {
  id: string;
  studentId: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  gatewayRef: string;
  academicYear: string;
}

export function FeesManager() {
  // Academic year dropdown state for dialog
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2024-25");
  // Example academic years (should be dynamic in real app)
  const academicYears = ["2023-24", "2024-25", "2025-26"];
  // State for student details dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudentRecord, setSelectedStudentRecord] = useState<FeeRecord | null>(null);

  // Example installment data (should be fetched or managed per student)
  const [installmentPlans] = useState([
    {
      studentId: "STU001",
      studentName: "Aarav Gupta",
      totalFee: 45000,
      academicYear: "2024-25",
      installments: [
        { installmentNumber: 1, amount: 15000, dueDate: "2024-01-15", status: "paid", paidDate: "2024-01-10", lateFee: 0 },
        { installmentNumber: 2, amount: 15000, dueDate: "2024-03-15", status: "paid", paidDate: "2024-03-10", lateFee: 0 },
        { installmentNumber: 3, amount: 15000, dueDate: "2024-04-15", status: "pending", lateFee: 0 }
      ]
    },
    {
      studentId: "STU003",
      studentName: "Ananya Sharma",
      totalFee: 42000,
      academicYear: "2023-24",
      installments: [
        { installmentNumber: 1, amount: 21000, dueDate: "2023-01-15", status: "paid", paidDate: "2023-01-10", lateFee: 0 },
        { installmentNumber: 2, amount: 21000, dueDate: "2023-03-15", status: "paid", paidDate: "2023-03-10", lateFee: 0 }
      ]
    }
  ]);
  const [feeRecords] = useState<FeeRecord[]>([
    {
      id: "FEE001",
      studentId: "STU001", 
      studentName: "Aarav Gupta",
      class: "10-A",
      totalAmount: 45000,
      paidAmount: 25000,
      pendingAmount: 20000,
      dueDate: "2024-04-15",
      status: "partial",
      lastPaymentDate: "2024-03-10",
      academicYear: "2024-25"
    },
    {
      id: "FEE002",
      studentId: "STU002",
      studentName: "Rohan Mehra", 
      class: "10-A",
      totalAmount: 45000,
      paidAmount: 0,
      pendingAmount: 45000,
      dueDate: "2024-04-15", 
      status: "overdue",
      academicYear: "2024-25"
    },
    {
      id: "FEE003",
      studentId: "STU003",
      studentName: "Ananya Sharma",
      class: "9-B", 
      totalAmount: 42000,
      paidAmount: 42000,
      pendingAmount: 0,
      dueDate: "2024-03-15",
      status: "paid",
      lastPaymentDate: "2024-03-12",
      academicYear: "2023-24"
    }
  ]);

  const [paymentTransactions] = useState<PaymentTransaction[]>([
    {
      id: "TXN001",
      studentId: "STU001",
      amount: 25000,
      method: "razorpay",
      status: "completed",
      timestamp: "2024-03-10T10:30:00Z",
      gatewayRef: "pay_abc123xyz",
      academicYear: "2024-25"
    },
    {
      id: "TXN002", 
      studentId: "STU003",
      amount: 42000,
      method: "payu",
      status: "completed", 
      timestamp: "2023-03-12T14:15:00Z",
      gatewayRef: "pay_def456uvw",
      academicYear: "2023-24"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const { toast } = useToast();

  const schoolInfo = {
  name: "Vitana Schools",
    address: "123 Education Street, Delhi 110001",
    phone: "+91-11-12345678",
  email: "info@vitanaSchools.edu",
    affiliationNo: "DL001234",
    schoolCode: "GWA001"
  };

  const generateReceipt = (studentId: string, transactionId?: string) => {
    const student = feeRecords.find(f => f.studentId === studentId);
    const transaction = paymentTransactions.find(t => t.studentId === studentId);
    
    if (!student) {
      toast({
        title: "Error",
        description: "Student record not found",
        variant: "destructive"
      });
      return;
    }

    // Create receipt content with dynamic data
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fee Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .school-info { margin-bottom: 20px; }
            .student-info { margin-bottom: 20px; }
            .payment-details { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${schoolInfo.name}</h1>
            <p>${schoolInfo.address}</p>
            <p>Phone: ${schoolInfo.phone} | Email: ${schoolInfo.email}</p>
            <p>Affiliation No: ${schoolInfo.affiliationNo} | School Code: ${schoolInfo.schoolCode}</p>
          </div>
          
          <div class="school-info">
            <h2>Fee Payment Receipt</h2>
            <p><strong>Receipt No:</strong> ${transaction?.gatewayRef || 'RCP' + Date.now()}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="student-info">
            <h3>Student Details</h3>
            <table>
              <tr><td><strong>Name</strong></td><td>${student.studentName}</td></tr>
              <tr><td><strong>Class</strong></td><td>${student.class}</td></tr>
              <tr><td><strong>Student ID</strong></td><td>${student.studentId}</td></tr>
              <tr><td><strong>Academic Year</strong></td><td>2023-24</td></tr>
            </table>
          </div>
          
          <div class="payment-details">
            <h3>Fee Details</h3>
            <table>
              <tr><td><strong>Total Fee Amount</strong></td><td>₹${student.totalAmount.toLocaleString()}</td></tr>
              <tr><td><strong>Amount Paid</strong></td><td>₹${student.paidAmount.toLocaleString()}</td></tr>
              <tr><td><strong>Outstanding Amount</strong></td><td>₹${student.pendingAmount.toLocaleString()}</td></tr>
              <tr><td><strong>Payment Status</strong></td><td>${student.status.toUpperCase()}</td></tr>
              ${transaction ? `
                <tr><td><strong>Last Payment Date</strong></td><td>${new Date(transaction.timestamp).toLocaleDateString()}</td></tr>
                <tr><td><strong>Payment Method</strong></td><td>${transaction.method.toUpperCase()}</td></tr>
                <tr><td><strong>Transaction ID</strong></td><td>${transaction.id}</td></tr>
              ` : ''}
            </table>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated receipt. No signature required.</p>
            <p>For any queries, contact ${schoolInfo.phone}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    // Create and download receipt
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${student.studentName}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Generated",
      description: `Receipt for ${student.studentName} downloaded successfully`,
    });
  };

  const generateOutstandingFees = () => {
    const outstandingStudents = feeRecords.filter(record => record.pendingAmount > 0);
    
    toast({
      title: "Outstanding Fees Generated",
      description: `Generated payment requests for ${outstandingStudents.length} students with pending fees`,
    });

    // Outstanding fees generated for parent portals
  };

  const processPayment = (studentId: string, amount: number, method: string) => {
    toast({
      title: "Payment Processing",
      description: `Processing ₹${amount.toLocaleString()} payment via ${method}...`,
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful", 
        description: `Payment of ₹${amount.toLocaleString()} processed successfully`,
      });
    }, 2000);
  };

  const getTotalPendingFees = () => {
    return feeRecords.reduce((total, record) => total + record.pendingAmount, 0);
  };

  const getOverdueCount = () => {
    return feeRecords.filter(record => record.status === 'overdue').length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fee Management System</h2>
        <div className="flex gap-2">
          <Button onClick={generateOutstandingFees}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Generate Outstanding Fees
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{getTotalPendingFees().toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getOverdueCount()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Collections</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹2,85,000</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">68%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="structure">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="structure">Fee Overview</TabsTrigger>
          <TabsTrigger value="overview">Student Records</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="structure">
          <AdvancedFeesManager />
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Student Records</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search student by name or ID..."
                  value={selectedStudent}
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline">
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeRecords
                    .filter(record =>
                      !selectedStudent ||
                      record.studentName.toLowerCase().includes(selectedStudent.toLowerCase()) ||
                      record.studentId.toLowerCase().includes(selectedStudent.toLowerCase())
                    )
                    .map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>{record.class}</TableCell>
                      <TableCell>₹{record.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{record.paidAmount.toLocaleString()}</TableCell>
                      <TableCell className={record.pendingAmount > 0 ? "text-red-600 font-medium" : ""}>
                        ₹{record.pendingAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === 'paid' ? 'default' :
                          record.status === 'overdue' ? 'destructive' :
                          record.status === 'partial' ? 'secondary' : 'outline'
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedStudentRecord(record);
                              setViewDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                          {record.pendingAmount > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  Pay
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Payment - {record.studentName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Payment Amount</Label>
                                    <Input 
                                      type="number"
                                      placeholder={`Max: ₹${record.pendingAmount}`}
                                      value={paymentAmount}
                                      onChange={(e) => setPaymentAmount(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Payment Method</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="razorpay">Razorpay</SelectItem>
                                        <SelectItem value="payu">PayU</SelectItem>
                                        <SelectItem value="paytm">Paytm</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button 
                                    onClick={() => processPayment(record.studentId, Number(paymentAmount), "razorpay")}
                                    className="w-full"
                                  >
                                    Process Payment
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateReceipt(record.studentId)}
                          >
                            <Receipt className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
          {/* Student Details Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Student Fee Details</DialogTitle>
              </DialogHeader>
              {/* Academic Year Dropdown */}
              <div className="mb-4 flex items-center gap-2">
                <Label>Academic Year</Label>
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedStudentRecord && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Name:</strong> {selectedStudentRecord.studentName}</p>
                      <p><strong>ID:</strong> {selectedStudentRecord.studentId}</p>
                      <p><strong>Class:</strong> {selectedStudentRecord.class}</p>
                      <p><strong>Status:</strong> {selectedStudentRecord.status}</p>
                    </div>
                    <div>
                      <p><strong>Total Fee:</strong> ₹{selectedStudentRecord.totalAmount.toLocaleString()}</p>
                      <p><strong>Paid:</strong> ₹{selectedStudentRecord.paidAmount.toLocaleString()}</p>
                      <p><strong>Pending:</strong> ₹{selectedStudentRecord.pendingAmount.toLocaleString()}</p>
                      <p><strong>Due Date:</strong> {new Date(selectedStudentRecord.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {/* Installment Management */}
                  <div>
                    <h4 className="font-semibold mb-2">Installment Management</h4>
                    {installmentPlans.filter(p => p.studentId === selectedStudentRecord.studentId).map(plan => (
                      <Table key={plan.studentId} className="mb-4">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Installment</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Paid Date</TableHead>
                            <TableHead>Late Fee</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {plan.installments.map(inst => (
                            <TableRow key={inst.installmentNumber}>
                              <TableCell>#{inst.installmentNumber}</TableCell>
                              <TableCell>₹{inst.amount.toLocaleString()}</TableCell>
                              <TableCell>{new Date(inst.dueDate).toLocaleDateString()}</TableCell>
                              <TableCell>{inst.status}</TableCell>
                              <TableCell>{inst.paidDate ? new Date(inst.paidDate).toLocaleDateString() : '-'}</TableCell>
                              <TableCell>₹{inst.lateFee}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ))}
                  </div>
                  {/* Payment Transaction History */}
                  <div>
                    <h4 className="font-semibold mb-2">Payment Transaction History</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Gateway Ref</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentTransactions.filter(txn => txn.studentId === selectedStudentRecord.studentId).map(txn => (
                          <TableRow key={txn.id}>
                            <TableCell>{txn.id}</TableCell>
                            <TableCell>₹{txn.amount.toLocaleString()}</TableCell>
                            <TableCell>{txn.method === 'online' ? 'Online' : 'Cash'}</TableCell>
                            <TableCell>{txn.status}</TableCell>
                            <TableCell>{new Date(txn.timestamp).toLocaleDateString()}</TableCell>
                            <TableCell>{txn.gatewayRef}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Gateway Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentTransactions.map((txn) => {
                    const student = feeRecords.find(f => f.studentId === txn.studentId);
                    return (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">{txn.id}</TableCell>
                        <TableCell>{student?.studentName || 'Unknown'}</TableCell>
                        <TableCell>₹{txn.amount.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{txn.method === 'online' ? 'Online' : 'Cash'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            txn.status === 'completed' ? 'default' :
                            txn.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(txn.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-sm">{txn.gatewayRef}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Collection Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Outstanding Fees Report
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Collection Summary
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  Payment Gateway Report
                </Button>
              </div>
              
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Parent Portal Integration</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Outstanding fees are automatically pushed to parent portals for online payment. Parents receive notifications for due dates and can pay using integrated payment gateways.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
