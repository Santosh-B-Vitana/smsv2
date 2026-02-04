import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, GraduationCap, CalendarDays, Upload } from "lucide-react";
import ResultsManager from "@/pages/academics/ResultsManager";
import ExamTimetableCreator from "@/components/examinations/ExamTimetableCreator";
import StudentResultPortal from "@/pages/StudentResultPortal";
import { BulkMarksImportDialog } from "@/components/examinations/BulkMarksImportDialog";

export default function ExaminationManager() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Examination Management System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timetable" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timetable">
                <CalendarDays className="h-4 w-4 mr-2" />
                Exam Schedule
              </TabsTrigger>
              <TabsTrigger value="results">
                <FileText className="h-4 w-4 mr-2" />
                Results & Marks
              </TabsTrigger>
              <TabsTrigger value="bulkimport">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Import
              </TabsTrigger>
              <TabsTrigger value="portal">
                <GraduationCap className="h-4 w-4 mr-2" />
                Student Portal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="timetable">
              <ExamTimetableCreator />
            </TabsContent>
            <TabsContent value="results">
              <ResultsManager />
            </TabsContent>
            <TabsContent value="bulkimport">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Marks Import</CardTitle>
                </CardHeader>
                <CardContent>
                  <BulkMarksImportDialog
                    examId="EXAM001"
                    examName="Mid-Term Exam 2024"
                    onImport={(marks) => console.log('Imported marks:', marks)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="portal">
              <StudentResultPortal />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}