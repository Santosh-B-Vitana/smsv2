import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground, AnimatedWrapper, ModernCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, MapPin, Route as RouteIcon, Users, Clock, Phone, Navigation, Plus, Settings, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GPSTrackingManager } from "./GPSTrackingManager";
import { RouteOptimizationManager } from "./RouteOptimizationManager";

interface BusRoute {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  studentsAssigned: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'inactive' | 'maintenance';
  gpsEnabled: boolean;
}

interface Student {
  id: string;
  name: string;
  class: string;
  busRoute: string;
  pickupPoint: string;
  pickupTime: string;
  guardianPhone: string;
}

export function TransportManager() {
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([
    {
      id: "ROUTE001",
      routeName: "North Route - Sector 1-5",
      busNumber: "SCH-001",
      driverName: "Rajesh Kumar",
      driverPhone: "+91-9876543210", 
      capacity: 45,
      studentsAssigned: 38,
      startTime: "07:00",
      endTime: "17:30",
      status: "active",
      gpsEnabled: true
    },
    {
      id: "ROUTE002",
      routeName: "South Route - Sector 6-10",
      busNumber: "SCH-002", 
      driverName: "Amit Singh",
      driverPhone: "+91-9876543211",
      capacity: 50,
      studentsAssigned: 42,
      startTime: "07:15", 
      endTime: "17:45",
      status: "active",
      gpsEnabled: true
    },
    {
      id: "ROUTE003",
      routeName: "East Route - Market Area",
      busNumber: "SCH-003",
      driverName: "Suresh Patel", 
      driverPhone: "+91-9876543212",
      capacity: 40,
      studentsAssigned: 35,
      startTime: "06:45",
      endTime: "17:15", 
      status: "maintenance",
      gpsEnabled: false
    }
  ]);

  const [transportStudents, setTransportStudents] = useState<Student[]>([
    {
      id: "STU001",
      name: "Alice Johnson",
      class: "10-A",
      busRoute: "ROUTE001",
      pickupPoint: "Sector 2 Main Gate",
      pickupTime: "07:15",
      guardianPhone: "+91-9876543220"
    },
    {
      id: "STU002",
      name: "David Chen",
      class: "10-A",
      busRoute: "ROUTE001",
      pickupPoint: "Sector 3 Bus Stand",
      pickupTime: "07:20",
      guardianPhone: "+91-9876543221"
    },
    {
      id: "STU003",
      name: "Emma Wilson",
      class: "9-B",
      busRoute: "ROUTE002",
      pickupPoint: "Sector 7 Metro Station",
      pickupTime: "07:25",
      guardianPhone: "+91-9876543222"
    }
  ]);

  // State for editing student
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditDialogOpen(true);
  };

  const handleEditStudentChange = (field: keyof Student, value: string) => {
    if (!editingStudent) return;
    setEditingStudent({ ...editingStudent, [field]: value });
  };

  const handleEditStudentSave = () => {
    if (!editingStudent) return;
    setTransportStudents(students => students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditDialogOpen(false);
    setEditingStudent(null);
  };

  const { toast } = useToast();

  // Students tab - search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");

  const filteredStudents = transportStudents.filter((s) => {
    const matchesSearch = !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = classFilter === "all" || s.class === classFilter;
    const matchesRoute = routeFilter === "all" || s.busRoute === routeFilter;

    return matchesSearch && matchesClass && matchesRoute;
  });

  const sendLocationUpdate = (routeId: string) => {
    const route = busRoutes.find(r => r.id === routeId);
    toast({
      title: "Location Update Sent",
      description: `GPS location sent to parents of students in ${route?.routeName}`,
    });
  };

  const emergencyAlert = (routeId: string) => {
    const route = busRoutes.find(r => r.id === routeId);
    toast({
      title: "Emergency Alert Sent",
      description: `Emergency notification sent to all guardians in ${route?.routeName}`,
      variant: "destructive"
    });
  };

  const getRouteStudents = (routeId: string) => {
    return transportStudents.filter(student => student.busRoute === routeId);
  };

  // Add Route Dialog State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    routeName: "",
    busNumber: "",
    driverName: "",
    driverPhone: "",
    capacity: 40,
    startTime: "07:00",
    endTime: "17:00",
    status: "active",
    gpsEnabled: false,
  });

  const handleAddRoute = () => {
    setBusRoutes([
      ...busRoutes,
      {
        id: `ROUTE${busRoutes.length + 1}`,
        studentsAssigned: 0,
        ...newRoute,
        status: newRoute.status as 'active' | 'inactive' | 'maintenance',
      },
    ]);
    setAddDialogOpen(false);
    setNewRoute({
      routeName: "",
      busNumber: "",
      driverName: "",
      driverPhone: "",
      capacity: 40,
      startTime: "07:00",
      endTime: "17:00",
      status: "active",
      gpsEnabled: false,
    });
  };

  return (
    <div className="space-y-6 relative">
      <AnimatedBackground variant="mesh" className="fixed inset-0 -z-10 opacity-30" />
      <AnimatedWrapper variant="fadeInUp">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Transport Management System</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Route
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Bus Route</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <Label>Route Name</Label>
                <Input value={newRoute.routeName} onChange={e => setNewRoute(r => ({ ...r, routeName: e.target.value }))} />
              </div>
              <div>
                <Label>Bus Number</Label>
                <Input value={newRoute.busNumber} onChange={e => setNewRoute(r => ({ ...r, busNumber: e.target.value }))} />
              </div>
              <div>
                <Label>Driver Name</Label>
                <Input value={newRoute.driverName} onChange={e => setNewRoute(r => ({ ...r, driverName: e.target.value }))} />
              </div>
              <div>
                <Label>Driver Phone</Label>
                <Input value={newRoute.driverPhone} onChange={e => setNewRoute(r => ({ ...r, driverPhone: e.target.value }))} />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input type="number" value={newRoute.capacity} onChange={e => setNewRoute(r => ({ ...r, capacity: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={newRoute.status} onValueChange={val => setNewRoute(r => ({ ...r, status: val as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={newRoute.startTime} onChange={e => setNewRoute(r => ({ ...r, startTime: e.target.value }))} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={newRoute.endTime} onChange={e => setNewRoute(r => ({ ...r, endTime: e.target.value }))} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="gpsEnabled" checked={newRoute.gpsEnabled} onChange={e => setNewRoute(r => ({ ...r, gpsEnabled: e.target.checked }))} />
                <Label htmlFor="gpsEnabled">GPS Enabled</Label>
              </div>
            </div>
            <Button onClick={handleAddRoute} className="w-full">Add Route</Button>
          </DialogContent>
        </Dialog>
      </div>

      </AnimatedWrapper>

      {/* Summary Cards */}
      <AnimatedWrapper variant="fadeInUp" delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busRoutes.length}</div>
            </CardContent>
          </ModernCard>
          
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {busRoutes.filter(r => r.status === 'active').length}
              </div>
            </CardContent>
          </ModernCard>
          
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Using Transport</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transportStudents.length}</div>
            </CardContent>
          </ModernCard>
          
          <ModernCard variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GPS Enabled</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {busRoutes.filter(r => r.gpsEnabled).length}
              </div>
            </CardContent>
          </ModernCard>
        </div>
      </AnimatedWrapper>

      <Tabs defaultValue="routes">
        <TabsList className="w-full flex overflow-x-auto scrollbar-hide">
          <TabsTrigger value="routes" className="flex-shrink-0">Bus Routes</TabsTrigger>
          <TabsTrigger value="students" className="flex-shrink-0">Students</TabsTrigger>
          <TabsTrigger value="gps" className="flex-shrink-0">GPS Tracking</TabsTrigger>
          <TabsTrigger value="optimization" className="flex-shrink-0">
            <TrendingUp className="h-4 w-4 mr-2" />
            Route Optimization
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-shrink-0">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bus Routes Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route Name</TableHead>
                    <TableHead>Bus Number</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Timing</TableHead>
                    <TableHead>GPS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {busRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.routeName}</TableCell>
                      <TableCell>{route.busNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div>{route.driverName}</div>
                          <div className="text-sm text-muted-foreground">{route.driverPhone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{route.capacity}</TableCell>
                      <TableCell>{route.studentsAssigned}/{route.capacity}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{route.startTime} - {route.endTime}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={route.gpsEnabled ? 'default' : 'secondary'}>
                          {route.gpsEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          route.status === 'active' ? 'default' :
                          route.status === 'maintenance' ? 'secondary' : 'outline'
                        }>
                          {route.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant={route.gpsEnabled ? "outline" : "ghost"}
                            size="sm"
                            title={route.gpsEnabled ? "Disable GPS" : "Enable GPS"}
                            onClick={() => {
                              setBusRoutes(busRoutes.map(r =>
                                r.id === route.id ? { ...r, gpsEnabled: !r.gpsEnabled } : r
                              ));
                            }}
                          >
                            <MapPin
                              className={
                                "h-3 w-3 transition-all " +
                                (route.gpsEnabled ? "text-blue-600" : "text-gray-400 line-through opacity-60")
                              }
                            />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Route Details - {route.routeName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Route Name</Label>
                                    <Input defaultValue={route.routeName} />
                                  </div>
                                  <div>
                                    <Label>Bus Number</Label>
                                    <Input defaultValue={route.busNumber} />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Driver Name</Label>
                                    <Input defaultValue={route.driverName} />
                                  </div>
                                  <div>
                                    <Label>Driver Phone</Label>
                                    <Input defaultValue={route.driverPhone} />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Route Description</Label>
                                  <Textarea placeholder="Describe the route stops and path..." />
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Capacity</Label>
                                    <Input type="number" defaultValue={route.capacity} />
                                  </div>
                                  <div>
                                    <Label>Start Time</Label>
                                    <Input type="time" defaultValue={route.startTime} />
                                  </div>
                                  <div>
                                    <Label>End Time</Label>
                                    <Input type="time" defaultValue={route.endTime} />
                                  </div>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Select defaultValue={route.status} onValueChange={val => {
                                    // Update status in busRoutes
                                    const updated = busRoutes.map(r => r.id === route.id ? { ...r, status: val as any } : r);
                                    setBusRoutes(updated);
                                  }}>
                                    <SelectTrigger className="w-40">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                      <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <DialogClose asChild>
                                  <Button className="w-full" onClick={() => {
                                    // Optionally, update route here if needed
                                  }}>Update Route</Button>
                                </DialogClose>
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
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students Transport Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <Input
                  placeholder="Search students by name or ID..."
                  className="w-full md:w-96"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {Array.from(new Set(transportStudents.map((s) => s.class))).map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={routeFilter} onValueChange={setRouteFilter}>
                  <SelectTrigger className="w-full md:w-56">
                    <SelectValue placeholder="Filter by Route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    {busRoutes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.routeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Student
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div>
                        <Label>Student Name</Label>
                        <Input placeholder="Enter name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Class</Label>
                          <Input placeholder="e.g. 10-A" />
                        </div>
                        <div>
                          <Label>Route</Label>
                          <Input placeholder="Route ID or Name" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Pickup Point</Label>
                          <Input placeholder="Pickup location" />
                        </div>
                        <div>
                          <Label>Pickup Time</Label>
                          <Input type="time" />
                        </div>
                      </div>
                      <div>
                        <Label>Guardian Phone</Label>
                        <Input placeholder="Phone number" />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Add Student</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Pickup Point</TableHead>
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Guardian Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const route = busRoutes.find((r) => r.id === student.busRoute);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{route?.routeName || 'Unassigned'}</TableCell>
                        <TableCell>{student.pickupPoint}</TableCell>
                        <TableCell>{student.pickupTime}</TableCell>
                        <TableCell>{student.guardianPhone}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog open={editDialogOpen && editingStudent?.id === student.id} onOpenChange={(open) => { if (!open) setEditDialogOpen(false); }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>Edit</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit Student</DialogTitle>
                                </DialogHeader>
                                {editingStudent && (
                                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEditStudentSave(); }}>
                                    <div>
                                      <Label>Student Name</Label>
                                      <Input value={editingStudent.name} onChange={(e) => handleEditStudentChange('name', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Class</Label>
                                        <Input value={editingStudent.class} onChange={(e) => handleEditStudentChange('class', e.target.value)} />
                                      </div>
                                      <div>
                                        <Label>Route</Label>
                                        <Input value={editingStudent.busRoute} onChange={(e) => handleEditStudentChange('busRoute', e.target.value)} />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Pickup Point</Label>
                                        <Input value={editingStudent.pickupPoint} onChange={(e) => handleEditStudentChange('pickupPoint', e.target.value)} />
                                      </div>
                                      <div>
                                        <Label>Pickup Time</Label>
                                        <Input type="time" value={editingStudent.pickupTime} onChange={(e) => handleEditStudentChange('pickupTime', e.target.value)} />
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Guardian Phone</Label>
                                      <Input value={editingStudent.guardianPhone} onChange={(e) => handleEditStudentChange('guardianPhone', e.target.value)} />
                                    </div>
                                    <div className="flex justify-end">
                                      <Button type="submit">Save</Button>
                                    </div>
                                  </form>
                                )}
                              </DialogContent>
                            </Dialog>
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

        <TabsContent value="gps">
          <GPSTrackingManager />
        </TabsContent>

        <TabsContent value="optimization">
          <RouteOptimizationManager />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parent Notifications & Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Automatic Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bus Departure Alert</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Student Pickup Confirmation</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Delay Notifications</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Drop-off Confirmation</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Send Manual Alert</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Select Route</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose route" />
                        </SelectTrigger>
                        <SelectContent>
                          {busRoutes.map((route) => (
                            <SelectItem key={route.id} value={route.id}>
                              {route.routeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Alert Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select alert type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delay">Bus Delay</SelectItem>
                          <SelectItem value="breakdown">Bus Breakdown</SelectItem>
                          <SelectItem value="route_change">Route Change</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Message</Label>
                      <Textarea placeholder="Enter alert message..." />
                    </div>
                    
                    <Button className="w-full">Send Alert</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
