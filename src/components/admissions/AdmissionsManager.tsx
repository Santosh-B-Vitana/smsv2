
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Users, Calendar, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Admission {
  id: string;
  studentName: string;
  guardianName: string;
  phone: string;
  email: string;
  appliedClass: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  previousSchool?: string;
  address: string;
  dateOfBirth: string;
}

const mockAdmissions: Admission[] = [
  {
    id: "ADM001",
  studentName: "Ananya Sharma",
  guardianName: "Rekha Sharma",
    phone: "+1 (555) 123-4567",
    email: "michael.williams@email.com",
    appliedClass: "Grade 6",
    applicationDate: "2024-01-15",
    status: "pending",
    previousSchool: "Riverside Elementary",
    address: "123 Oak Street, Learning City",
    dateOfBirth: "2012-05-10"
  },
  {
    id: "ADM002",
  studentName: "Aarav Gupta",
  guardianName: "Suresh Gupta",
    phone: "+1 (555) 987-6543",
    email: "maria.rodriguez@email.com",
    appliedClass: "Grade 8",
    applicationDate: "2024-01-12",
    status: "approved",
    previousSchool: "Central Middle School",
    address: "456 Pine Avenue, Learning City",
    dateOfBirth: "2010-08-22"
  },
  {
    id: "ADM003",
  studentName: "Priya Yadav",
  guardianName: "Meena Yadav",
    phone: "+1 (555) 555-0123",
    email: "david.chen@email.com",
    appliedClass: "Grade 10",
    applicationDate: "2024-01-10",
    status: "waitlisted",
    address: "789 Elm Street, Learning City",
    dateOfBirth: "2008-12-03"
  }
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  waitlisted: "bg-blue-100 text-blue-800"
};

export function AdmissionsManager() {
  const [admissions, setAdmissions] = useState<Admission[]>(mockAdmissions);
  const [filteredAdmissions, setFilteredAdmissions] = useState<Admission[]>(mockAdmissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter logic
  useEffect(() => {
    let filtered = admissions;

    if (searchTerm) {
      filtered = filtered.filter(admission =>
        admission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admission.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(admission => admission.status === statusFilter);
    }

    if (classFilter !== "all") {
      filtered = filtered.filter(admission => admission.appliedClass === classFilter);
    }

    setFilteredAdmissions(filtered);
  }, [admissions, searchTerm, statusFilter, classFilter]);

  const updateAdmissionStatus = (id: string, newStatus: Admission['status']) => {
    setAdmissions(prev => 
      prev.map(admission => 
        admission.id === id ? { ...admission, status: newStatus } : admission
      )
    );
    toast({
      title: "Status Updated",
      description: `Admission status has been updated to ${newStatus}.`
    });
  };

  const getUniqueClasses = () => {
    const classes = [...new Set(admissions.map(admission => admission.appliedClass))];
    return classes.sort();
  };

  const getStatusCounts = () => {
    return {
      total: admissions.length,
      pending: admissions.filter(a => a.status === 'pending').length,
      approved: admissions.filter(a => a.status === 'approved').length,
      rejected: admissions.filter(a => a.status === 'rejected').length,
      waitlisted: admissions.filter(a => a.status === 'waitlisted').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admissions</h1>
          <p className="text-muted-foreground">Manage student admission applications</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Admission Application</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input id="studentName" placeholder="Enter student name" />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guardianName">Guardian Name</Label>
                  <Input id="guardianName" placeholder="Enter guardian name" />
                </div>
                <div>
                  <Label htmlFor="appliedClass">Applied Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-6">Grade 6</SelectItem>
                      <SelectItem value="grade-7">Grade 7</SelectItem>
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter full address" />
              </div>
              <div>
                <Label htmlFor="previousSchool">Previous School (Optional)</Label>
                <Input id="previousSchool" placeholder="Enter previous school name" />
              </div>
              <Button className="w-full">Submit Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-semibold">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold">{statusCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-semibold">{statusCounts.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Waitlisted</p>
                <p className="text-xl font-semibold">{statusCounts.waitlisted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-xl font-semibold">{statusCounts.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by student name, guardian, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {getUniqueClasses().map(className => (
                  <SelectItem key={className} value={className}>{className}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admission Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Applied Class</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell className="font-medium">{admission.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{admission.studentName}</p>
                        <p className="text-sm text-muted-foreground">DOB: {admission.dateOfBirth}</p>
                      </div>
                    </TableCell>
                    <TableCell>{admission.guardianName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{admission.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{admission.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{admission.appliedClass}</TableCell>
                    <TableCell>{admission.applicationDate}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[admission.status]}>
                        {admission.status.charAt(0).toUpperCase() + admission.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={admission.status}
                        onValueChange={(value) => updateAdmissionStatus(admission.id, value as Admission['status'])}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="waitlisted">Waitlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
