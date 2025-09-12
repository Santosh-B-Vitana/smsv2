import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  code: string;
  type: 'core' | 'optional';
  teacher: string;
  maxMarks: number;
  credits: number;
}

interface SubjectsTabProps {
  classId: string;
}

export function SubjectsTab({ classId }: SubjectsTabProps) {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "SUB001", name: "Mathematics", code: "MATH10", type: "core", teacher: "Mrs. Priya Singh", maxMarks: 100, credits: 4 },
    { id: "SUB002", name: "English", code: "ENG10", type: "core", teacher: "Mr. Rahul Kumar", maxMarks: 100, credits: 4 },
    { id: "SUB003", name: "Science", code: "SCI10", type: "core", teacher: "Dr. Anita Sharma", maxMarks: 100, credits: 6 },
    { id: "SUB004", name: "Social Studies", code: "SS10", type: "core", teacher: "Mrs. Kavita Mehta", maxMarks: 100, credits: 4 },
    { id: "SUB005", name: "Computer Science", code: "CS10", type: "optional", teacher: "Mr. Suresh Patel", maxMarks: 100, credits: 3 },
    { id: "SUB006", name: "Fine Arts", code: "FA10", type: "optional", teacher: "Ms. Ritu Jain", maxMarks: 50, credits: 2 },
  ]);

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState<{
    name: string;
    code: string;
    type: 'core' | 'optional';
    teacher: string;
    maxMarks: number;
    credits: number;
  }>({
    name: "",
    code: "",
    type: "core",
    teacher: "",
    maxMarks: 100,
    credits: 4
  });

  const coreSubjects = subjects.filter(s => s.type === 'core');
  const optionalSubjects = subjects.filter(s => s.type === 'optional');

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code || !newSubject.teacher) {
      toast.error("Please fill all required fields");
      return;
    }

    const subject: Subject = {
      id: `SUB${Date.now()}`,
      ...newSubject
    };

    setSubjects([...subjects, subject]);
    setNewSubject({ name: "", code: "", type: "core", teacher: "", maxMarks: 100, credits: 4 });
    setIsAddingSubject(false);
    toast.success("Subject added successfully");
  };

  const SubjectTable = ({ subjects, title }: { subjects: Subject[], title: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Max Marks</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{subject.code}</Badge>
                </TableCell>
                <TableCell>{subject.teacher}</TableCell>
                <TableCell>{subject.maxMarks}</TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Class Subjects</h3>
        <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject Name</Label>
                <Input
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="Enter subject name"
                />
              </div>
              <div>
                <Label>Subject Code</Label>
                <Input
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  placeholder="Enter subject code"
                />
              </div>
              <div>
                <Label>Subject Type</Label>
                <Select value={newSubject.type} onValueChange={(value) => setNewSubject({ ...newSubject, type: value as 'core' | 'optional' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core Subject</SelectItem>
                    <SelectItem value="optional">Optional Subject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Teacher</Label>
                <Input
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                  placeholder="Enter teacher name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Marks</Label>
                  <Input
                    type="number"
                    value={newSubject.maxMarks}
                    onChange={(e) => setNewSubject({ ...newSubject, maxMarks: parseInt(e.target.value) || 100 })}
                  />
                </div>
                <div>
                  <Label>Credits</Label>
                  <Input
                    type="number"
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) || 4 })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSubject}>Add Subject</Button>
                <Button variant="outline" onClick={() => setIsAddingSubject(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <SubjectTable subjects={coreSubjects} title="Core Subjects" />
      <SubjectTable subjects={optionalSubjects} title="Optional Subjects" />
    </div>
  );
}