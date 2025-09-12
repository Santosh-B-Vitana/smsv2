import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, Calendar, Mail, Phone, MapPin, Plus, Search, Filter, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";

interface Alumni {
  id: string;
  name: string;
  graduationYear: string;
  class: string;
  currentOccupation: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  achievements: string;
  photoUrl?: string;
  isStarAlumni: boolean;
  createdAt: string;
}

interface AlumniMeet {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  attendees: string[];
  status: 'planned' | 'completed' | 'cancelled';
}

export default function Alumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [alumniMeets, setAlumniMeets] = useState<AlumniMeet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMeetDialog, setShowMeetDialog] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    class: '',
    currentOccupation: '',
    company: '',
    location: '',
    email: '',
    phone: '',
    achievements: '',
    isStarAlumni: false
  });

  const [meetData, setMeetData] = useState({
    title: '',
    date: '',
    venue: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alumniData = await mockApi.getAlumni();
        const meetsData = await mockApi.getAlumniMeets();
        setAlumni(alumniData);
        setAlumniMeets(meetsData);
      } catch (error) {
        console.error("Failed to fetch alumni data:", error);
        toast({
          title: "Error",
          description: "Failed to load alumni data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddAlumni = async () => {
    try {
      const newAlumni = await mockApi.addAlumni(formData);
      setAlumni(prev => [...prev, newAlumni]);
      setFormData({
        name: '',
        graduationYear: '',
        class: '',
        currentOccupation: '',
        company: '',
        location: '',
        email: '',
        phone: '',
        achievements: '',
        isStarAlumni: false
      });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Alumni added successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add alumni",
        variant: "destructive"
      });
    }
  };

  const handleAddMeet = async () => {
    try {
      const newMeet = await mockApi.addAlumniMeet(meetData);
      setAlumniMeets(prev => [...prev, newMeet]);
      setMeetData({
        title: '',
        date: '',
        venue: '',
        description: ''
      });
      setShowMeetDialog(false);
      toast({
        title: "Success",
        description: "Alumni meet scheduled successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule alumni meet",
        variant: "destructive"
      });
    }
  };

  const filteredAlumni = alumni.filter(alum => {
    const matchesSearch = alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alum.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alum.currentOccupation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === "all" || alum.graduationYear === yearFilter;
    return matchesSearch && matchesYear;
  });

  const getUniqueYears = () => {
    const years = [...new Set(alumni.map(alum => alum.graduationYear))];
    return years.sort((a, b) => parseInt(b) - parseInt(a));
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Alumni Management</h1>
          <p className="text-muted-foreground">Manage alumni profiles and organize alumni meets</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alumni</p>
                <p className="text-2xl font-bold">{alumni.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Star Alumni</p>
                <p className="text-2xl font-bold">{alumni.filter(a => a.isStarAlumni).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled Meets</p>
                <p className="text-2xl font-bold">{alumniMeets.filter(m => m.status === 'planned').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Year</p>
                <p className="text-2xl font-bold">
                  {alumni.filter(a => a.graduationYear === new Date().getFullYear().toString()).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Alumni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Alumni</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Alumni name"
                />
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: e.target.value }))}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                  placeholder="12-A"
                />
              </div>
              <div>
                <Label htmlFor="currentOccupation">Current Occupation</Label>
                <Input
                  id="currentOccupation"
                  value={formData.currentOccupation}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentOccupation: e.target.value }))}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  placeholder="Notable achievements and accomplishments"
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isStarAlumni"
                  checked={formData.isStarAlumni}
                  onChange={(e) => setFormData(prev => ({ ...prev, isStarAlumni: e.target.checked }))}
                />
                <Label htmlFor="isStarAlumni">Mark as Star Alumni</Label>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddAlumni}>Add Alumni</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showMeetDialog} onOpenChange={setShowMeetDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Alumni Meet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Alumni Meet</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meetTitle">Event Title</Label>
                <Input
                  id="meetTitle"
                  value={meetData.title}
                  onChange={(e) => setMeetData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Annual Alumni Meet 2024"
                />
              </div>
              <div>
                <Label htmlFor="meetDate">Date</Label>
                <Input
                  id="meetDate"
                  type="datetime-local"
                  value={meetData.date}
                  onChange={(e) => setMeetData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="meetVenue">Venue</Label>
                <Input
                  id="meetVenue"
                  value={meetData.venue}
                  onChange={(e) => setMeetData(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="School Auditorium"
                />
              </div>
              <div>
                <Label htmlFor="meetDescription">Description</Label>
                <Textarea
                  id="meetDescription"
                  value={meetData.description}
                  onChange={(e) => setMeetData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Event details and agenda"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setShowMeetDialog(false)}>Cancel</Button>
              <Button onClick={handleAddMeet}>Schedule Meet</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alumni by name, company, or occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {getUniqueYears().map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Alumni Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Graduation Year</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Current Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlumni.map((alum) => (
                <TableRow key={alum.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {alum.name}
                      {alum.isStarAlumni && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                  </TableCell>
                  <TableCell>{alum.graduationYear}</TableCell>
                  <TableCell>{alum.class}</TableCell>
                  <TableCell>{alum.currentOccupation}</TableCell>
                  <TableCell>{alum.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {alum.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {alum.isStarAlumni ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Star Alumni</Badge>
                    ) : (
                      <Badge variant="outline">Alumni</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alumni Meets */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni Meets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {alumniMeets.map((meet) => (
              <div key={meet.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{meet.title}</h3>
                  <Badge variant={
                    meet.status === 'planned' ? 'default' :
                    meet.status === 'completed' ? 'secondary' : 'destructive'
                  }>
                    {meet.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{meet.description}</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(meet.date).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {meet.venue}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meet.attendees.length} attendees
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}