import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Receipt, CreditCard, Calendar, Plus, Download, AlertCircle, Search, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeeStructure {
  id: string;
  name: string;
  class: string;
  components: {
    tuitionFee: number;
    admissionFee: number;
    examFee: number;
    libraryFee: number;
    labFee: number;
    sportsFee: number;
    miscellaneous: number;
  };
  totalAmount: number;
  installments: {
    count: number;
    amounts: number[];
    dueDates: string[];
  };
}

interface InstallmentPlan {
  studentId: string;
  studentName: string;
  totalFee: number;
  installments: {
    installmentNumber: number;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    paidDate?: string;
    lateFee: number;
  }[];
}

export function AdvancedFeesManager() {
  const { toast } = useToast();

  // State for Edit/View dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([
    {
      id: "FS001",
      name: "Class 10 - Academic Year 2024-25",
      class: "10",
      components: {
        tuitionFee: 25000,
        admissionFee: 5000,
        examFee: 2000,
        libraryFee: 1000,
        labFee: 3000,
        sportsFee: 1500,
        miscellaneous: 2500
      },
      totalAmount: 40000,
      installments: {
        count: 4,
        amounts: [10000, 10000, 10000, 10000],
        dueDates: ['2024-04-15', '2024-07-15', '2024-10-15', '2025-01-15']
      }
    }
  ]);

  // State for Add Fee Structure Dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [feeComponents, setFeeComponents] = useState<{name: string, amount: number}[]>([]);
  const [newStructure, setNewStructure] = useState({
    name: "",
    class: "",
    academicYear: "",
    installmentCount: 1,
    installmentAmounts: [0],
    installmentDueDates: [""]
  });

  const feeTypeOptions = [
    "Tuition Fee",
    "Admission Fee", 
    "Exam Fee",
    "Library Fee",
    "Lab Fee",
    "Sports Fee",
    "Transport Fee",
    "Hostel Fee",
    "Development Fee",
    "Activity Fee",
    "Computer Fee",
    "Other"
  ];

  const handleAddStructure = () => {
    if (!newStructure.class || !newStructure.academicYear || feeComponents.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and add at least one fee component.",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = feeComponents.reduce((sum, comp) => sum + comp.amount, 0);
    const components = {
      tuitionFee: feeComponents.find(c => c.name === 'Tuition Fee')?.amount || 0,
      admissionFee: feeComponents.find(c => c.name === 'Admission Fee')?.amount || 0,
      examFee: feeComponents.find(c => c.name === 'Exam Fee')?.amount || 0,
      libraryFee: feeComponents.find(c => c.name === 'Library Fee')?.amount || 0,
      labFee: feeComponents.find(c => c.name === 'Lab Fee')?.amount || 0,
      sportsFee: feeComponents.find(c => c.name === 'Sports Fee')?.amount || 0,
      miscellaneous: feeComponents.filter(c => !['Tuition Fee', 'Admission Fee', 'Exam Fee', 'Library Fee', 'Lab Fee', 'Sports Fee'].includes(c.name)).reduce((sum, c) => sum + c.amount, 0)
    };
    
    const structure: FeeStructure = {
      id: `FS${Date.now()}`,
      name: `${newStructure.class} - Academic Year ${newStructure.academicYear}`,
      class: newStructure.class,
      components,
      totalAmount,
      installments: {
        count: newStructure.installmentCount,
        amounts: newStructure.installmentAmounts,
        dueDates: newStructure.installmentDueDates
      }
    };
    setFeeStructures(prev => [...prev, structure]);
    setAddDialogOpen(false);
    setNewStructure({
      name: "",
      class: "",
      academicYear: "",
      installmentCount: 1,
      installmentAmounts: [0],
      installmentDueDates: [""]
    });
    setFeeComponents([]);
    toast({ title: "Fee Structure Added", description: "New fee structure added successfully." });
  };

  const addFeeComponent = (feeType: string) => {
    if (!feeComponents.find(comp => comp.name === feeType)) {
      setFeeComponents(prev => [...prev, { name: feeType, amount: 0 }]);
    }
  };

  const removeFeeComponent = (feeType: string) => {
    setFeeComponents(prev => prev.filter(comp => comp.name !== feeType));
  };

  const updateFeeAmount = (feeType: string, amount: number) => {
    setFeeComponents(prev => 
      prev.map(comp => comp.name === feeType ? { ...comp, amount } : comp)
    );
  };

  // Handle installment count change
  const handleInstallmentCountChange = (count: number) => {
    setNewStructure(ns => ({
      ...ns,
      installmentCount: count,
      installmentAmounts: Array(count).fill(0),
      installmentDueDates: Array(count).fill("")
    }));
  };

  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([
    {
      studentId: "STU001",
      studentName: "Alice Johnson",
      totalFee: 40000,
      installments: [
        {
          installmentNumber: 1,
          amount: 10000,
          dueDate: "2024-04-15",
          status: "paid",
          paidDate: "2024-04-10",
          lateFee: 0
        },
        {
          installmentNumber: 2,
          amount: 10000,
          dueDate: "2024-07-15",
          status: "overdue",
          lateFee: 500
        }
      ]
    }
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [receiptData, setReceiptData] = useState<any>(null);

  const generateReceipt = (payment: any) => {
    const receipt = {
      id: `RCP${Date.now()}`,
      studentName: payment.studentName,
      amount: payment.amount,
      paymentMethod: payment.method,
      date: new Date().toISOString(),
      receiptNumber: `RCP${Date.now()}`,
      feeType: "Tuition Fee",
      academicYear: "2024-25"
    };

    setReceiptData(receipt);
    
    toast({
      title: "Receipt Generated",
      description: `Receipt ${receipt.receiptNumber} generated successfully`
    });
  };

  const processPayment = (studentId: string, installmentNumber: number, method: string) => {
    setInstallmentPlans(prev => prev.map(plan => 
      plan.studentId === studentId 
        ? {
            ...plan,
            installments: plan.installments.map(inst => 
              inst.installmentNumber === installmentNumber 
                ? { ...inst, status: 'paid', paidDate: new Date().toISOString() }
                : inst
            )
          }
        : plan
    ));

    const plan = installmentPlans.find(p => p.studentId === studentId);
    const installment = plan?.installments.find(i => i.installmentNumber === installmentNumber);
    
    if (plan && installment) {
      generateReceipt({
        studentName: plan.studentName,
        amount: installment.amount,
        method: method
      });
    }

    toast({
      title: "Payment Successful",
      description: "Fee payment processed successfully"
    });
  };

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  // Extract unique academic years and classes for filters
  const academicYears = Array.from(new Set(feeStructures.map(fs => fs.name.split(' - Academic Year ')[1])));
  const classes = Array.from(new Set(feeStructures.map(fs => fs.class)));

  return (
    <div className="space-y-6">
      <Tabs defaultValue="structure">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fee Structure Management</CardTitle>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search by structure name or class..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fee Structure
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Structure Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Installments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructures
                    .filter(structure =>
                      (!searchTerm || structure.name.toLowerCase().includes(searchTerm.toLowerCase()) || structure.class.toLowerCase().includes(searchTerm.toLowerCase())) &&
                      (!selectedAcademicYear || structure.name.includes(selectedAcademicYear)) &&
                      (!selectedClass || structure.class === selectedClass)
                    )
                    .map((structure) => (
                      <TableRow key={structure.id}>
                        <TableCell className="font-medium">{structure.name}</TableCell>
                        <TableCell>{structure.class}</TableCell>
                        <TableCell>₹{structure.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{structure.installments.count}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setViewDialogOpen(true)}>Edit</Button>
                            <Button variant="outline" size="sm" onClick={() => setViewDialogOpen(true)}>View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>

            {/* Add Fee Structure Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Fee Structure</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Academic Year</Label>
                      <Input value={newStructure.academicYear} onChange={e => setNewStructure(ns => ({ ...ns, academicYear: e.target.value }))} placeholder="2024-25" />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Input value={newStructure.class} onChange={e => setNewStructure(ns => ({ ...ns, class: e.target.value }))} placeholder="10" />
                    </div>
                  </div>

                  <div>
                    <Label>Select Fee Types</Label>
                    <Select onValueChange={addFeeComponent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {feeTypeOptions.filter(type => !feeComponents.find(comp => comp.name === type)).map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {feeComponents.length > 0 && (
                    <div>
                      <Label>Fee Components</Label>
                      <div className="space-y-2 mt-2">
                        {feeComponents.map((component, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <span className="flex-1">{component.name}</span>
                            <Input 
                              type="number" 
                              value={component.amount} 
                              onChange={e => updateFeeAmount(component.name, Number(e.target.value))}
                              placeholder="Amount"
                              className="w-32"
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeFeeComponent(component.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Installment Count</Label>
                    <Input type="number" min={1} max={12} value={newStructure.installmentCount} onChange={e => handleInstallmentCountChange(Number(e.target.value))} />
                  </div>
                  
                  <div className="mt-4">
                    <Label>Installment Details</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: newStructure.installmentCount }).map((_, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            type="number"
                            value={newStructure.installmentAmounts[idx] || 0}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setNewStructure(ns => {
                                const amounts = [...ns.installmentAmounts];
                                amounts[idx] = val;
                                return { ...ns, installmentAmounts: amounts };
                              });
                            }}
                            placeholder={`Installment ${idx + 1} Amount`}
                          />
                          <Input
                            type="date"
                            value={newStructure.installmentDueDates[idx] || ""}
                            onChange={e => {
                              const val = e.target.value;
                              setNewStructure(ns => {
                                const dates = [...ns.installmentDueDates];
                                dates[idx] = val;
                                return { ...ns, installmentDueDates: dates };
                              });
                            }}
                            placeholder={`Installment ${idx + 1} Due Date`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddStructure}>Add Structure</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Management</CardTitle>
            </CardHeader>
            <CardContent>
              {receiptData ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold">Fee Receipt</h2>
                      <p className="text-sm text-muted-foreground">Vitana Schools</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p><strong>Receipt No:</strong> {receiptData.receiptNumber}</p>
                        <p><strong>Date:</strong> {new Date(receiptData.date).toLocaleDateString()}</p>
                        <p><strong>Student Name:</strong> {receiptData.studentName}</p>
                      </div>
                      <div>
                        <p><strong>Academic Year:</strong> {receiptData.academicYear}</p>
                        <p><strong>Fee Type:</strong> {receiptData.feeType}</p>
                        <p><strong>Payment Method:</strong> {receiptData.paymentMethod}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Amount Paid:</span>
                        <span>₹{receiptData.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline">
                      <Receipt className="h-4 w-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No receipt to display. Process a payment to generate a receipt.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}