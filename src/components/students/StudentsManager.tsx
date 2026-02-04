import { useState, useEffect } from "react";
import { Plus, Users, UserPlus, GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { StudentForm } from "./StudentForm";
import { StudentList } from "./StudentList";
import { mockApi, Student } from "../../services/mockApi";
import { LoadingState, EmptyState, ExportButton, ImportButton, ErrorBoundary, useConfirmDialog } from "@/components/common";
import { useKeyboardShortcuts, CommonShortcuts } from "@/hooks/useKeyboardShortcuts";
import { BulkPromotionDialog } from "./BulkPromotionDialog";
import { ArrowUpCircle } from "lucide-react";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AnimatedWrapper } from "@/components/common/AnimatedWrapper";
import { ModernCard } from "@/components/common/ModernCard";

export function StudentsManager() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    CommonShortcuts.new(() => setIsAddDialogOpen(true)),
    CommonShortcuts.search(() => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()),
  ]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await mockApi.getStudents();
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast({
          title: "Error",
          description: "Failed to load students data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (classFilter !== "all") {
      filtered = filtered.filter(student => student.class === classFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, classFilter, statusFilter]);

  const handleStudentSuccess = async () => {
    try {
      const studentsData = await mockApi.getStudents();
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setIsAddDialogOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error("Failed to refresh students:", error);
    }
  };

  const getClasses = () => {
    const classes = [...new Set(students.map(student => student.class))];
    return classes.sort();
  };

  const getStudentStats = () => {
    return {
      total: students.length,
      active: students.filter(s => s.status === 'active').length,
      inactive: students.filter(s => s.status === 'inactive').length,
      classes: getClasses().length
    };
  };

  const stats = getStudentStats();

  const handleBulkPromotion = async (fromClass: string, toClass: string) => {
    // Simulate bulk promotion
    await new Promise(resolve => setTimeout(resolve, 1000));
    const studentsData = await mockApi.getStudents();
    setStudents(studentsData);
    setFilteredStudents(studentsData);
  };

  if (loading) {
    return <LoadingState variant="cards" message="Loading students..." />;
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        <AnimatedBackground variant="mesh" className="fixed inset-0 -z-10 opacity-30" />
        
        <div className="space-y-6 relative z-10">
        <AnimatedWrapper variant="fadeInUp" delay={0.1}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-display gradient-text">{t('studentMgmt.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('studentMgmt.subtitle')}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPromotionDialogOpen(true)}
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              {t('students.bulkPromotion')}
            </Button>
            <ImportButton
              columns={[
                { key: 'name', label: 'Name', required: true },
                { key: 'rollNo', label: 'Roll No', required: true },
                { key: 'class', label: 'Class', required: true },
                { key: 'section', label: 'Section', required: true },
                { key: 'dob', label: 'Date of Birth', required: true },
                { key: 'guardianName', label: 'Guardian Name', required: true },
                { key: 'guardianPhone', label: 'Guardian Phone', required: true },
                { key: 'address', label: 'Address', required: false },
              ]}
              onImport={async (data) => {
                toast({
                  title: "Import Complete",
                  description: `Successfully imported ${data.length} student records`,
                });
                const studentsData = await mockApi.getStudents();
                setStudents(studentsData);
                setFilteredStudents(studentsData);
              }}
              templateFilename="students_import_template"
            />
            <ExportButton
              data={filteredStudents}
              filename="students"
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'rollNo', label: 'Roll No' },
                { key: 'class', label: 'Class' },
                { key: 'section', label: 'Section' },
                { key: 'guardianName', label: 'Guardian Name' },
                { key: 'guardianPhone', label: 'Guardian Phone' },
                { key: 'status', label: 'Status' },
              ]}
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('studentMgmt.addStudent')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedStudent ? t('studentMgmt.editStudent') : t('studentMgmt.addStudent')}
                  </DialogTitle>
                </DialogHeader>
                <StudentForm
                  student={selectedStudent}
                  onClose={() => {
                    setIsAddDialogOpen(false);
                    setSelectedStudent(null);
                  }}
                  onSuccess={handleStudentSuccess}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        </AnimatedWrapper>

      {/* Stats Cards */}
      <AnimatedWrapper variant="fadeInUp" delay={0.2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ModernCard variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('studentMgmt.totalStudents')}</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </ModernCard>
        <ModernCard variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserPlus className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('common.active')}</p>
                <p className="text-xl font-semibold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </ModernCard>
        <ModernCard variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Users className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('common.inactive')}</p>
                <p className="text-xl font-semibold">{stats.inactive}</p>
              </div>
            </div>
          </CardContent>
        </ModernCard>
        <ModernCard variant="glass">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('studentMgmt.classes')}</p>
                <p className="text-xl font-semibold">{stats.classes}</p>
              </div>
            </div>
          </CardContent>
        </ModernCard>
      </div>
      </AnimatedWrapper>

        {/* Students list (single view, tabs removed) */}
        <AnimatedWrapper variant="fadeInUp" delay={0.3}>
          <div className="w-full">
            {filteredStudents.length === 0 ? (
              <EmptyState
                title={t('students.noStudentsFound')}
                description={t('students.noStudentsDesc')}
                action={{
                  label: t('students.addStudent'),
                  onClick: () => setIsAddDialogOpen(true)
                }}
              />
            ) : (
              <StudentList />
            )}
          </div>

        {/* Dialogs */}
        <BulkPromotionDialog
          open={promotionDialogOpen}
          onOpenChange={setPromotionDialogOpen}
          onPromote={handleBulkPromotion}
        />
        </AnimatedWrapper>
        </div>
      </div>
    </ErrorBoundary>
  );
}
