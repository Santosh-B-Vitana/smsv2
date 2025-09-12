import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockApi, SchoolInfo } from "@/services/mockApi";

export default function SchoolManagement() {
  const [schools, setSchools] = useState<SchoolInfo[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<SchoolInfo | null>(null);
  const [editSchool, setEditSchool] = useState<SchoolInfo | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [newSchool, setNewSchool] = useState<Partial<SchoolInfo>>({});

  useEffect(() => {
    fetchSchools();
  }, []);


  const fetchSchools = async () => {
    const data = await mockApi.getSchools();
    setSchools(data);
  };

  const handleAddSchool = async () => {
    if (newSchool.name && newSchool.logoUrl) {
      await mockApi.addSchool({
        name: newSchool.name,
        logoUrl: newSchool.logoUrl,
        address: newSchool.address || '',
        phone: newSchool.phone || '',
        email: newSchool.email || ''
      });
      setAddDialog(false);
      setNewSchool({});
      fetchSchools();
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
    await mockApi.updateSchool(school.id, { status: school.status === 'active' ? 'inactive' : 'active' });
    fetchSchools();
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">School Management</h1>
        <Button onClick={() => setAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add School
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Search schools..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map(school => (
                  <TableRow key={school.id}>
                    <TableCell>{school.name}</TableCell>
                    <TableCell>
                      {school.logoUrl && (
                        <img src={school.logoUrl} alt={school.name} className="h-8 w-8 rounded" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedSchool(school)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditSchool(school)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeactivate(school)}
                        className={school.status === 'active' ? 'text-destructive' : 'text-green-600'}>
                        {school.status === 'active' ? <Trash2 className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add School Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add School</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="School Name" value={newSchool.name || ''} onChange={e => setNewSchool(ns => ({ ...ns, name: e.target.value }))} />
            <Input placeholder="Logo URL" value={newSchool.logoUrl || ''} onChange={e => setNewSchool(ns => ({ ...ns, logoUrl: e.target.value }))} />
            <Input placeholder="Address" value={newSchool.address || ''} onChange={e => setNewSchool(ns => ({ ...ns, address: e.target.value }))} />
            <Input placeholder="Phone" value={newSchool.phone || ''} onChange={e => setNewSchool(ns => ({ ...ns, phone: e.target.value }))} />
            <Input placeholder="Email" value={newSchool.email || ''} onChange={e => setNewSchool(ns => ({ ...ns, email: e.target.value }))} />
            <Button onClick={handleAddSchool} className="w-full mt-2">Add School</Button>
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
