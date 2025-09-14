
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Calendar, Award, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApi } from "../../services/mockApi";

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



export function MyClassesManager() {
  const navigate = useNavigate();


  const [staffClasses, setStaffClasses] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const classes = await mockApi.getClasses();
        setStaffClasses(classes);
      } catch {}
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffClasses.map((classInfo) => (
          <Card key={classInfo.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {classInfo.standard} {classInfo.section}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Students:</span>
                  <span className="font-medium">{classInfo.totalStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Class Teacher:</span>
                  <span className="font-medium">{classInfo.classTeacher}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-4" 
                size="sm"
                onClick={() => {
                  // Defensive: ensure id is in CLSxxx format
                  let classId = classInfo.id;
                  if (!/^CLS\d{3}$/.test(classId)) {
                    classId = `CLS${String(classId).padStart(3, '0')}`;
                  }
                  navigate(`/staff-class/${classId}`);
                }}
              >
                Manage Class
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
