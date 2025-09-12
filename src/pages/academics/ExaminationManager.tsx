import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import ResultsManager from "@/pages/academics/ResultsManager";
import ExamScheduleManager from "@/components/examinations/ExamScheduleManager";

export default function ExaminationManager() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Examination Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exams" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exams">Exam Schedule</TabsTrigger>
              <TabsTrigger value="results">Results Management</TabsTrigger>
            </TabsList>
            <TabsContent value="exams">
              <ExamScheduleManager />
            </TabsContent>
            <TabsContent value="results">
              <ResultsManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}