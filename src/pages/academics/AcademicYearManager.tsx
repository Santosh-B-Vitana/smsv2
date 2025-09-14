import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
}

export default function AcademicYearManager() {
  const defaultYears: AcademicYear[] = [
    {
      id: "1",
      name: "2024-2025",
      startDate: "2024-04-01",
      endDate: "2025-03-31",
      status: "active"
    },
    {
      id: "2", 
      name: "2023-2024",
      startDate: "2023-04-01",
      endDate: "2024-03-31",
      status: "completed"
    }
  ];
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("academicYears");
    if (stored) {
      try {
        setAcademicYears(JSON.parse(stored));
      } catch {
        setAcademicYears(defaultYears);
      }
    } else {
      setAcademicYears(defaultYears);
    }
  }, []);

  // Persist to localStorage whenever academicYears changes
  useEffect(() => {
    localStorage.setItem("academicYears", JSON.stringify(academicYears));
  }, [academicYears]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: ""
  });

  const getYearStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now >= start && now <= end) return 'active';
    if (now < start) return 'upcoming';
    return 'completed';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = getYearStatus(formData.startDate, formData.endDate);
    if (editingYear) {
      setAcademicYears(prev => prev.map(year => 
        year.id === editingYear.id 
          ? { ...year, ...formData, status }
          : year
      ));
      toast.success("Academic year updated successfully");
    } else {
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        ...formData,
        status
      };
      setAcademicYears(prev => [...prev, newYear]);
      toast.success("Academic year created successfully");
    }
    setDialogOpen(false);
    setEditingYear(null);
    setFormData({ name: "", startDate: "", endDate: "" });
  };

  const handleEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setFormData({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAcademicYears(prev => prev.filter(year => year.id !== id));
    toast.success("Academic year deleted successfully");
  };

  const handleSetActive = (id: string) => {
    setAcademicYears(prev => prev.map(year => ({
      ...year,
      status: year.id === id ? 'active' : (year.status === 'active' ? 'completed' : year.status)
    })));
    toast.success("Academic year activated successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Academic Years
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage academic years and their duration
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingYear(null);
              setFormData({ name: "", startDate: "", endDate: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Year
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingYear ? "Edit Academic Year" : "Add New Academic Year"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Academic Year Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., 2024-2025"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingYear ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Academic Year</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academicYears.map((year) => (
              <TableRow key={year.id}>
                <TableCell className="font-medium">{year.name}</TableCell>
                <TableCell>{new Date(year.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(year.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(year.status)}>
                    {year.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {year.status !== 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetActive(year.id)}
                      >
                        Set Active
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(year)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(year.id)}
                      disabled={year.status === 'active'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}