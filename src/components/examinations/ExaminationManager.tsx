import { useState } from "react";
import { Calendar, FileText, Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExamForm } from "./ExamForm";
import { GradeEntryForm } from "./GradeEntryForm";
import { ExamList } from "./ExamList";
import { ReportCardGenerator } from "./ReportCardGenerator";
import { StudentReportCardGenerator } from "./StudentReportCardGenerator";
import { useToast } from "@/hooks/use-toast";
import { Student } from "../../services/mockApi";
import { mockApi } from "../../services/mockApi";

interface Exam {
  id: string;
  name: string;
  class: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'paused';
}

interface Result {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  marks: number;
  grade: string;
}

const mockExams: Exam[] = [
  {
    id: 'EX001',
    name: 'Mid-term Examination',
    class: '10',
    subject: 'Mathematics',
    date: '2024-03-25',
    time: '10:00',
    duration: '3 hours',
    maxMarks: 100,
    status: 'scheduled'
  },
  {
    id: 'EX002',
    name: 'Mid-term Examination',
    class: '10',
    subject: 'English',
    date: '2024-03-27',
    time: '10:00',
    duration: '3 hours',
    maxMarks: 100,
    status: 'scheduled'
  }
];

const mockResults: Result[] = [
  {
    id: 'R001',
    examId: 'EX001',
    studentId: 'STU001',
    studentName: 'Alice Johnson',
    marks: 85,
    grade: 'A'
  },
  {
    id: 'R002',
    examId: 'EX001',
    studentId: 'STU002',
    studentName: 'David Chen',
    marks: 92,
    grade: 'A+'
  }
];

const mockStudents: Student[] = [
  { 
    id: 'STU001', 
    name: 'Alice Johnson', 
    rollNo: '001',
    class: '10',
    section: 'A',
    dob: '2008-05-15',
    guardianName: 'Robert Johnson',
    guardianPhone: '+1 (555) 987-6543',
    address: '456 Oak Street, Learning City',
    category: 'General',
    previousSchool: 'Maple Elementary',
    status: 'active',
    admissionDate: '2023-04-01'
  },
  { 
    id: 'STU002', 
    name: 'David Chen', 
    rollNo: '002',
    class: '10',
    section: 'A',
    dob: '2008-08-22',
    guardianName: 'Lisa Chen',
    guardianPhone: '+1 (555) 876-5432',
    address: '789 Pine Avenue, Learning City',
    category: 'General',
    status: 'active',
    admissionDate: '2023-04-01'
  },
  { 
    id: 'STU003', 
    name: 'Emma Wilson', 
    rollNo: '003',
    class: '9',
    section: 'B',
    dob: '2009-02-10',
    guardianName: 'Michael Wilson',
    guardianPhone: '+1 (555) 765-4321',
    address: '321 Elm Street, Learning City',
    category: 'General',
    status: 'active',
    admissionDate: '2023-04-01'
  },
];

export function ExaminationManager() {
  // State for schedule exam dialog
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<{ name: string; class: string; subject: string; date: string; time: string; duration: string; maxMarks: number }>({ name: "", class: "", subject: "", date: "", time: "", duration: "", maxMarks: 100 });
  // State for marks entry dialog form
  const [enteredStudent, setEnteredStudent] = useState<{ name?: string; rollNo?: string; class?: string; section?: string }>({});
  const [dialogSubjects, setDialogSubjects] = useState<string[]>([]);
  const [dialogMarks, setDialogMarks] = useState<Record<string, number>>({});
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [showMarksDialog, setShowMarksDialog] = useState(false);
  const [subjectsByStudent, setSubjectsByStudent] = useState<Record<string, string[]>>({});
  const [marksByStudent, setMarksByStudent] = useState<Record<string, Record<string, number>>>({});
  const { toast } = useToast();
  // Fetch subjects for each student when opening dialog
  const handleOpenMarksDialog = () => {
    setShowMarksDialog(true);
    setEnteredStudent({});
    setDialogSubjects([]);
    setDialogMarks({});
  };

  const handleCreateExam = (examData: any) => {
    const newExam: Exam = {
      id: `EX${String(exams.length + 1).padStart(3, '0')}`,
      ...examData,
      status: 'scheduled' as const
    };
    
  setExams(prev => [...prev, newExam]);
  };

  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setEditExam(exam);
      setShowEditDialog(true);
    }
  };

  const handleSaveEditExam = (updatedExam: Exam) => {
    setExams(prev => prev.map(ex => ex.id === updatedExam.id ? updatedExam : ex));
    setShowEditDialog(false);
    setEditExam(null);
    toast({
      title: "Exam Updated",
      description: "The exam details have been updated successfully."
    });
  };

  const handleDeleteExam = (examId: string, newStatus?: 'scheduled' | 'ongoing' | 'completed' | 'paused') => {
    setExams(prev => prev.map(exam =>
      exam.id === examId
        ? { ...exam, status: newStatus ?? (exam.status === 'paused' ? 'scheduled' : 'paused') }
        : exam
    ));
    toast({
      title: newStatus === 'paused' ? "Exam Paused" : "Exam Enabled",
      description: newStatus === 'paused'
        ? "The exam has been paused."
        : "The exam has been enabled."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Examination Management</h1>
        {/* Schedule Exam button removed */}
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowScheduleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Exam
            </Button>
          </div>
          <ExamList
            exams={exams}
            onEditExam={handleEditExam}
            onDeleteExam={handleDeleteExam}
          />
          
          {/* Schedule Exam Dialog */}
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Exam</DialogTitle>
              </DialogHeader>
              <ExamForm
                onSubmit={(examData) => {
                  handleCreateExam(examData);
                  setShowScheduleDialog(false);
                  toast({
                    title: "Success",
                    description: "Exam scheduled successfully"
                  });
                }}
                onCancel={() => setShowScheduleDialog(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Exam</DialogTitle>
              </DialogHeader>
              {editExam && (
                <ExamForm
                  onSubmit={handleSaveEditExam}
                  onCancel={() => setShowEditDialog(false)}
                  initialData={editExam}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Examination Results
              </CardTitle>
              <Button onClick={handleOpenMarksDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Enter Marks
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => {
                    const exam = exams.find(e => e.id === result.examId);
                    const percentage = exam ? (result.marks / exam.maxMarks) * 100 : 0;
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.studentName}</TableCell>
                        <TableCell>{exam?.subject} - {exam?.name}</TableCell>
                        <TableCell>{result.marks}/{exam?.maxMarks}</TableCell>
                        <TableCell>
                          <Badge variant="default">{result.grade}</Badge>
                        </TableCell>
                        <TableCell>{percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Marks Entry Dialog */}
          <Dialog open={showMarksDialog} onOpenChange={setShowMarksDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Enter Marks</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  setShowMarksDialog(false);
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Roll No</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full"
                      value={enteredStudent.rollNo || ""}
                      onChange={async e => {
                        const rollNo = e.target.value;
                        setEnteredStudent(s => ({ ...s, rollNo }));
                        // Find student by roll no
                        const student = mockStudents.find(s => s.rollNo === rollNo);
                        if (student) {
                          setEnteredStudent({
                            name: student.name,
                            rollNo: student.rollNo,
                            class: student.class,
                            section: student.section
                          });
                          // Autopopulate subjects
                          const subjects = await mockApi.getSubjectsForClassSection(student.class, student.section);
                          setDialogSubjects(subjects);
                          setDialogMarks(subjects.reduce((acc, subj) => ({ ...acc, [subj]: 0 }), {}));
                        } else {
                          setDialogSubjects([]);
                          setDialogMarks({});
                        }
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Student Name</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full bg-gray-100"
                      value={enteredStudent.name || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full bg-gray-100"
                      value={enteredStudent.class || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full bg-gray-100"
                      value={enteredStudent.section || ""}
                      disabled
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Subjects & Marks</label>
                  {dialogSubjects.length === 0 ? (
                    <div className="text-muted-foreground">No subjects found for this class/section.</div>
                  ) : (
                    dialogSubjects.map(subject => {
                      const marks = dialogMarks[subject] ?? 0;
                      const maxMarks = 100; // You can replace with actual max marks if available
                      const percentage = ((marks / maxMarks) * 100).toFixed(1);
                      let grade = "F";
                      if (marks >= 90) grade = "A+";
                      else if (marks >= 80) grade = "A";
                      else if (marks >= 70) grade = "B";
                      else if (marks >= 60) grade = "C";
                      else if (marks >= 50) grade = "D";
                      else if (marks >= 40) grade = "E";
                      // else F
                      return (
                        <div key={subject} className="flex items-center gap-2 mb-2">
                          <span className="w-32">{subject}</span>
                          <input
                            type="number"
                            min={0}
                            max={maxMarks}
                            value={marks}
                            onChange={e => {
                              const value = parseInt(e.target.value) || 0;
                              setDialogMarks(prev => ({ ...prev, [subject]: value }));
                            }}
                            className="border rounded px-2 py-1 w-20"
                          />
                          <span className="w-16 text-xs text-muted-foreground">{percentage}%</span>
                          <span className="w-10 text-xs font-semibold">{grade}</span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" type="button" onClick={() => setShowMarksDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Marks
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </TabsContent>
      </Tabs>
    </div>
  );
}
