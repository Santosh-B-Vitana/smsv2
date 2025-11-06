import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus,
  Calendar as CalendarIcon,
  Edit,
  Trash2,
  Download,
  Send,
  FileText,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { generateReportCard } from "@/utils/pdfGenerator";

interface SubjectExam {
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  maxMarks: number;
  venue: string;
  instructions?: string;
}

interface ExamTimetable {
  id: string;
  examName: string; // e.g., "Half Yearly Exam 2024"
  examType: 'quarterly' | 'half-yearly' | 'annual' | 'pre-board' | 'unit-test';
  academicYear: string;
  class: string;
  section: string;
  subjects: SubjectExam[];
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  createdAt: string;
  publishedAt?: string;
  generalInstructions?: string;
}

export default function ExamTimetableCreator() {
  const [timetables, setTimetables] = useState<ExamTimetable[]>([
    {
      id: "TT001",
      examName: "Half Yearly Examination 2024",
      examType: "half-yearly",
      academicYear: "2024-25",
      class: "Class 10",
      section: "A",
      subjects: [
        {
          subject: "Mathematics",
          date: new Date("2024-12-15"),
          startTime: "09:00",
          endTime: "12:00",
          duration: 180,
          maxMarks: 100,
          venue: "Room 101",
          instructions: "Bring calculator and geometry box"
        },
        {
          subject: "English",
          date: new Date("2024-12-17"),
          startTime: "09:00",
          endTime: "12:00",
          duration: 180,
          maxMarks: 100,
          venue: "Room 102"
        }
      ],
      status: "published",
      createdAt: "2024-11-01",
      publishedAt: "2024-11-15",
      generalInstructions: "Report 30 minutes before exam time. Carry admit card and ID card."
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState<ExamTimetable | null>(null);
  const [currentStep, setCurrentStep] = useState<'basic' | 'subjects'>("basic");
  
  // Form state
  const [formData, setFormData] = useState<Partial<ExamTimetable>>({
    academicYear: "2024-25",
    examType: "half-yearly",
    status: "draft",
    subjects: []
  });
  
  const [currentSubject, setCurrentSubject] = useState<Partial<SubjectExam>>({
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    maxMarks: 100
  });
  const [subjectDate, setSubjectDate] = useState<Date>();

  // Mock data
  const academicYears = ["2023-24", "2024-25", "2025-26"];
  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
  const sections = ["A", "B", "C", "D"];
  const subjects = [
    "Mathematics", 
    "English", 
    "Science", 
    "Social Studies", 
    "Hindi",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
    "Business Studies",
    "Accountancy"
  ];
  const examTypes = [
    { value: "quarterly", label: "Quarterly Exam" },
    { value: "half-yearly", label: "Half Yearly Exam" },
    { value: "annual", label: "Annual Exam" },
    { value: "pre-board", label: "Pre-Board Exam" },
    { value: "unit-test", label: "Unit Test" }
  ];
  const venues = ["Room 101", "Room 102", "Room 103", "Room 104", "Auditorium", "Computer Lab", "Science Lab"];

  const handleCreateTimetable = () => {
    if (!formData.examName || !formData.class || !formData.subjects || formData.subjects.length === 0) {
      toast.error("Please fill all required fields and add at least one subject");
      return;
    }

    const newTimetable: ExamTimetable = {
      id: `TT${Date.now()}`,
      examName: formData.examName!,
      examType: formData.examType as any,
      academicYear: formData.academicYear!,
      class: formData.class!,
      section: formData.section || "A",
      subjects: formData.subjects as SubjectExam[],
      status: "draft",
      createdAt: new Date().toISOString(),
      generalInstructions: formData.generalInstructions
    };

    setTimetables(prev => [...prev, newTimetable]);
    toast.success("Exam timetable created successfully");
    
    resetForm();
  };

  const handleAddSubject = () => {
    if (!currentSubject.subject || !subjectDate) {
      toast.error("Please fill subject and date");
      return;
    }

    const newSubject: SubjectExam = {
      subject: currentSubject.subject!,
      date: subjectDate,
      startTime: currentSubject.startTime || "09:00",
      endTime: currentSubject.endTime || "12:00",
      duration: currentSubject.duration || 180,
      maxMarks: currentSubject.maxMarks || 100,
      venue: currentSubject.venue || "Room 101",
      instructions: currentSubject.instructions
    };

    setFormData(prev => ({
      ...prev,
      subjects: [...(prev.subjects || []), newSubject]
    }));

    // Reset subject form
    setCurrentSubject({
      startTime: "09:00",
      endTime: "12:00",
      duration: 180,
      maxMarks: 100
    });
    setSubjectDate(undefined);
    
    toast.success("Subject added to timetable");
  };

  const handleRemoveSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects?.filter((_, i) => i !== index)
    }));
    toast.success("Subject removed");
  };

  const handlePublishTimetable = (timetableId: string) => {
    setTimetables(prev => prev.map(tt => 
      tt.id === timetableId 
        ? { ...tt, status: "published", publishedAt: new Date().toISOString() }
        : tt
    ));
    toast.success("Exam timetable published successfully - visible to students and parents");
  };

  const handleDeleteTimetable = (timetableId: string) => {
    if (confirm("Are you sure you want to delete this timetable?")) {
      setTimetables(prev => prev.filter(tt => tt.id !== timetableId));
      toast.success("Timetable deleted successfully");
    }
  };

  const handleDownloadTimetable = async (timetable: ExamTimetable) => {
    try {
      // Create a simple PDF for timetable
      toast.success("Timetable download feature - PDF generation coming soon");
      
      // TODO: Implement proper timetable PDF generation
      // For now, just show success message
    } catch (error) {
      toast.error("Failed to download timetable");
    }
  };

  const handleNotifyStudents = (timetableId: string) => {
    toast.success("Notification sent to all students and parents");
  };

  const resetForm = () => {
    setFormData({
      academicYear: "2024-25",
      examType: "half-yearly",
      status: "draft",
      subjects: []
    });
    setCurrentSubject({
      startTime: "09:00",
      endTime: "12:00",
      duration: 180,
      maxMarks: 100
    });
    setSubjectDate(undefined);
    setCurrentStep("basic");
    setShowCreateDialog(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published": return "default";
      case "ongoing": return "secondary";
      case "completed": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Exam Schedule Manager</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage exam schedules for quarterly, half-yearly, and annual examinations
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam Timetable
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentStep === "basic" ? "Basic Information" : "Add Subjects"}
              </DialogTitle>
            </DialogHeader>

            {currentStep === "basic" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Exam Name *</Label>
                    <Input
                      value={formData.examName || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, examName: e.target.value }))}
                      placeholder="e.g., Half Yearly Examination 2024"
                    />
                  </div>

                  <div>
                    <Label>Exam Type *</Label>
                    <Select 
                      value={formData.examType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, examType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {examTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Academic Year *</Label>
                    <Select 
                      value={formData.academicYear} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Class *</Label>
                    <Select 
                      value={formData.class} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                    >
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
                    <Select 
                      value={formData.section} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                    >
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

                  <div className="col-span-2">
                    <Label>General Instructions</Label>
                    <Textarea
                      value={formData.generalInstructions || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, generalInstructions: e.target.value }))}
                      placeholder="General instructions for all exams (e.g., reporting time, required documents)"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={() => setCurrentStep("subjects")}>
                    Next: Add Subjects
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Add Subject Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Add Subject to Timetable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Subject *</Label>
                        <Select 
                          value={currentSubject.subject} 
                          onValueChange={(value) => setCurrentSubject(prev => ({ ...prev, subject: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Exam Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {subjectDate ? format(subjectDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={subjectDate}
                              onSelect={setSubjectDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={currentSubject.startTime || ""}
                          onChange={(e) => setCurrentSubject(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={currentSubject.endTime || ""}
                          onChange={(e) => setCurrentSubject(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={currentSubject.duration || ""}
                          onChange={(e) => setCurrentSubject(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          placeholder="180"
                        />
                      </div>

                      <div>
                        <Label>Maximum Marks</Label>
                        <Input
                          type="number"
                          value={currentSubject.maxMarks || ""}
                          onChange={(e) => setCurrentSubject(prev => ({ ...prev, maxMarks: parseInt(e.target.value) }))}
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <Label>Venue</Label>
                        <Select 
                          value={currentSubject.venue} 
                          onValueChange={(value) => setCurrentSubject(prev => ({ ...prev, venue: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select venue" />
                          </SelectTrigger>
                          <SelectContent>
                            {venues.map(venue => (
                              <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Label>Special Instructions</Label>
                        <Input
                          value={currentSubject.instructions || ""}
                          onChange={(e) => setCurrentSubject(prev => ({ ...prev, instructions: e.target.value }))}
                          placeholder="e.g., Bring calculator, geometry box"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button onClick={handleAddSubject}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Added Subjects List */}
                {formData.subjects && formData.subjects.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Added Subjects ({formData.subjects.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Venue</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.subjects.map((subject, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{subject.subject}</TableCell>
                              <TableCell>{format(new Date(subject.date), "PPP")}</TableCell>
                              <TableCell>{subject.startTime} - {subject.endTime}</TableCell>
                              <TableCell>{subject.venue}</TableCell>
                              <TableCell>{subject.maxMarks}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveSubject(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep("basic")}>
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateTimetable}
                      disabled={!formData.subjects || formData.subjects.length === 0}
                    >
                      Create Timetable
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Timetables List */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Timetables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetables.map((timetable) => (
                <TableRow key={timetable.id}>
                  <TableCell className="font-medium">{timetable.examName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {examTypes.find(t => t.value === timetable.examType)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{timetable.class} {timetable.section}</TableCell>
                  <TableCell>{timetable.academicYear}</TableCell>
                  <TableCell>{timetable.subjects.length} subjects</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(timetable.status)}>
                      {timetable.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTimetable(timetable);
                          setShowViewDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadTimetable(timetable)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {timetable.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublishTimetable(timetable.id)}
                        >
                          <Send className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {timetable.status === "published" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNotifyStudents(timetable.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTimetable(timetable.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Timetable Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTimetable?.examName}</DialogTitle>
          </DialogHeader>
          {selectedTimetable && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Class</Label>
                  <p className="font-medium">{selectedTimetable.class} {selectedTimetable.section}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Academic Year</Label>
                  <p className="font-medium">{selectedTimetable.academicYear}</p>
                </div>
                {selectedTimetable.generalInstructions && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">General Instructions</Label>
                    <p className="text-sm">{selectedTimetable.generalInstructions}</p>
                  </div>
                )}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Max Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTimetable.subjects
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{format(new Date(subject.date), "PPP")}</TableCell>
                        <TableCell>{subject.startTime} - {subject.endTime}</TableCell>
                        <TableCell>{subject.duration} min</TableCell>
                        <TableCell>{subject.venue}</TableCell>
                        <TableCell>{subject.maxMarks}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
