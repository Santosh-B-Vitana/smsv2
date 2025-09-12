
import { useState } from "react";
import { User, Calendar, Award, BookOpen, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const childData = {
  id: "STU001",
  name: "Alice Johnson",
  class: "10-A",
  rollNo: "001",
  dateOfBirth: "2008-05-15",
  bloodGroup: "O+",
  address: "123 Main Street, Springfield",
  phone: "555-0123",
  email: "alice.johnson@email.com",
  parentName: "Robert Johnson",
  admissionDate: "2020-04-01",
  attendance: 94.5,
  currentGrade: "A+",
  subjects: [
    { name: "Mathematics", teacher: "Mr. Smith", grade: "A+", attendance: 96 },
    { name: "English", teacher: "Ms. Brown", grade: "A", attendance: 93 },
    { name: "Science", teacher: "Dr. Wilson", grade: "A+", attendance: 95 },
    { name: "History", teacher: "Mr. Davis", grade: "B+", attendance: 92 }
  ],
  recentGrades: [
    { subject: "Mathematics", test: "Unit Test 3", grade: "A+", date: "2024-03-10" },
    { subject: "English", test: "Essay Assignment", grade: "A", date: "2024-03-08" },
    { subject: "Science", test: "Lab Report", grade: "A+", date: "2024-03-05" }
  ]
};

export function ChildProfileManager() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Child</h1>

      {/* Student Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{childData.name}</h2>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Class: {childData.class}</span>
                <span>Roll No: {childData.rollNo}</span>
                <span>Student ID: {childData.id}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">Overall Grade: {childData.currentGrade}</Badge>
                <Badge variant="secondary">Attendance: {childData.attendance}%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="grades">Recent Grades</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Academic Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Grade</span>
                    <Badge variant="default" className="text-lg">{childData.currentGrade}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Class Rank</span>
                    <span className="font-semibold">3rd out of 35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Attendance Rate</span>
                    <span className="font-semibold text-green-600">{childData.attendance}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
                    <p className="font-medium text-sm">Math Test</p>
                    <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue/5 border-l-4 border-blue-500">
                    <p className="font-medium text-sm">Science Project Due</p>
                    <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green/5 border-l-4 border-green-500">
                    <p className="font-medium text-sm">Parent-Teacher Meeting</p>
                    <p className="text-xs text-muted-foreground">Saturday, 3:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {childData.subjects.map((subject, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.teacher}</TableCell>
                      <TableCell>
                        <Badge variant={subject.grade.includes('A') ? 'default' : 'secondary'}>
                          {subject.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{subject.attendance}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {childData.recentGrades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{grade.subject}</TableCell>
                      <TableCell>{grade.test}</TableCell>
                      <TableCell>
                        <Badge variant="default">{grade.grade}</Badge>
                      </TableCell>
                      <TableCell>{grade.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="font-medium">{childData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="font-medium">{childData.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                    <p className="font-medium">{childData.bloodGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Admission Date</label>
                    <p className="font-medium">{childData.admissionDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{childData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{childData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{childData.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
