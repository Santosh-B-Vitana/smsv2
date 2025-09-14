import { useEffect, useState, useRef } from "react";
import { Plus, Edit, Trash2, Eye, RotateCcw, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApi, SchoolInfo } from "@/services/mockApi";

export default function SchoolManagement() {
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);
  const [editSchool, setEditSchool] = useState<SchoolInfo | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [newSchool, setNewSchool] = useState<Partial<SchoolInfo>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSchools();
  }, []);


  const fetchSchools = async () => {
    const data = await mockApi.getSchools();
    setSchools(data);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSchool = async () => {
    if (newSchool.name && (logoFile || newSchool.logoUrl)) {
      try {
        let logoUrl = newSchool.logoUrl || '';
        
        if (logoFile) {
          logoUrl = await mockApi.uploadSchoolLogo(logoFile);
        }

        await mockApi.addSchool({
          name: newSchool.name,
          logoUrl,
          address: newSchool.address || '',
          phone: newSchool.phone || '',
          email: newSchool.email || '',
          principalName: newSchool.principalName || '',
          establishmentDate: newSchool.establishmentDate || '',
          boardAffiliation: newSchool.boardAffiliation || '',
          totalStudents: newSchool.totalStudents || 0,
          totalStaff: newSchool.totalStaff || 0,
          websiteUrl: newSchool.websiteUrl || '',
          description: newSchool.description || ''
        });
        
        setAddDialog(false);
        setNewSchool({});
        setLogoFile(null);
        setLogoPreview("");
        fetchSchools();
      } catch (error) {
        console.error('Error adding school:', error);
      }
    }
  };

  const handleEditSchool = async () => {
    if (editSchool) {
      await mockApi.updateSchool(editSchool.id, {
        name: editSchool.name,
        logoUrl: editSchool.logoUrl,
        address: editSchool.address,
        phone: editSchool.phone,
        email: editSchool.email
      });
      setEditSchool(null);
      fetchSchools();
    }
  };

  const handleDeactivate = async (school: SchoolInfo) => {
    try {
      const newStatus = school.status === 'active' ? 'inactive' : 'active';
      await mockApi.updateSchool(school.id, { status: newStatus });
      
      // Update local state immediately for better UX
      setSchools(prev => prev.map(s => 
        s.id === school.id ? { ...s, status: newStatus } : s
      ));
      
      // Refresh data to ensure consistency
      await fetchSchools();
    } catch (error) {
      console.error('Failed to update school status:', error);
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-academic py-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-display">School Management</h1>
          <p className="text-muted-foreground mt-2">Manage and oversee all registered schools</p>
        </div>
        <Button onClick={() => setAddDialog(true)} className="w-full sm:w-auto hover-lift">
          <Plus className="h-4 w-4 mr-2" /> Add School
        </Button>
      </div>
      
      <Card className="dashboard-card hover-glow">
        <CardHeader className="border-b">
          <CardTitle className="text-heading">Registered Schools</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 border-b bg-muted/30">
            <Input
              placeholder="Search schools by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="overflow-x-auto">
            <Table className="academic-table">
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold">School Name</TableHead>
                  <TableHead className="font-semibold">Logo</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {search ? 'No schools found matching your search.' : 'No schools registered yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchools.map(school => (
                    <TableRow key={school.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>
                        {school.logoUrl ? (
                          <img 
                            src={school.logoUrl} 
                            alt={`${school.name} logo`} 
                            className="h-10 w-10 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No Logo</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={school.status === 'active' ? 'default' : 'secondary'}
                          className={school.status === 'active' ? 'status-active' : 'status-inactive'}
                        >
                          {school.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setSelectedSchool(school)}
                            className="hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditSchool(school)}
                            className="hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeactivate(school)}
                            className={
                              school.status === 'active' 
                                ? 'hover:bg-red-50 hover:text-red-600' 
                                : 'hover:bg-green-50 hover:text-green-600'
                            }
                          >
                            {school.status === 'active' ? 
                              <Trash2 className="h-4 w-4" /> : 
                              <RotateCcw className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add School Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add School</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="School Name *" 
                value={newSchool.name || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, name: e.target.value }))} 
              />
              <Input 
                placeholder="Principal Name" 
                value={newSchool.principalName || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, principalName: e.target.value }))} 
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">School Logo</label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="h-12 w-12 rounded-lg object-cover border" />
                )}
              </div>
              <Input 
                placeholder="Or paste logo URL" 
                value={newSchool.logoUrl || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, logoUrl: e.target.value }))} 
              />
            </div>
            
            <Textarea 
              placeholder="School Address" 
              value={newSchool.address || ''} 
              onChange={e => setNewSchool(ns => ({ ...ns, address: e.target.value }))} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder="Phone Number" 
                value={newSchool.phone || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, phone: e.target.value }))} 
              />
              <Input 
                type="email"
                placeholder="Email Address" 
                value={newSchool.email || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, email: e.target.value }))} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="date"
                placeholder="Establishment Date" 
                value={newSchool.establishmentDate || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, establishmentDate: e.target.value }))} 
              />
              <Select onValueChange={value => setNewSchool(ns => ({ ...ns, boardAffiliation: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Board Affiliation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="State Board">State Board</SelectItem>
                  <SelectItem value="IB">International Baccalaureate</SelectItem>
                  <SelectItem value="IGCSE">IGCSE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                type="number"
                placeholder="Total Students" 
                value={newSchool.totalStudents || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, totalStudents: parseInt(e.target.value) || 0 }))} 
              />
              <Input 
                type="number"
                placeholder="Total Staff" 
                value={newSchool.totalStaff || ''} 
                onChange={e => setNewSchool(ns => ({ ...ns, totalStaff: parseInt(e.target.value) || 0 }))} 
              />
            </div>
            
            <Input 
              placeholder="Website URL" 
              value={newSchool.websiteUrl || ''} 
              onChange={e => setNewSchool(ns => ({ ...ns, websiteUrl: e.target.value }))} 
            />
            
            <Textarea 
              placeholder="School Description" 
              value={newSchool.description || ''} 
              onChange={e => setNewSchool(ns => ({ ...ns, description: e.target.value }))} 
            />
            
            <Button 
              onClick={handleAddSchool} 
              className="w-full mt-4"
              disabled={!newSchool.name || (!logoFile && !newSchool.logoUrl)}
            >
              Add School
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View School Dialog */}
      <Dialog open={!!selectedSchool} onOpenChange={() => setSelectedSchool(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>School Details</DialogTitle>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-2">
              <div><b>Name:</b> {selectedSchool.name}</div>
              <div><b>Logo:</b> <img src={selectedSchool.logoUrl} alt={selectedSchool.name} className="h-10 w-10 inline-block rounded" /></div>
              <div><b>Address:</b> {selectedSchool.address}</div>
              <div><b>Phone:</b> {selectedSchool.phone}</div>
              <div><b>Email:</b> {selectedSchool.email}</div>
              <div><b>Status:</b> {selectedSchool.status}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit School Dialog */}
      <Dialog open={!!editSchool} onOpenChange={() => setEditSchool(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          {editSchool && (
            <div className="space-y-2">
              <Input placeholder="School Name" value={editSchool.name} onChange={e => setEditSchool(s => s ? { ...s, name: e.target.value } : s)} />
              <Input placeholder="Logo URL" value={editSchool.logoUrl} onChange={e => setEditSchool(s => s ? { ...s, logoUrl: e.target.value } : s)} />
              <Input placeholder="Address" value={editSchool.address} onChange={e => setEditSchool(s => s ? { ...s, address: e.target.value } : s)} />
              <Input placeholder="Phone" value={editSchool.phone} onChange={e => setEditSchool(s => s ? { ...s, phone: e.target.value } : s)} />
              <Input placeholder="Email" value={editSchool.email} onChange={e => setEditSchool(s => s ? { ...s, email: e.target.value } : s)} />
              <Button onClick={handleEditSchool} className="w-full mt-2">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
