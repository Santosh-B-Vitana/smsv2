import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Plus, RefreshCw, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeeComponent {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

interface FeeStructure {
  id: string;
  name: string;
  class: string;
  academicYear: string;
  components: FeeComponent[];
  totalAmount: number;
  createdAt: string;
}

export function ImprovedFeesManager() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([
    {
      id: "FS001",
      name: "Class 10 Fee Structure",
      class: "10",
      academicYear: "2024-25",
      components: [
        { id: "FC001", name: "Tuition Fee", amount: 25000, dueDate: "2024-04-15" },
        { id: "FC002", name: "Admission Fee", amount: 5000, dueDate: "2024-04-15" },
        { id: "FC003", name: "Exam Fee", amount: 2000, dueDate: "2024-07-15" }
      ],
      totalAmount: 32000,
      createdAt: "2024-01-15"
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStructure, setNewStructure] = useState({
    name: "",
    class: "",
    academicYear: "",
    components: [] as FeeComponent[]
  });

  const [currentFeeType, setCurrentFeeType] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [currentDueDate, setCurrentDueDate] = useState("");

  const { toast } = useToast();

  const feeTypes = [
    "Tuition Fee",
    "Admission Fee", 
    "Exam Fee",
    "Library Fee",
    "Lab Fee",
    "Sports Fee",
    "Transport Fee",
    "Hostel Fee",
    "Annual Function Fee",
    "Computer Fee",
    "Activity Fee",
    "Others"
  ];

  const addFeeComponent = () => {
    if (!currentFeeType || !currentAmount || !currentDueDate) {
      toast({
        title: "Error",
        description: "Please fill all fee component fields",
        variant: "destructive"
      });
      return;
    }

    const newComponent: FeeComponent = {
      id: `FC${Date.now()}`,
      name: currentFeeType,
      amount: Number(currentAmount),
      dueDate: currentDueDate
    };

    setNewStructure(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));

    setCurrentFeeType("");
    setCurrentAmount("");
    setCurrentDueDate("");
  };

  const removeFeeComponent = (componentId: string) => {
    setNewStructure(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== componentId)
    }));
  };

  const handleAddStructure = () => {
    if (!newStructure.name || !newStructure.class || !newStructure.academicYear || newStructure.components.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and add at least one fee component",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = newStructure.components.reduce((sum, comp) => sum + comp.amount, 0);

    const structure: FeeStructure = {
      id: `FS${Date.now()}`,
      name: newStructure.name,
      class: newStructure.class,
      academicYear: newStructure.academicYear,
      components: newStructure.components,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    setFeeStructures(prev => [...prev, structure]);
    setNewStructure({
      name: "",
      class: "",
      academicYear: "",
      components: []
    });
    setShowAddDialog(false);

    toast({
      title: "Success",
      description: "Fee structure added successfully"
    });
  };

  const refreshData = () => {
    // Simulate data refresh
    toast({
      title: "Refreshed",
      description: "Fee structure data has been refreshed"
    });
  };

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
                  <Button onClick={refreshData} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Fee Structure
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Add New Fee Structure</DialogTitle>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                          <div>
                            <Label>Structure Name</Label>
                            <Input
                              value={newStructure.name}
                              onChange={(e) => setNewStructure(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Class 10 Fee Structure"
                            />
                          </div>
                          <div>
                            <Label>Class</Label>
                            <Input
                              value={newStructure.class}
                              onChange={(e) => setNewStructure(prev => ({ ...prev, class: e.target.value }))}
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <Label>Academic Year</Label>
                            <Input
                              value={newStructure.academicYear}
                              onChange={(e) => setNewStructure(prev => ({ ...prev, academicYear: e.target.value }))}
                              placeholder="2024-25"
                            />
                          </div>

                          {/* Add Fee Component Section */}
                          <div className="space-y-3 border-t pt-4">
                            <Label className="text-lg font-semibold">Add Fee Components</Label>
                            
                            <div>
                              <Label>Fee Type</Label>
                              <Select value={currentFeeType} onValueChange={setCurrentFeeType}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fee type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {feeTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Amount (₹)</Label>
                              <Input
                                type="number"
                                value={currentAmount}
                                onChange={(e) => setCurrentAmount(e.target.value)}
                                placeholder="5000"
                              />
                            </div>

                            <div>
                              <Label>Due Date</Label>
                              <Input
                                type="date"
                                value={currentDueDate}
                                onChange={(e) => setCurrentDueDate(e.target.value)}
                              />
                            </div>

                            <Button onClick={addFeeComponent} className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Component
                            </Button>
                          </div>
                        </div>

                        {/* Fee Components List */}
                        <div className="space-y-4">
                          <Label className="text-lg font-semibold">Fee Components Added</Label>
                          
                          {newStructure.components.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No fee components added yet</p>
                              <p className="text-sm">Add components using the form on the left</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {newStructure.components.map((component) => (
                                <div key={component.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <div className="font-medium">{component.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      ₹{component.amount.toLocaleString()} • Due: {component.dueDate}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeFeeComponent(component.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              
                              <div className="border-t pt-2 mt-4">
                                <div className="flex justify-between font-semibold">
                                  <span>Total Amount:</span>
                                  <span>₹{newStructure.components.reduce((sum, comp) => sum + comp.amount, 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end mt-6">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddStructure}>
                          Save Fee Structure
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Structure Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructures.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell className="font-medium">{structure.name}</TableCell>
                      <TableCell>{structure.class}</TableCell>
                      <TableCell>{structure.academicYear}</TableCell>
                      <TableCell>{structure.components.length}</TableCell>
                      <TableCell>₹{structure.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No receipts generated yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}