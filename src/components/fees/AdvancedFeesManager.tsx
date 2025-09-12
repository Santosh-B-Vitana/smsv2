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
  // State for Edit/View dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  // Edit form state
  const [editStructure, setEditStructure] = useState<any>(null);

  const handleEditClick = (structure: FeeStructure) => {
    setSelectedStructure(structure);
    setEditStructure({
      ...structure,
      academicYear: structure.name.split('Academic Year ')[1] || '',
      customFeeName: '',
      customFeeAmount: 0,
      installmentAmounts: structure.installments.amounts,
      installmentDueDates: structure.installments.dueDates,
      installmentCount: structure.installments.count
    });
    setEditDialogOpen(true);
  };

  const handleViewClick = (structure: FeeStructure) => {
    setSelectedStructure(structure);
    setViewDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedStructure) return;
    const updated: FeeStructure = {
      ...selectedStructure,
      name: `${editStructure.class} - Academic Year ${editStructure.academicYear}`,
      class: editStructure.class,
      components: {
        tuitionFee: editStructure.tuitionFee,
        admissionFee: editStructure.admissionFee,
        examFee: editStructure.examFee,
        libraryFee: editStructure.libraryFee,
        labFee: editStructure.labFee,
        sportsFee: editStructure.sportsFee,
        miscellaneous: editStructure.miscellaneous
      },
      totalAmount:
        editStructure.tuitionFee +
        editStructure.admissionFee +
        editStructure.examFee +
        editStructure.libraryFee +
        editStructure.labFee +
        editStructure.sportsFee +
        editStructure.miscellaneous +
        (editStructure.customFeeAmount || 0),
      installments: {
        count: editStructure.installmentCount,
        amounts: editStructure.installmentAmounts,
        dueDates: editStructure.installmentDueDates
      }
    };
    setFeeStructures(prev => prev.map(fs => fs.id === updated.id ? updated : fs));
    setEditDialogOpen(false);
    setSelectedStructure(null);
    setEditStructure(null);
    toast({ title: "Fee Structure Updated", description: "Fee structure updated successfully." });
  };
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
  const [newStructure, setNewStructure] = useState({
    name: "",
    class: "",
    academicYear: "",
    tuitionFee: 0,
    admissionFee: 0,
    examFee: 0,
    libraryFee: 0,
    labFee: 0,
    sportsFee: 0,
    miscellaneous: 0,
    customFeeName: "",
    customFeeAmount: 0,
    installmentCount: 1,
    installmentAmounts: [0],
    installmentDueDates: [""]
  });

  const handleAddStructure = () => {
    const totalAmount = newStructure.tuitionFee + newStructure.admissionFee + newStructure.examFee + newStructure.libraryFee + newStructure.labFee + newStructure.sportsFee + newStructure.miscellaneous + (newStructure.customFeeAmount || 0);
    const structure: FeeStructure = {
      id: `FS${Date.now()}`,
      name: `${newStructure.class} - Academic Year ${newStructure.academicYear}`,
      class: newStructure.class,
      components: {
        tuitionFee: newStructure.tuitionFee,
        admissionFee: newStructure.admissionFee,
        examFee: newStructure.examFee,
        libraryFee: newStructure.libraryFee,
        labFee: newStructure.labFee,
        sportsFee: newStructure.sportsFee,
        miscellaneous: newStructure.miscellaneous
      },
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
      tuitionFee: 0,
      admissionFee: 0,
      examFee: 0,
      libraryFee: 0,
      labFee: 0,
      sportsFee: 0,
      miscellaneous: 0,
      customFeeName: "",
      customFeeAmount: 0,
      installmentCount: 1,
      installmentAmounts: [0],
      installmentDueDates: [""]
    });
    toast({ title: "Fee Structure Added", description: "New fee structure added successfully." });
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
  const { toast } = useToast();

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

  const calculateLateFees = () => {
    const today = new Date();
    
    setInstallmentPlans(prev => prev.map(plan => ({
      ...plan,
      installments: plan.installments.map(inst => {
        const dueDate = new Date(inst.dueDate);
        const daysPastDue = Math.max(0, Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        if (inst.status === 'pending' && daysPastDue > 0) {
          return {
            ...inst,
            status: 'overdue' as const,
            lateFee: daysPastDue * 50 // ₹50 per day late fee
          };
        }
        return inst;
      })
    })));
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
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(structure)}>Edit</Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewClick(structure)}>View</Button>
            {/* Edit Fee Structure Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Edit Fee Structure</DialogTitle>
                </DialogHeader>
                {editStructure && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Academic Year</Label>
                      <Input value={editStructure.academicYear} onChange={e => setEditStructure((ns: any) => ({ ...ns, academicYear: e.target.value }))} placeholder="2024-25" />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Input value={editStructure.class} onChange={e => setEditStructure((ns: any) => ({ ...ns, class: e.target.value }))} placeholder="10" />
                    </div>
                    <div>
                      <Label>Tuition Fee</Label>
                      <Input type="number" value={editStructure.tuitionFee} onChange={e => setEditStructure((ns: any) => ({ ...ns, tuitionFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Admission Fee</Label>
                      <Input type="number" value={editStructure.admissionFee} onChange={e => setEditStructure((ns: any) => ({ ...ns, admissionFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Exam Fee</Label>
                      <Input type="number" value={editStructure.examFee} onChange={e => setEditStructure((ns: any) => ({ ...ns, examFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Library Fee</Label>
                      <Input type="number" value={editStructure.libraryFee} onChange={e => setEditStructure((ns: any) => ({ ...ns, libraryFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Lab Fee</Label>
                      <Input type="number" value={editStructure.labFee} onChange={e => setEditStructure((ns: any) => ({ ...ns, labFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Sports Fee</Label>
                      <Input type="number" value={editStructure.sportsFee} onChange={e => setEditStructure((ns: any) => ({ ...ns, sportsFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Miscellaneous</Label>
                      <Input type="number" value={editStructure.miscellaneous} onChange={e => setEditStructure((ns: any) => ({ ...ns, miscellaneous: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Other Fee Name</Label>
                      <Input value={editStructure.customFeeName} onChange={e => setEditStructure((ns: any) => ({ ...ns, customFeeName: e.target.value }))} placeholder="Transport, Hostel, etc." />
                    </div>
                    <div>
                      <Label>Other Fee Amount</Label>
                      <Input type="number" value={editStructure.customFeeAmount} onChange={e => setEditStructure((ns: any) => ({ ...ns, customFeeAmount: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>Installment Count</Label>
                      <Input type="number" min={1} max={12} value={editStructure.installmentCount} onChange={e => {
                        const count = Number(e.target.value);
                        setEditStructure((ns: any) => ({
                          ...ns,
                          installmentCount: count,
                          installmentAmounts: Array(count).fill(0),
                          installmentDueDates: Array(count).fill("")
                        }));
                      }} />
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <Label>Installment Details</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {editStructure && Array.from({ length: editStructure.installmentCount }).map((_, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          type="number"
                          value={editStructure.installmentAmounts[idx] || 0}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setEditStructure((ns: any) => {
                              const amounts = [...ns.installmentAmounts];
                              amounts[idx] = val;
                              return { ...ns, installmentAmounts: amounts };
                            });
                          }}
                          placeholder={`Installment ${idx + 1} Amount`}
                        />
                        <Input
                          type="date"
                          value={editStructure.installmentDueDates[idx] || ""}
                          onChange={e => {
                            const val = e.target.value;
                            setEditStructure((ns: any) => {
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
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditSave}>Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* View Fee Structure Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Fee Structure Details</DialogTitle>
                </DialogHeader>
                {selectedStructure && (
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {selectedStructure.name}</div>
                    <div><strong>Class:</strong> {selectedStructure.class}</div>
                    <div><strong>Total Amount:</strong> ₹{selectedStructure.totalAmount.toLocaleString()}</div>
                    <div><strong>Installments:</strong> {selectedStructure.installments.count}</div>
                    <div className="mt-2"><strong>Components:</strong></div>
                    <ul className="ml-4">
                      <li>Tuition Fee: ₹{selectedStructure.components.tuitionFee}</li>
                      <li>Admission Fee: ₹{selectedStructure.components.admissionFee}</li>
                      <li>Exam Fee: ₹{selectedStructure.components.examFee}</li>
                      <li>Library Fee: ₹{selectedStructure.components.libraryFee}</li>
                      <li>Lab Fee: ₹{selectedStructure.components.labFee}</li>
                      <li>Sports Fee: ₹{selectedStructure.components.sportsFee}</li>
                      <li>Miscellaneous: ₹{selectedStructure.components.miscellaneous}</li>
                    </ul>
                    <div className="mt-2"><strong>Installment Details:</strong></div>
                    <ul className="ml-4">
                      {selectedStructure.installments.amounts.map((amt, idx) => (
                        <li key={idx}>Installment {idx + 1}: ₹{amt} (Due: {selectedStructure.installments.dueDates[idx]})</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {/* Add Fee Structure Dialog */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add Fee Structure</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Academic Year</Label>
                    <Input value={newStructure.academicYear} onChange={e => setNewStructure(ns => ({ ...ns, academicYear: e.target.value }))} placeholder="2024-25" />
                  </div>
                  <div>
                    <Label>Class</Label>
                    <Input value={newStructure.class} onChange={e => setNewStructure(ns => ({ ...ns, class: e.target.value }))} placeholder="10" />
                  </div>
                  <div>
                    <Label>Tuition Fee</Label>
                    <Input type="number" value={newStructure.tuitionFee} onChange={e => setNewStructure(ns => ({ ...ns, tuitionFee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Admission Fee</Label>
                    <Input type="number" value={newStructure.admissionFee} onChange={e => setNewStructure(ns => ({ ...ns, admissionFee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Exam Fee</Label>
                    <Input type="number" value={newStructure.examFee} onChange={e => setNewStructure(ns => ({ ...ns, examFee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Library Fee</Label>
                    <Input type="number" value={newStructure.libraryFee} onChange={e => setNewStructure(ns => ({ ...ns, libraryFee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Lab Fee</Label>
                    <Input type="number" value={newStructure.labFee} onChange={e => setNewStructure(ns => ({ ...ns, labFee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Sports Fee</Label>
                    <Input type="number" value={newStructure.sportsFee} onChange={e => setNewStructure(ns => ({ ...ns, sportsFee: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Miscellaneous</Label>
                    <Input type="number" value={newStructure.miscellaneous} onChange={e => setNewStructure(ns => ({ ...ns, miscellaneous: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Other Fee Name</Label>
                    <Input value={newStructure.customFeeName} onChange={e => setNewStructure(ns => ({ ...ns, customFeeName: e.target.value }))} placeholder="Transport, Hostel, etc." />
                  </div>
                  <div>
                    <Label>Other Fee Amount</Label>
                    <Input type="number" value={newStructure.customFeeAmount} onChange={e => setNewStructure(ns => ({ ...ns, customFeeAmount: Number(e.target.value) }))} />
                  </div>
                  <div>
                    <Label>Installment Count</Label>
                    <Input type="number" min={1} max={12} value={newStructure.installmentCount} onChange={e => handleInstallmentCountChange(Number(e.target.value))} />
                  </div>
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
