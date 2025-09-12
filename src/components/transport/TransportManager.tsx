
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, MapPin, Route, Users, Clock, Phone, Navigation, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GPSTrackingManager } from "./GPSTrackingManager";

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
  const [busRoutes] = useState<BusRoute[]>([
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

  const [transportStudents] = useState<Student[]>([
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

  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transport Management System</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Route
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{busRoutes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {busRoutes.filter(r => r.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Using Transport</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transportStudents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPS Enabled</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {busRoutes.filter(r => r.gpsEnabled).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="routes">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">Bus Routes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="gps">GPS Tracking</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                          <Button variant="outline" size="sm" onClick={() => sendLocationUpdate(route.id)}>
                            <MapPin className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => emergencyAlert(route.id)}>
                            <Phone className="h-3 w-3" />
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
                                
                                <Button className="w-full">Update Route</Button>
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
            <CardContent>
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
                  {transportStudents.map((student) => {
                    const route = busRoutes.find(r => r.id === student.busRoute);
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
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">
                              <MapPin className="h-3 w-3" />
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

        <TabsContent value="gps">
          <GPSTrackingManager />
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
