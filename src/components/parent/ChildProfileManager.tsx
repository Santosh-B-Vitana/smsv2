
import { useState } from "react";
import { User, Calendar, Award, BookOpen, Phone, Mail, MapPin, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParentChildSelector } from "./ParentChildSelector";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [selectedChildId, setSelectedChildId] = useState<string>("child1");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "555-0123",
    email: "alice.johnson@email.com", 
    address: "123 Main Street, Springfield"
  });
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const childrenData = {
    child1: { ...childData, name: "Alice Johnson", class: "10-A", rollNo: "001" },
    child2: { ...childData, name: "Bob Johnson", class: "8-B", rollNo: "045" }
  };
  
  const currentChild = childrenData[selectedChildId as keyof typeof childrenData];

  const handleContactUpdate = () => {
    // In real implementation, this would update the API
    setShowEditDialog(false);
    toast({
      title: t('childProfile.successTitle'),
      description: t('childProfile.successMessage')
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('childProfile.title')}</h1>

      {/* Child Selector */}
      <ParentChildSelector 
        selectedChildId={selectedChildId}
        onChildSelect={setSelectedChildId}
      />

      {/* Student Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{currentChild.name}</h2>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{t('studentList.class')}: {currentChild.class}</span>
                <span>{t('studentProfile.rollNo')}: {currentChild.rollNo}</span>
                <span>{t('childProfile.studentId')}: {currentChild.id}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">{t('childProfile.overallGrade')}: {currentChild.currentGrade}</Badge>
                <Badge variant="secondary">{t('childProfile.attendance')}: {currentChild.attendance}%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t('childProfile.overview')}</TabsTrigger>
          <TabsTrigger value="subjects">{t('childProfile.subjects')}</TabsTrigger>
          <TabsTrigger value="grades">{t('childProfile.recentGrades')}</TabsTrigger>
          <TabsTrigger value="profile">{t('childProfile.profileDetails')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {t('childProfile.academicPerformance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{t('childProfile.overallGrade')}</span>
                    <Badge variant="default" className="text-lg">{currentChild.currentGrade}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('childProfile.classRank')}</span>
                    <span className="font-semibold">3rd out of 35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('childProfile.attendanceRate')}</span>
                    <span className="font-semibold text-green-600">{currentChild.attendance}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('childProfile.thisWeek')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-primary/5 border-l-4 border-primary">
                    <p className="font-medium text-sm">{t('childProfile.mathTest')}</p>
                    <p className="text-xs text-muted-foreground">{t('childProfile.tomorrow')}, 10:00 AM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue/5 border-l-4 border-blue-500">
                    <p className="font-medium text-sm">{t('childProfile.scienceProject')}</p>
                    <p className="text-xs text-muted-foreground">{t('childProfile.friday')}, 2:00 PM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green/5 border-l-4 border-green-500">
                    <p className="font-medium text-sm">{t('childProfile.ptMeeting')}</p>
                    <p className="text-xs text-muted-foreground">{t('childProfile.saturday')}, 3:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>{t('childProfile.subjectPerformance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('childProfile.subject')}</TableHead>
                    <TableHead>{t('childProfile.teacher')}</TableHead>
                    <TableHead>{t('childProfile.currentGrade')}</TableHead>
                    <TableHead>{t('childProfile.attendance')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentChild.subjects.map((subject, index) => (
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
              <CardTitle>{t('childProfile.recentGrades')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('childProfile.subject')}</TableHead>
                    <TableHead>{t('childProfile.assessment')}</TableHead>
                    <TableHead>{t('childProfile.grade')}</TableHead>
                    <TableHead>{t('childProfile.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentChild.recentGrades.map((grade, index) => (
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
              <div className="flex items-center justify-between">
                <CardTitle>{t('childProfile.studentProfile')}</CardTitle>
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('childProfile.editContactInfo')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('childProfile.editContactTitle')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">{t('childProfile.phoneNumber')}</Label>
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t('childProfile.emailAddress')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">{t('childProfile.address')}</Label>
                        <Input
                          id="address"
                          value={contactInfo.address}
                          onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleContactUpdate} className="w-full">
                        {t('childProfile.updateContact')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('childProfile.fullName')}</label>
                    <p className="font-medium">{currentChild.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('childProfile.dateOfBirth')}</label>
                    <p className="font-medium">{currentChild.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('childProfile.bloodGroup')}</label>
                    <p className="font-medium">{currentChild.bloodGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('childProfile.admissionDate')}</label>
                    <p className="font-medium">{currentChild.admissionDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('childProfile.contactInformation')}</label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{contactInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{contactInfo.address}</span>
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
