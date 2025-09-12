
import { useState } from "react";
import { Award, BarChart3, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentGrade {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  subject: string;
  assignments: { [key: string]: number };
  midterm: number;
  final: number;
  overall: string;
}

const mockGrades: StudentGrade[] = [
  {
    id: "1",
    name: "Alice Johnson",
    rollNo: "001",
    class: "10-A",
    subject: "Mathematics",
    assignments: { "Quiz 1": 95, "Quiz 2": 88, "Homework 1": 92 },
    midterm: 87,
    final: 0,
    overall: "A"
  },
  {
    id: "2",
    name: "Bob Smith", 
    rollNo: "002",
    class: "10-A",
    subject: "Mathematics",
    assignments: { "Quiz 1": 82, "Quiz 2": 79, "Homework 1": 85 },
    midterm: 81,
    final: 0,
    overall: "B+"
  }
];

export function GradeManager() {
  const [selectedClass, setSelectedClass] = useState("10a");
  const [selectedAssignment, setSelectedAssignment] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Grade Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">68</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">85.2%</p>
                <p className="text-sm text-muted-foreground">Class Average</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">+2.1%</p>
                <p className="text-sm text-muted-foreground">From Last Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-muted-foreground">Pending Grades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Book</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10a">10-A Mathematics</SelectItem>
                <SelectItem value="10b">10-B Mathematics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Assignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz1">Quiz 1</SelectItem>
                <SelectItem value="quiz2">Quiz 2</SelectItem>
                <SelectItem value="midterm">Midterm Exam</SelectItem>
              </SelectContent>
            </Select>
            <Button>Apply Filter</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Quiz 1</TableHead>
                <TableHead>Quiz 2</TableHead>
                <TableHead>Midterm</TableHead>
                <TableHead>Overall Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGrades.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={student.assignments["Quiz 1"]} 
                      className="w-20"
                      max="100"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={student.assignments["Quiz 2"]} 
                      className="w-20"
                      max="100"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      defaultValue={student.midterm} 
                      className="w-20"
                      max="100"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      student.overall === 'A' ? 'default' :
                      student.overall.includes('B') ? 'secondary' : 'outline'
                    }>
                      {student.overall}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
