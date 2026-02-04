import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground, AnimatedWrapper, ModernCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Shield, Thermometer, AlertTriangle, Search, Plus, Calendar, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi, Student } from "../../services/mockApi";
import { ErrorBoundary, LoadingState, EmptyState } from "@/components/common";

interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  recordType: 'checkup' | 'vaccination' | 'illness' | 'injury' | 'allergy';
  date: string;
  description: string;
  treatedBy: string;
  medication?: string;
  followUp?: string;
  status: 'active' | 'resolved' | 'ongoing';
  priority: 'low' | 'medium' | 'high';
}

interface VaccinationRecord {
  id: string;
  studentId: string;
  studentName: string;
  vaccineName: string;
  date: string;
  nextDue?: string;
  batchNumber: string;
  administeredBy: string;
  status: 'completed' | 'due' | 'overdue';
}

interface MedicalProfile {
  studentId: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  doctor: string;
  insurance: string;
}

const mockHealthRecords: HealthRecord[] = [
  {
    id: "HR001",
    studentId: "STU001",
    studentName: "Alice Johnson",
    recordType: "checkup",
    date: "2024-01-15",
    description: "Annual health checkup - all parameters normal",
    treatedBy: "Dr. Smith",
    status: "resolved",
    priority: "low"
  },
  {
    id: "HR002",
    studentId: "STU002",
    studentName: "David Chen",
    recordType: "allergy",
    date: "2024-01-20",
    description: "Allergic reaction to peanuts - mild symptoms",
    treatedBy: "School Nurse",
    medication: "Antihistamine",
    status: "active",
    priority: "high"
  }
];

const mockVaccinations: VaccinationRecord[] = [
  {
    id: "VAC001",
    studentId: "STU001",
    studentName: "Alice Johnson",
    vaccineName: "MMR",
    date: "2023-06-15",
    nextDue: "2025-06-15",
    batchNumber: "MMR2023-001",
    administeredBy: "Dr. Johnson",
    status: "completed"
  },
  {
    id: "VAC002",
    studentId: "STU002",
    studentName: "David Chen",
    vaccineName: "Hepatitis B",
    date: "2024-01-10",
    batchNumber: "HEP2024-002",
    administeredBy: "School Nurse",
    status: "completed"
  }
];

export function HealthManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(mockVaccinations);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showAddVaccination, setShowAddVaccination] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await mockApi.getStudents();
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load health data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || record.recordType === filterType;
    return matchesSearch && matchesType;
  });

  const activeIssues = healthRecords.filter(r => r.status === 'active' || r.status === 'ongoing');
  const highPriorityIssues = healthRecords.filter(r => r.priority === 'high' && r.status !== 'resolved');
  const dueVaccinations = vaccinations.filter(v => v.status === 'due' || v.status === 'overdue');

  const addHealthRecord = async (studentId: string, recordType: string, description: string, treatedBy: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) throw new Error("Student not found");

      const newRecord: HealthRecord = {
        id: `HR${String(healthRecords.length + 1).padStart(3, '0')}`,
        studentId,
        studentName: student.name,
        recordType: recordType as any,
        date: new Date().toISOString().split('T')[0],
        description,
        treatedBy,
        status: recordType === 'checkup' ? 'resolved' : 'active',
        priority: recordType === 'allergy' || recordType === 'injury' ? 'high' : 'medium'
      };

      setHealthRecords(prev => [...prev, newRecord]);
      toast({
        title: "Success",
        description: "Health record added successfully"
      });
      setShowAddRecord(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add health record",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <LoadingState variant="cards" rows={3} message="Loading health records..." />;
  }

  return (
    <ErrorBoundary>
    <div className="space-y-6 relative">
      <AnimatedBackground variant="mesh" className="fixed inset-0 -z-10 opacity-30" />
      <AnimatedWrapper variant="fadeInUp">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Health Management</h1>
            <p className="text-muted-foreground">Track student health records and vaccinations</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddRecord(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
            <Button onClick={() => setShowAddVaccination(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vaccination
            </Button>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Stats Cards */}
      <AnimatedWrapper variant="fadeInUp" delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ModernCard variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{healthRecords.length}</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </ModernCard>
          
          <ModernCard variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                  <p className="text-2xl font-bold">{activeIssues.length}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </ModernCard>
          
          <ModernCard variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold">{highPriorityIssues.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </ModernCard>
          
          <ModernCard variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due Vaccinations</p>
                  <p className="text-2xl font-bold">{dueVaccinations.length}</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </ModernCard>
        </div>
      </AnimatedWrapper>

      <Card>
        <CardHeader>
          <CardTitle>Health Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records" className="space-y-4">
            <TabsList>
              <TabsTrigger value="records">Health Records</TabsTrigger>
              <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
              <TabsTrigger value="profiles">Medical Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="illness">Illness</SelectItem>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="allergy">Allergy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Treated By</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.recordType}</Badge>
                      </TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                      <TableCell>{record.treatedBy}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.priority === 'high' ? 'destructive' : 
                          record.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {record.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === 'active' ? 'destructive' : 
                          record.status === 'ongoing' ? 'default' : 'secondary'
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="vaccinations" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Vaccine</TableHead>
                    <TableHead>Date Given</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Administered By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaccinations.map((vaccination) => (
                    <TableRow key={vaccination.id}>
                      <TableCell className="font-medium">{vaccination.studentName}</TableCell>
                      <TableCell>{vaccination.vaccineName}</TableCell>
                      <TableCell>{new Date(vaccination.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {vaccination.nextDue ? new Date(vaccination.nextDue).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{vaccination.batchNumber}</TableCell>
                      <TableCell>{vaccination.administeredBy}</TableCell>
                      <TableCell>
                        <Badge variant={
                          vaccination.status === 'completed' ? 'default' : 
                          vaccination.status === 'due' ? 'default' : 'destructive'
                        }>
                          {vaccination.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="profiles" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.slice(0, 6).map((student) => (
                  <Card key={student.id}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Class {student.class}-{student.section}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Blood Group:</span>
                        <span className="font-medium">A+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Allergies:</span>
                        <span className="font-medium">None</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Emergency:</span>
                        <span className="font-medium">{student.guardianPhone}</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-3">
                        View Full Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Health Record Dialog */}
      <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Health Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Student</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - Class {student.class}-{student.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Record Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="illness">Illness</SelectItem>
                  <SelectItem value="injury">Injury</SelectItem>
                  <SelectItem value="allergy">Allergy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the health issue or checkup..." />
            </div>
            <div>
              <Label>Treated By</Label>
              <Input placeholder="Doctor/Nurse name" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddRecord(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // This would use actual form values
                addHealthRecord("STU001", "checkup", "Regular checkup", "Dr. Smith");
              }}>
                Add Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ErrorBoundary>
  );
}
