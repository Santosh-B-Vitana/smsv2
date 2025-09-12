import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Save, 
  Download, 
  FileText,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface ResultEntry {
  student_id: string;
  student_name: string;
  roll_no: string;
  subjects: Record<string, {
    marks: number;
    grade: string;
  }>;
}

export default function ResultsManager() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  const academicYears = ["2024-2025", "2023-2024"];
  const classes = ["Class 10", "Class 9", "Class 8"];
  const sections = ["A", "B", "C"];
  const exams = ["Midterm", "Final", "Unit Test 1", "Unit Test 2"];
  const mockSubjects = ["Mathematics", "English", "Science", "Social Studies"];

  const mockStudents = [
    { id: "STU001", name: "Aarav Gupta", rollNo: "001" },
    { id: "STU002", name: "Rohan Mehra", rollNo: "002" },
    { id: "STU003", name: "Ananya Sharma", rollNo: "003" },
  ];

  const gradeScale = [
    { grade: "A+", min: 90, max: 100 },
    { grade: "A", min: 80, max: 89 },
    { grade: "B+", min: 70, max: 79 },
    { grade: "B", min: 60, max: 69 },
    { grade: "C", min: 50, max: 59 },
    { grade: "D", min: 40, max: 49 },
    { grade: "F", min: 0, max: 39 },
  ];

  const calculateGrade = (marks: number): string => {
    const grade = gradeScale.find(g => marks >= g.min && marks <= g.max);
    return grade?.grade || "F";
  };

  const handleLoadResults = () => {
    if (!selectedYear || !selectedClass || !selectedSection || !selectedExam) {
      toast.error("Please select all required fields");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubjects(mockSubjects);
      const mockResults: ResultEntry[] = mockStudents.map(student => ({
        student_id: student.id,
        student_name: student.name,
        roll_no: student.rollNo,
        subjects: mockSubjects.reduce((acc, subject) => ({
          ...acc,
          [subject]: { marks: 0, grade: "F" }
        }), {})
      }));
      setResults(mockResults);
      setLoading(false);
      toast.success("Results loaded successfully");
    }, 1000);
  };

  const handleMarksChange = (studentId: string, subject: string, marks: number) => {
    if (marks < 0 || marks > 100) return;

    setResults(prev => prev.map(result => {
      if (result.student_id === studentId) {
        return {
          ...result,
          subjects: {
            ...result.subjects,
            [subject]: {
              marks,
              grade: calculateGrade(marks)
            }
          }
        };
      }
      return result;
    }));
  };

  const handleSaveResults = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Saving results:', {
        academicYear: selectedYear,
        class: selectedClass,
        section: selectedSection,
        exam: selectedExam,
        results
      });
      
      toast.success("Results saved successfully");
    } catch (error) {
      toast.error("Failed to save results");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishResults = async () => {
    if (results.length === 0) {
      toast.error("No results to publish");
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Publishing results:', {
        academicYear: selectedYear,
        class: selectedClass,
        section: selectedSection,
        exam: selectedExam,
        results
      });
      
      toast.success("Results published successfully - now visible to students and parents");
    } catch (error) {
      toast.error("Failed to publish results");
    } finally {
      setLoading(false);
    }
  };

  const handleExportResults = () => {
    toast.success("Results exported to CSV");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Results Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exam</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map(exam => (
                    <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleLoadResults} disabled={loading}>
              Load Results
            </Button>
            {results.length > 0 && (
              <>
                <Button onClick={handleSaveResults} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Results
                </Button>
                <Button onClick={handlePublishResults} disabled={loading}>
                  <FileText className="h-4 w-4 mr-2" />
                  Publish Results
                </Button>
                <Button variant="outline" onClick={handleExportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Entry Grid */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Enter Marks - {selectedClass} {selectedSection} ({selectedExam})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    {subjects.map(subject => (
                      <TableHead key={subject} className="text-center">
                        {subject}
                        <br />
                        <span className="text-xs text-muted-foreground">(Marks/Grade)</span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.student_id}>
                      <TableCell className="font-medium">{result.roll_no}</TableCell>
                      <TableCell className="font-medium">{result.student_name}</TableCell>
                      {subjects.map(subject => {
                        const subjectResult = result.subjects[subject];
                        return (
                          <TableCell key={subject} className="text-center">
                            <div className="space-y-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={subjectResult.marks || ''}
                                onChange={(e) => handleMarksChange(
                                  result.student_id, 
                                  subject, 
                                  parseInt(e.target.value) || 0
                                )}
                                className="w-20 mx-auto text-center"
                                placeholder="0"
                              />
                              <Badge 
                                variant={subjectResult.grade === 'F' ? 'destructive' : 'default'}
                                className="text-xs"
                              >
                                {subjectResult.grade}
                              </Badge>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Grade Scale Reference */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Grade Scale:</h4>
              <div className="flex flex-wrap gap-2">
                {gradeScale.map(grade => (
                  <Badge key={grade.grade} variant="outline" className="text-xs">
                    {grade.grade}: {grade.min}-{grade.max}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}