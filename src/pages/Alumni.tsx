import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AnimatedWrapper } from "@/components/common/AnimatedWrapper";
import { ModernCard } from "@/components/common/ModernCard";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const alumniData = await mockApi.getAlumni();
        const meetsData = await mockApi.getAlumniMeets();
        
        // Add mock passed out students to alumni automatically
        const passedOutStudents = [
          {
            id: 'ALU001',
            name: 'Rajesh Kumar',
            graduationYear: '2023',
            class: '12-A',
            currentOccupation: 'Software Engineer',
            company: 'Tech Corp',
            location: 'Mumbai, India',
            email: 'rajesh@email.com',
            phone: '+91-9876543210',
            achievements: 'Graduated with 95% marks, now working at top tech company',
            isStarAlumni: true,
            createdAt: '2023-06-01'
          },
          {
            id: 'ALU002',
            name: 'Priya Sharma',
            graduationYear: '2023',
            class: '12-B',
            currentOccupation: 'Doctor',
            company: 'City Hospital',
            location: 'Delhi, India',
            email: 'priya@email.com',
            phone: '+91-9876543211',
            achievements: 'Medical College topper, now practicing medicine',
            isStarAlumni: true,
            createdAt: '2023-06-01'
          },
          {
            id: 'ALU003',
            name: 'Amit Patel',
            graduationYear: '2022',
            class: '12-A',
            currentOccupation: 'Engineer',
            company: 'Construction Ltd',
            location: 'Ahmedabad, India',
            email: 'amit@email.com',
            phone: '+91-9876543212',
            achievements: 'Civil Engineering graduate, working on major infrastructure projects',
            isStarAlumni: false,
            createdAt: '2022-06-01'
          }
        ];
        
        setAlumni([...alumniData, ...passedOutStudents]);
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
    <>
      <AnimatedBackground variant="gradient" />
      <div className="space-y-6">
        <AnimatedWrapper variant="fadeInUp">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display">Alumni Management</h1>
              <p className="text-muted-foreground">Manage alumni profiles and organize alumni meets</p>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Stats Cards */}
        <AnimatedWrapper variant="fadeInUp" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModernCard variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Alumni</p>
                    <p className="text-2xl font-bold">{alumni.length}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </ModernCard>
            
            <ModernCard variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Star Alumni</p>
                    <p className="text-2xl font-bold">{alumni.filter(a => a.isStarAlumni).length}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </ModernCard>
            
            <ModernCard variant="glass">
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
            </ModernCard>
          </div>
        </AnimatedWrapper>

        {/* Action Buttons */}
        <AnimatedWrapper variant="fadeInUp" delay={0.2}>
          <div className="flex gap-4">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Add
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
          </div>
        </AnimatedWrapper>

        {/* Search and Filter */}
        <AnimatedWrapper variant="fadeInUp" delay={0.3}>
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
        </AnimatedWrapper>

        {/* Alumni Table */}
        <AnimatedWrapper variant="fadeInUp" delay={0.4}>
          <ModernCard variant="glass">
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
      </ModernCard>
        </AnimatedWrapper>
      </div>
    </>
  );
}