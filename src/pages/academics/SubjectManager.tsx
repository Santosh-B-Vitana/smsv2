import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  code: string;
  classes: string[];
  board: 'CBSE' | 'State Board' | 'ICSE';
  type: 'Core' | 'Elective' | 'Language' | 'Activity';
}

export default function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Mathematics",
      code: "MATH",
      classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
      board: "CBSE",
      type: "Core"
    },
    {
      id: "2",
      name: "English",
      code: "ENG",
      classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
      board: "CBSE", 
      type: "Language"
    },
    {
      id: "3",
      name: "Science",
      code: "SCI",
      classes: ["Class 3", "Class 4", "Class 5"],
      board: "CBSE",
      type: "Core"
    }
  ]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    classes: [] as string[],
    board: "CBSE" as "CBSE" | "State Board" | "ICSE",
    type: "Core" as "Core" | "Elective" | "Language" | "Activity"
  });

  const availableClasses = [
    "Pre-KG", "LKG", "UKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", 
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const boardOptions = ["CBSE", "State Board", "ICSE"] as const;
  const typeOptions = ["Core", "Elective", "Language", "Activity"] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSubject) {
      setSubjects(prev => prev.map(subject => 
        subject.id === editingSubject.id 
          ? { ...subject, ...formData }
          : subject
      ));
      toast.success("Subject updated successfully");
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData
      };
      setSubjects(prev => [...prev, newSubject]);
      toast.success("Subject created successfully");
    }
    
    setDialogOpen(false);
    setEditingSubject(null);
    setFormData({ name: "", code: "", classes: [], board: "CBSE", type: "Core" });
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      classes: subject.classes,
      board: subject.board,
      type: subject.type
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    toast.success("Subject deleted successfully");
  };

  const handleClassToggle = (className: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Core': return 'bg-blue-100 text-blue-800';
      case 'Elective': return 'bg-green-100 text-green-800';
      case 'Language': return 'bg-purple-100 text-purple-800';
      case 'Activity': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Assign subjects to classes with board specifications
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSubject(null);
              setFormData({ name: "", code: "", classes: [], board: "CBSE", type: "Core" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mathematics"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., MATH"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="board">Board</Label>
                  <Select value={formData.board} onValueChange={(value: "CBSE" | "State Board" | "ICSE") => setFormData(prev => ({ ...prev, board: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {boardOptions.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Subject Type</Label>
                  <Select value={formData.type} onValueChange={(value: "Core" | "Elective" | "Language" | "Activity") => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Assign to Classes</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {availableClasses.map((className) => (
                    <label key={className} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.classes.includes(className)}
                        onChange={() => handleClassToggle(className)}
                        className="rounded"
                      />
                      <span className="text-sm">{className}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSubject ? "Update" : "Create"}
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
              <TableHead>Subject</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Board</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell>{subject.code}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(subject.type)}>
                    {subject.type}
                  </Badge>
                </TableCell>
                <TableCell>{subject.board}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {subject.classes.map((cls) => (
                      <Badge key={cls} variant="outline" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(subject)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(subject.id)}
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