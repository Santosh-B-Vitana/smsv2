import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, BarChart3, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PaymentGatewayManager } from "./PaymentGatewayManager";
import { AdvancedFeesManager } from "./AdvancedFeesManager";
import { StudentFeePaymentDialog } from "./StudentFeePaymentDialog";
import { FeeReminderManager } from "./FeeReminderManager";
import FeeConcessionManager from "./FeeConcessionManager";
import PaymentDashboard from "./PaymentDashboard";
import { FeeTemplateManager } from "./FeeTemplateManager";
import { InstallmentPlanManager } from "./InstallmentPlanManager";
import { FeeRecordsTable } from "./FeeRecordsTable";
import { FeeAnalyticsDashboard } from "./FeeAnalyticsDashboard";
import { PaymentProcessor } from "./PaymentProcessor";
import { FeeDetailsDialog } from "./FeeDetailsDialog";
import { mockApi } from "@/services/mockApi";
import { generateProfessionalFeeReceipt } from "@/utils/professionalPdfGenerator";
import { PdfPreviewModal } from "@/components/common/PdfPreviewModal";
import { ErrorBoundary, LoadingState, useConfirmDialog } from "@/components/common";
import { useKeyboardShortcuts, CommonShortcuts } from "@/hooks/useKeyboardShortcuts";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AnimatedWrapper } from "@/components/common/AnimatedWrapper";
import { ModernCard } from "@/components/common/ModernCard";

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
  siblings?: {
    id: string;
    name: string;
    class: string;
    pendingAmount: number;
  }[];
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("2024-25");
  const academicYears = ["2023-24", "2024-25", "2025-26"];
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedStudentRecord, setSelectedStudentRecord] = useState<FeeRecord | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  
  // PDF Preview
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load students
  useEffect(() => {
    mockApi.getStudents().then(studentsList => {
      setStudents(studentsList);
    });
  }, []);

  // Mock installment data
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
    }
  ]);

  // Mock fee records
  const [feeRecords] = useState<FeeRecord[]>([
    {
      id: "FEE001",
      studentId: "STU001",
      studentName: "Aarav Gupta",
      class: "10-A",
      totalAmount: 45000,
      paidAmount: 30000,
      pendingAmount: 15000,
      dueDate: "2024-04-15",
      status: "partial",
      academicYear: "2024-25"
    },
    {
      id: "FEE002",
      studentId: "STU002",
      studentName: "Priya Sharma",
      class: "9-B",
      totalAmount: 42000,
      paidAmount: 42000,
      pendingAmount: 0,
      dueDate: "2024-03-20",
      status: "paid",
      lastPaymentDate: "2024-03-15",
      academicYear: "2024-25"
    }
  ]);

  // Mock transactions
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: "TXN001",
      studentId: "STU001",
      amount: 15000,
      method: "UPI",
      status: "completed",
      timestamp: "2024-03-10T10:30:00",
      gatewayRef: "RAZORPAY_001",
      academicYear: "2024-25"
    }
  ]);

  const generateReceipt = async (record: FeeRecord) => {
    try {
      // Generate receipt PDF (simplified for now)
      const mockPdfUrl = "data:application/pdf;base64,mock";
      setPdfUrl(mockPdfUrl);
      setPdfFileName(`Fee_Receipt_${record.studentName.replace(/\s+/g, '_')}.pdf`);
      setPdfPreviewOpen(true);
      
      toast({
        title: "Receipt Generated",
        description: `Receipt created for ${record.studentName}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate receipt",
        variant: "destructive"
      });
    }
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Data refreshed" });
    }, 1000);
  };

  const processPayment = (record: FeeRecord) => {
    setSelectedStudentRecord(record);
    setPaymentDialogOpen(true);
  };

  const getTotalPendingFees = () => {
    return feeRecords.reduce((sum, record) => sum + record.pendingAmount, 0);
  };

  const getOverdueCount = () => {
    return feeRecords.filter(record => record.status === 'overdue').length;
  };

  useKeyboardShortcuts([CommonShortcuts.refresh(refreshData)]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted';
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <AnimatedBackground variant="gradient" className="fixed inset-0 -z-10 opacity-30" />
        
        <div className="space-y-6 relative z-10">
        <AnimatedWrapper variant="fadeInUp" delay={0.1}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-display gradient-text">Fee Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage student fees, payments, and financial records
            </p>
          </div>
          <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </AnimatedWrapper>

        {/* Analytics Dashboard */}
        <AnimatedWrapper variant="fadeInUp" delay={0.2}>
        <FeeAnalyticsDashboard
          totalPending={getTotalPendingFees()}
          totalCollected={feeRecords.reduce((sum, r) => sum + r.paidAmount, 0)}
          overdueCount={getOverdueCount()}
          totalStudents={feeRecords.length}
        />
        </AnimatedWrapper>

        {/* Main Tabs */}
        <AnimatedWrapper variant="fadeInUp" delay={0.3}>
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full flex">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Fee Records</TabsTrigger>
            <TabsTrigger value="structure">Fee Structure</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="installments">Installments</TabsTrigger>
            <TabsTrigger value="concessions">Concessions</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PaymentDashboard />
          </TabsContent>

          <TabsContent value="records">
            <FeeRecordsTable
              feeRecords={feeRecords}
              filterStatus={filterStatus}
              searchQuery={searchQuery}
              onFilterChange={setFilterStatus}
              onSearchChange={setSearchQuery}
              onViewDetails={(record) => {
                setSelectedStudentRecord(record);
                setViewDialogOpen(true);
              }}
              onProcessPayment={processPayment}
              onGenerateReceipt={generateReceipt}
            />
          </TabsContent>

          <TabsContent value="structure">
            <AdvancedFeesManager />
          </TabsContent>

          <TabsContent value="templates">
            <FeeTemplateManager />
          </TabsContent>

          <TabsContent value="installments">
            <InstallmentPlanManager />
          </TabsContent>

          <TabsContent value="concessions">
            <FeeConcessionManager />
          </TabsContent>

          <TabsContent value="reminders">
            <FeeReminderManager />
          </TabsContent>

          <TabsContent value="transactions">
            <ModernCard variant="glass">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Gateway Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id}</TableCell>
                      <TableCell>{txn.studentId}</TableCell>
                      <TableCell>₹{txn.amount.toLocaleString()}</TableCell>
                      <TableCell>{txn.method}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(txn.status)}>
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(txn.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{txn.gatewayRef}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ModernCard>
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Fee Report
                </Button>
                <Button variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics Report
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </AnimatedWrapper>

        {/* Dialogs */}
        <FeeDetailsDialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          feeRecord={selectedStudentRecord}
          installmentPlans={installmentPlans}
          academicYear={selectedAcademicYear}
        />

        <PaymentProcessor
          open={paymentDialogOpen}
          onClose={() => setPaymentDialogOpen(false)}
          feeRecord={selectedStudentRecord}
          onPaymentSuccess={refreshData}
        />

        <PdfPreviewModal
          open={pdfPreviewOpen}
          onClose={() => setPdfPreviewOpen(false)}
          pdfUrl={pdfUrl}
          fileName={pdfFileName}
        />
        </div>
      </div>
    </ErrorBoundary>
  );
}

