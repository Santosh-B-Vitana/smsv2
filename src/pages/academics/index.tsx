import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, Users, Clock, Award, GraduationCap } from "lucide-react";
import AcademicYearManager from "./AcademicYearManager";
import ClassManager from "./ClassManager";
import SubjectManager from "./SubjectManager";
import TimetableManager from "./TimetableManager";
import ExaminationManager from "./ExaminationManager";

export default function Academics() {
  const [activeTab, setActiveTab] = useState("academic-years");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-display">Academics Management</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive academic management system for classes, subjects, timetables, and examinations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Academic Year</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024-2025</div>
            <p className="text-xs text-muted-foreground">Current academic year</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across all standards</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">Subject-class combinations</p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="academic-years" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Academic Years
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Classes
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="timetable" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timetable
          </TabsTrigger>
          <TabsTrigger value="examinations" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Examinations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="academic-years" className="space-y-6">
          <AcademicYearManager />
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <ClassManager />
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <SubjectManager />
        </TabsContent>

        <TabsContent value="timetable" className="space-y-6">
          <TimetableManager />
        </TabsContent>

        <TabsContent value="examinations" className="space-y-6">
          <ExaminationManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}