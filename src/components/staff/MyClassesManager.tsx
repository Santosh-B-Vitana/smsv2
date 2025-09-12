
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Calendar, Award, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  subject: string;
  totalStudents: number;
  presentToday: number;
  nextClass: string;
}

interface Student {
  id: string;
  name: string;
  rollNo: string;
  attendance: number;
  lastGrade: string;
}

const mockClasses: ClassInfo[] = [
  {
    id: "class1",
    name: "Mathematics 10-A",
    grade: "10",
    subject: "Mathematics",
    totalStudents: 35,
    presentToday: 32,
    nextClass: "Today 10:00 AM"
  },
  {
    id: "class2", 
    name: "Mathematics 10-B",
    grade: "10",
    subject: "Mathematics", 
    totalStudents: 33,
    presentToday: 30,
    nextClass: "Today 2:00 PM"
  }
];

const mockStudents: Student[] = [
  { id: "1", name: "Alice Johnson", rollNo: "001", attendance: 95, lastGrade: "A+" },
  { id: "2", name: "Bob Smith", rollNo: "002", attendance: 88, lastGrade: "B+" },
  { id: "3", name: "Carol Davis", rollNo: "003", attendance: 92, lastGrade: "A" }
];

export function MyClassesManager() {
  const navigate = useNavigate();

  // Mock API to get staff assigned classes
  const getStaffAssignedClasses = () => {
    // In real implementation, this would be filtered based on logged-in staff ID
    return mockClasses;
  };

  const staffClasses = getStaffAssignedClasses();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffClasses.map((classInfo) => (
          <Card key={classInfo.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {classInfo.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Students:</span>
                  <span className="font-medium">{classInfo.totalStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Present Today:</span>
                  <span className="font-medium text-green-600">{classInfo.presentToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Next Class:</span>
                  <span className="font-medium">{classInfo.nextClass}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                size="sm"
                onClick={() => navigate(`/my-classes/${classInfo.id}`)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
