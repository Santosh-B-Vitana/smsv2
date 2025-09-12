import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Class {
  id: string;
  standard: string;
  section: string;
  academicYear: string;
  totalStudents: number;
  classTeacher?: string;
}

export default function ClassManager() {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      standard: "Class 1",
      section: "A",
      academicYear: "2024-2025",
      totalStudents: 30,
      classTeacher: "Ms. Sarah Johnson"
    },
    {
      id: "2",
      standard: "Class 1", 
      section: "B",
      academicYear: "2024-2025",
      totalStudents: 28,
      classTeacher: "Mr. David Smith"
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    standard: "",
    section: "",
    academicYear: "2024-2025",
    classTeacher: ""
  });

  const standards = [
    "Pre-KG", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const sections = ["A", "B", "C", "D", "E", "F"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClass) {
      setClasses(prev => prev.map(cls => 
        cls.id === editingClass.id 
          ? { ...cls, ...formData, totalStudents: editingClass.totalStudents }
          : cls
      ));
      toast.success("Class updated successfully");
    } else {
      const newClass: Class = {
        id: Date.now().toString(),
        ...formData,
        totalStudents: 0
      };
      setClasses(prev => [...prev, newClass]);
      toast.success("Class created successfully");
    }
    
    setDialogOpen(false);
    setEditingClass(null);
    setFormData({ standard: "", section: "", academicYear: "2024-2025", classTeacher: "" });
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      standard: cls.standard,
      section: cls.section,
      academicYear: cls.academicYear,
      classTeacher: cls.classTeacher || ""
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== id));
    toast.success("Class deleted successfully");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Class Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage classes for each academic year
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingClass(null);
              setFormData({ standard: "", section: "", academicYear: "2024-2025", classTeacher: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Edit Class" : "Add New Class"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="standard">Standard</Label>
                <Select value={formData.standard} onValueChange={(value) => setFormData(prev => ({ ...prev, standard: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    {standards.map((standard) => (
                      <SelectItem key={standard} value={standard}>
                        {standard}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Select value={formData.section} onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select value={formData.academicYear} onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="classTeacher">Class Teacher (Optional)</Label>
                <Input
                  id="classTeacher"
                  placeholder="Enter teacher name"
                  value={formData.classTeacher}
                  onChange={(e) => setFormData(prev => ({ ...prev, classTeacher: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingClass ? "Update" : "Create"}
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
              <TableHead>Standard</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead>Total Students</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.standard}</TableCell>
                <TableCell>{cls.section}</TableCell>
                <TableCell>{cls.academicYear}</TableCell>
                <TableCell>{cls.totalStudents}</TableCell>
                <TableCell>{cls.classTeacher || "Not assigned"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => window.location.href = `/class/${cls.id}`}
                    >
                      Manage Class
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(cls)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(cls.id)}
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