import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function VisitorManagement() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("register");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for visitors
  const [visitors, setVisitors] = useState([
    {
      id: 1,
      name: "John Smith",
      phone: "+1-234-567-8901",
      email: "john.smith@email.com",
      purpose: "Parent Meeting",
      personToMeet: "Mrs. Johnson (Class Teacher)",
      department: "Grade 5-A",
      checkIn: "2024-01-15 09:30 AM",
      checkOut: "2024-01-15 10:45 AM",
      status: "Completed",
      idProof: "Driver's License",
      vehicleNumber: "ABC-123",
      address: "123 Main Street, City"
    },
    {
      id: 2,
      name: "Sarah Davis",
      phone: "+1-234-567-8902",
      email: "sarah.davis@email.com",
      purpose: "Interview",
      personToMeet: "Dr. Anderson (Principal)",
      department: "Administration",
      checkIn: "2024-01-15 11:00 AM",
      checkOut: null,
      status: "In Progress",
      idProof: "Passport",
      vehicleNumber: "XYZ-789",
      address: "456 Oak Avenue, City"
    },
    {
      id: 3,
      name: "Mike Wilson",
      phone: "+1-234-567-8903",
      email: "mike.wilson@email.com",
      purpose: "Maintenance",
      personToMeet: "Tom Rodriguez (Facilities)",
      department: "Facilities",
      checkIn: "2024-01-15 08:00 AM",
      checkOut: "2024-01-15 12:00 PM",
      status: "Completed",
      idProof: "Employee ID",
      vehicleNumber: "DEF-456",
      address: "789 Pine Street, City"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "In Progress":
        return <Badge variant="secondary" className="bg-blue-500 text-white"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "Cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.personToMeet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('visitor.title') || 'Visitor Management'}</h1>
          <p className="text-muted-foreground">Manage and track all school visitors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Visitors</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Currently Inside</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">9</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="register">{t('visitor.register') || 'Register Visitor'}</TabsTrigger>
          <TabsTrigger value="active">{t('visitor.active') || 'Active Visitors'}</TabsTrigger>
          <TabsTrigger value="history">{t('visitor.history') || 'Visitor History'}</TabsTrigger>
          <TabsTrigger value="analytics">{t('visitor.analytics') || 'Analytics'}</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                New Visitor Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visitorName">Full Name *</Label>
                  <Input id="visitorName" placeholder="Enter visitor's full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID proof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drivers-license">Driver's License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="national-id">National ID</SelectItem>
                      <SelectItem value="employee-id">Employee ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Visit *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent-meeting">Parent Meeting</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="official">Official Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personToMeet">Person to Meet *</Label>
                  <Input id="personToMeet" placeholder="Enter person/department to meet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input id="vehicleNumber" placeholder="Enter vehicle number (if applicable)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedDuration">Expected Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hr">1 hour</SelectItem>
                      <SelectItem value="2hr">2 hours</SelectItem>
                      <SelectItem value="halfday">Half day</SelectItem>
                      <SelectItem value="fullday">Full day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter complete address" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Textarea id="remarks" placeholder="Any additional information or special instructions" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register & Check In
                </Button>
                <Button variant="outline" className="flex-1">
                  Register Only
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Currently Active Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitors.filter(v => v.status === "In Progress").map((visitor) => (
                  <Card key={visitor.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold">{visitor.name}</h3>
                            <p className="text-sm text-muted-foreground">{visitor.purpose}</p>
                          </div>
                          <div>
                            <p className="text-sm"><strong>Meeting:</strong> {visitor.personToMeet}</p>
                            <p className="text-sm text-muted-foreground">Check-in: {visitor.checkIn}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(visitor.status)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Visitor Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <p className="font-medium">{visitor.name}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="font-medium">{visitor.phone}</p>
                                </div>
                                <div>
                                  <Label>Purpose</Label>
                                  <p className="font-medium">{visitor.purpose}</p>
                                </div>
                                <div>
                                  <Label>Meeting With</Label>
                                  <p className="font-medium">{visitor.personToMeet}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Check Out
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Visitor History
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search visitors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Person/Dept</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell>{visitor.purpose}</TableCell>
                      <TableCell>{visitor.personToMeet}</TableCell>
                      <TableCell>{visitor.checkIn}</TableCell>
                      <TableCell>{visitor.checkOut || '-'}</TableCell>
                      <TableCell>{getStatusBadge(visitor.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Visitor Details - {visitor.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <Label>Full Name</Label>
                                      <p className="font-medium">{visitor.name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <Label>Phone</Label>
                                      <p className="font-medium">{visitor.phone}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <Label>Email</Label>
                                      <p className="font-medium">{visitor.email}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label>Purpose of Visit</Label>
                                    <p className="font-medium">{visitor.purpose}</p>
                                  </div>
                                  <div>
                                    <Label>Meeting With</Label>
                                    <p className="font-medium">{visitor.personToMeet}</p>
                                  </div>
                                  <div>
                                    <Label>Department</Label>
                                    <p className="font-medium">{visitor.department}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Check In Time</Label>
                                  <p className="font-medium">{visitor.checkIn}</p>
                                </div>
                                <div>
                                  <Label>Check Out Time</Label>
                                  <p className="font-medium">{visitor.checkOut || 'Still inside'}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>ID Proof</Label>
                                  <p className="font-medium">{visitor.idProof}</p>
                                </div>
                                <div>
                                  <Label>Vehicle Number</Label>
                                  <p className="font-medium">{visitor.vehicleNumber}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                  <Label>Address</Label>
                                  <p className="font-medium">{visitor.address}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive visitor analytics and reporting will be available here.
                </p>
                <Button variant="outline">View Detailed Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}