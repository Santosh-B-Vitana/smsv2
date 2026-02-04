import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground, AnimatedWrapper, ModernCard } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building, Users, Bed, AlertTriangle, Plus, Edit, Eye, UserCheck, Calendar, DollarSign } from "lucide-react";
import { mockApi } from "@/services/mockApi";
import { ErrorBoundary, LoadingState, EmptyState, useConfirmDialog } from "@/components/common";

interface HostelBlock {
  id: string;
  name: string;
  type: 'boys' | 'girls' | 'mixed';
  totalRooms: number;
  occupiedRooms: number;
  capacity: number;
  currentOccupancy: number;
  warden: string;
  wardenContact: string;
  facilities: string[];
  status: 'active' | 'maintenance' | 'closed';
}

interface HostelRoom {
  id: string;
  blockId: string;
  roomNumber: string;
  type: 'single' | 'double' | 'triple' | 'quad';
  capacity: number;
  currentOccupancy: number;
  amenities: string[];
  monthlyRent: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
}

interface HostelStudent {
  id: string;
  studentId: string;
  name: string;
  class: string;
  blockId: string;
  roomId: string;
  bedNumber: number;
  checkInDate: string;
  guardianName: string;
  guardianContact: string;
  emergencyContact: string;
  medicalInfo: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  lastFeeDate: string;
  nextFeeDate: string;
  status: 'active' | 'on_leave' | 'checked_out';
}

interface HostelExpense {
  id: string;
  date: string;
  category: 'maintenance' | 'utilities' | 'food' | 'security' | 'supplies' | 'other';
  description: string;
  amount: number;
  approvedBy: string;
  status: 'pending' | 'approved' | 'paid';
}

const mockHostelBlocks: HostelBlock[] = [
  {
    id: "HB001",
    name: "Sunrise Block",
    type: "boys",
    totalRooms: 50,
    occupiedRooms: 45,
    capacity: 200,
    currentOccupancy: 180,
    warden: "Mr. Rajesh Kumar",
    wardenContact: "+91 9876543210",
    facilities: ["Wi-Fi", "Study Hall", "Recreation Room", "Laundry", "Canteen"],
    status: "active"
  },
  {
    id: "HB002",
    name: "Moonlight Block",
    type: "girls",
    totalRooms: 40,
    occupiedRooms: 38,
    capacity: 160,
    currentOccupancy: 152,
    warden: "Mrs. Priya Sharma",
    wardenContact: "+91 9876543211",
    facilities: ["Wi-Fi", "Study Hall", "Common Room", "Laundry", "Pantry"],
    status: "active"
  },
  {
    id: "HB003",
    name: "Galaxy Block",
    type: "boys",
    totalRooms: 30,
    occupiedRooms: 25,
    capacity: 120,
    currentOccupancy: 100,
    warden: "Mr. Suresh Patel",
    wardenContact: "+91 9876543212",
    facilities: ["Wi-Fi", "Study Hall", "Gym", "Laundry"],
    status: "maintenance"
  }
];

const mockHostelRooms: HostelRoom[] = [
  { id: "HR001", blockId: "HB001", roomNumber: "101", type: "quad", capacity: 4, currentOccupancy: 4, amenities: ["AC", "Attached Bathroom", "Study Table"], monthlyRent: 8000, status: "occupied" },
  { id: "HR002", blockId: "HB001", roomNumber: "102", type: "quad", capacity: 4, currentOccupancy: 3, amenities: ["Fan", "Common Bathroom", "Study Table"], monthlyRent: 6000, status: "occupied" },
  { id: "HR003", blockId: "HB001", roomNumber: "103", type: "double", capacity: 2, currentOccupancy: 0, amenities: ["AC", "Attached Bathroom", "Study Table", "Balcony"], monthlyRent: 12000, status: "available" },
  { id: "HR004", blockId: "HB002", roomNumber: "201", type: "triple", capacity: 3, currentOccupancy: 3, amenities: ["Fan", "Attached Bathroom", "Study Table"], monthlyRent: 7000, status: "occupied" },
  { id: "HR005", blockId: "HB002", roomNumber: "202", type: "single", capacity: 1, currentOccupancy: 1, amenities: ["AC", "Attached Bathroom", "Study Table", "Wardrobe"], monthlyRent: 15000, status: "occupied" }
];

const mockHostelStudents: HostelStudent[] = [
  {
    id: "HS001",
    studentId: "STU001",
    name: "Arjun Mehta",
    class: "10-A",
    blockId: "HB001",
    roomId: "HR001",
    bedNumber: 1,
    checkInDate: "2024-04-15",
    guardianName: "Mr. Vijay Mehta",
    guardianContact: "+91 9988776655",
    emergencyContact: "+91 9988776656",
    medicalInfo: "No known allergies",
    feeStatus: "paid",
    lastFeeDate: "2024-12-01",
    nextFeeDate: "2025-01-01",
    status: "active"
  },
  {
    id: "HS002",
    studentId: "STU002",
    name: "Sneha Patel",
    class: "11-B",
    blockId: "HB002",
    roomId: "HR004",
    bedNumber: 2,
    checkInDate: "2024-04-20",
    guardianName: "Mrs. Sunita Patel",
    guardianContact: "+91 9988776657",
    emergencyContact: "+91 9988776658",
    medicalInfo: "Asthmatic - carries inhaler",
    feeStatus: "pending",
    lastFeeDate: "2024-11-01",
    nextFeeDate: "2024-12-01",
    status: "active"
  }
];

const mockHostelExpenses: HostelExpense[] = [
  {
    id: "HE001",
    date: "2024-12-15",
    category: "maintenance",
    description: "Plumbing repairs in Block A",
    amount: 15000,
    approvedBy: "Principal",
    status: "approved"
  },
  {
    id: "HE002",
    date: "2024-12-14",
    category: "utilities",
    description: "Electricity bill for December",
    amount: 45000,
    approvedBy: "Admin",
    status: "paid"
  }
];

export function HostelManager() {
  const [hostelBlocks, setHostelBlocks] = useState<HostelBlock[]>(mockHostelBlocks);
  const [hostelRooms, setHostelRooms] = useState<HostelRoom[]>(mockHostelRooms);
  const [hostelStudents, setHostelStudents] = useState<HostelStudent[]>(mockHostelStudents);
  const [hostelExpenses, setHostelExpenses] = useState<HostelExpense[]>(mockHostelExpenses);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<HostelRoom | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<HostelStudent | null>(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await mockApi.getStudents();
        setStudents(studentsData);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load hostel data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getBlockStudents = (blockId: string) => {
    return hostelStudents.filter(student => student.blockId === blockId);
  };

  const getRoomStudents = (roomId: string) => {
    return hostelStudents.filter(student => student.roomId === roomId);
  };

  const filteredRooms = hostelRooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === "all" || room.blockId === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  const totalCapacity = hostelBlocks.reduce((sum, block) => sum + block.capacity, 0);
  const totalOccupancy = hostelBlocks.reduce((sum, block) => sum + block.currentOccupancy, 0);
  const occupancyRate = totalCapacity > 0 ? (totalOccupancy / totalCapacity * 100).toFixed(1) : "0";
  const pendingFees = hostelStudents.filter(student => student.feeStatus === 'pending' || student.feeStatus === 'overdue').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'available': case 'paid': case 'approved': return 'bg-success text-success-foreground';
      case 'occupied': case 'pending': return 'bg-warning text-warning-foreground';
      case 'maintenance': case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'closed': case 'checked_out': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return <LoadingState variant="cards" rows={4} message="Loading hostel data..." />;
  }

  return (
    <ErrorBoundary>
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 relative">
      <AnimatedBackground variant="mesh" className="fixed inset-0 -z-10 opacity-30" />
      <AnimatedWrapper variant="fadeInUp">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Hostel Management</h2>
            <p className="text-muted-foreground">
              Manage hostel blocks, rooms, student accommodations, and expenses
            </p>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Summary Cards */}
      <AnimatedWrapper variant="fadeInUp" delay={0.1}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hostelBlocks.length}</div>
              <p className="text-xs text-muted-foreground">
                {hostelBlocks.filter(b => b.status === 'active').length} active
              </p>
            </CardContent>
          </ModernCard>
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">
                {totalOccupancy} / {totalCapacity} students
              </p>
            </CardContent>
          </ModernCard>
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hostelRooms.filter(r => r.status === 'available').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of {hostelRooms.length} total rooms
              </p>
            </CardContent>
          </ModernCard>
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingFees}</div>
              <p className="text-xs text-muted-foreground">
                Students with pending payments
              </p>
            </CardContent>
          </ModernCard>
        </div>
      </AnimatedWrapper>

      <Tabs defaultValue="blocks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blocks">Hostel Blocks</TabsTrigger>
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="students">Student Accommodation</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hostel Blocks Overview</CardTitle>
              <CardDescription>
                Manage hostel blocks and their basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Block Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Warden</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hostelBlocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">{block.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {block.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{block.occupiedRooms}/{block.totalRooms}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{block.currentOccupancy}/{block.capacity}</span>
                          <span className="text-xs text-muted-foreground">
                            {((block.currentOccupancy / block.capacity) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{block.warden}</span>
                          <span className="text-xs text-muted-foreground">{block.wardenContact}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(block.status)}>
                          {block.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                {hostelBlocks.map((block) => (
                  <SelectItem key={block.id} value={block.id}>
                    {block.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Room Management</CardTitle>
              <CardDescription>
                Manage individual rooms and their occupancy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room No.</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => {
                    const block = hostelBlocks.find(b => b.id === room.blockId);
                    const roomStudents = getRoomStudents(room.id);
                    return (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.roomNumber}</TableCell>
                        <TableCell>{block?.name}</TableCell>
                        <TableCell className="capitalize">{room.type}</TableCell>
                        <TableCell>{room.currentOccupancy}/{room.capacity}</TableCell>
                        <TableCell>₹{room.monthlyRent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(room.status)}>
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedRoom(room);
                                setIsRoomDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => setIsStudentDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Accommodation</CardTitle>
              <CardDescription>
                Manage student hostel assignments and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Block & Room</TableHead>
                    <TableHead>Guardian Contact</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hostelStudents
                    .filter(student => 
                      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.class.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((student) => {
                      const block = hostelBlocks.find(b => b.id === student.blockId);
                      const room = hostelRooms.find(r => r.id === student.roomId);
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{student.name}</span>
                              <span className="text-xs text-muted-foreground">ID: {student.studentId}</span>
                            </div>
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{block?.name}</span>
                              <span className="text-xs text-muted-foreground">
                                Room {room?.roomNumber} - Bed {student.bedNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{student.guardianName}</span>
                              <span className="text-xs text-muted-foreground">{student.guardianContact}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(student.feeStatus)}>
                              {student.feeStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(student.status)}>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setIsStudentDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Button onClick={() => setIsExpenseDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hostel Expenses</CardTitle>
              <CardDescription>
                Track and manage hostel-related expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hostelExpenses
                    .filter(expense => 
                      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                        <TableCell>{expense.approvedBy}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(expense.status)}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Room Details Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>
              View room information and current occupants
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Room Number</Label>
                  <p className="text-sm text-muted-foreground">{selectedRoom.roomNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedRoom.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Capacity</Label>
                  <p className="text-sm text-muted-foreground">{selectedRoom.capacity} students</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Monthly Rent</Label>
                  <p className="text-sm text-muted-foreground">₹{selectedRoom.monthlyRent.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Amenities</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Current Occupants</Label>
                <div className="mt-2 space-y-2">
                  {getRoomStudents(selectedRoom.id).map((student) => (
                    <div key={student.id} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">{student.name}</span>
                      <Badge variant="outline">Bed {student.bedNumber}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </ErrorBoundary>
  );
}