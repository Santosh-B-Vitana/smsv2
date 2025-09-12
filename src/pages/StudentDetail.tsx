import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParentFeePayment } from "@/components/fees/ParentFeePayment";
import { mockApi, Student } from "@/services/mockApi";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;
      const data = await mockApi.getStudent(id);
      setStudent(data);
      setLoading(false);
    }
    fetchStudent();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading student profile...</div>;
  }
  if (!student) {
    return <div className="p-8 text-center text-red-500">Student not found.</div>;
  }

  // Mock fee data for demonstration (replace with real API in production)
  const feeRecords = [
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
      lastPaymentDate: "2024-03-10"
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
      status: "overdue"
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
      lastPaymentDate: "2024-03-12"
    }
  ];

  const paymentTransactions = [
    {
      id: "TXN001",
      studentId: "STU001",
      amount: 25000,
      method: "razorpay",
      status: "completed",
      timestamp: "2024-03-10T10:30:00Z",
      gatewayRef: "pay_abc123xyz"
    },
    {
      id: "TXN002",
      studentId: "STU003",
      amount: 42000,
      method: "payu",
      status: "completed",
      timestamp: "2024-03-12T14:15:00Z",
      gatewayRef: "pay_def456uvw"
    }
  ];

  // Find fee record for this student
  const feeRecord = feeRecords.find(f => f.studentId === student?.id);
  const studentTransactions = paymentTransactions.filter(t => t.studentId === student?.id);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Profile & History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="bg-blue-100 text-blue-900 font-bold text-lg px-4 py-2 rounded-t-lg border-b-2 border-blue-300">Student Information Tabs</div>
          </div>
          <Tabs defaultValue="profile">
            <TabsList className="mb-4 bg-blue-50 border border-blue-200 rounded-lg">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="fee">Fee</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="font-semibold mb-2">Personal Details</h2>
                  <div><b>Name:</b> {student.name}</div>
                  <div><b>Roll No:</b> {student.rollNo}</div>
                  <div><b>Class:</b> {student.class}-{student.section}</div>
                  <div><b>Date of Birth:</b> {student.dob}</div>
                  <div><b>Category:</b> {student.category}</div>
                  <div><b>Status:</b> {student.status}</div>
                  <div><b>Admission Date:</b> {student.admissionDate}</div>
                </div>
                <div>
                  <h2 className="font-semibold mb-2">Guardian Details</h2>
                  <div><b>Name:</b> {student.guardianName}</div>
                  <div><b>Phone:</b> {student.guardianPhone}</div>
                  <div><b>Address:</b> {student.address}</div>
                  <div><b>Previous School:</b> {student.previousSchool || "-"}</div>
                </div>
              </div>
              <div className="mt-8">
                <h2 className="font-semibold mb-2">History</h2>
                <div className="text-muted-foreground">Academic, attendance, fee, and other history will appear here.</div>
              </div>
            </TabsContent>
            <TabsContent value="fee">
              {/* Fee info and payment for this student */}
              <ParentFeePayment studentId={student.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
