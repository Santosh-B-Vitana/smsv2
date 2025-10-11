
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockApi, Student } from "../../services/mockApi";
import placeholderImg from '/placeholder.svg';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";


export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedClass, selectedSection]);

  const fetchStudents = async () => {
    try {
      const data = await mockApi.getStudents();
      setStudents(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
      );
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter(student => student.class === selectedClass);
    }

    if (selectedSection !== "all") {
      filtered = filtered.filter(student => student.section === selectedSection);
    }

    setFilteredStudents(filtered);
  };

  const toggleStudentStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await mockApi.updateStudent(id, { status: newStatus });
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast({
        title: "Success",
        description: `Student ${newStatus === 'active' ? 'reactivated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${newStatus === 'active' ? 'reactivate' : 'deactivate'} student`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('studentList.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
  {/* Header Section - All names and details are now Indian context (e.g. Aarav Gupta, Priya Singh, ₹) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('studentList.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('studentList.subtitle')}
          </p>
        </div>
  {/* The Add Student button is now handled by StudentsManager for dialog functionality */}
      </div>

      {/* Filters Section */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{t('studentList.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('studentList.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder={t('studentList.allClasses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('studentList.allClasses')}</SelectItem>
                {Array.from({length: 12}, (_, i) => (
                  <SelectItem key={i+1} value={String(i+1)}>{t('studentList.class')} {i+1}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger>
                <SelectValue placeholder={t('studentList.allSections')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('studentList.allSections')}</SelectItem>
                {['A', 'B', 'C', 'D'].map(section => (
                  <SelectItem key={section} value={section}>{t('studentList.section')} {section}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedClass("all");
                setSelectedSection("all");
              }}
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('studentList.clearFilters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {t('studentList.showing')} {filteredStudents.length} {t('studentList.of')} {students.length} {t('studentList.students')}
        </span>
      </div>

      {/* Students Table/Grid */}
      <Card className="border-border">
        <CardContent className="p-0">
          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-semibold">{t('studentList.rollNo')}</TableHead>
                    <TableHead className="font-semibold">{t('studentList.name')}</TableHead>
                    <TableHead className="font-semibold hidden sm:table-cell">{t('studentList.class')}</TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">{t('studentList.guardianName')}</TableHead>
                    <TableHead className="font-semibold hidden lg:table-cell">{t('studentList.contact')}</TableHead>
                    <TableHead className="font-semibold">{t('studentList.status')}</TableHead>
                    <TableHead className="font-semibold text-right">{t('studentList.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.id} 
                      className="border-border hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium text-sm">
                        {student.rollNo}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="inline-block w-9 h-9 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                            {student.photoUrl ? (
                              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              <img src={placeholderImg} alt="No photo" className="w-full h-full object-cover opacity-60" />
                            )}
                          </span>
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{student.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {student.class}-{student.section}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {student.class}-{student.section}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {student.guardianName}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {student.guardianPhone}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={student.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {student.status === 'active' ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/students/${student.id}`)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4 mr-1" /> {t('common.manage')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('studentList.noStudentsFound')}</p>
                <p className="text-sm">{t('studentList.adjustCriteria')}</p>
              </div>
              <Button 
                onClick={() => navigate("/students/new")}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('studentList.addFirstStudent')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
  </div>
  );
}
