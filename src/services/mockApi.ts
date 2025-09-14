// Syllabus interface for Academics module
interface Syllabus {
  id: string;
  schoolId: string;
  class: string; // e.g. '1', '2', 'Pre-Primary', etc.
  subject: string;
  title: string;
  description: string;
  fileUrl?: string;
}

// Mock syllabus data
const mockSyllabi: Syllabus[] = [
  {
    id: 'SYL001',
    schoolId: 'SCH001',
    class: '10',
    subject: 'Mathematics',
    title: 'CBSE Class 10 Maths Syllabus',
    description: 'Full syllabus for class 10 mathematics (CBSE)',
    fileUrl: ''
  },
  {
    id: 'SYL002',
    schoolId: 'SCH001',
    class: '12',
    subject: 'Physics',
    title: 'Class 12 Physics Syllabus',
    description: 'Detailed syllabus for class 12 physics',
    fileUrl: ''
  }
];
// Mock API service for School Management System
// Class Management
export interface SchoolClass {
  id: string;
  standard: string;
  section: string;
  academicYear: string;
  totalStudents: number;
  classTeacher: string;
  students?: Array<{
    id: string;
    name: string;
    rollNo: string;
    photoUrl?: string;
  }>;
}

const CLASS_STORAGE_KEY = 'mockClasses';
function getInitialClasses(): SchoolClass[] {
  try {
    const raw = localStorage.getItem(CLASS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  // If localStorage is empty, use defaults
  return [
    {
      id: 'CLS001',
      standard: 'Class 1',
      section: 'A',
      academicYear: '2024-2025',
      totalStudents: 30,
      classTeacher: 'Ms. Sarah Johnson',
      students: [
        { id: 'STU001', name: 'Aarav Sharma', rollNo: '1', photoUrl: '' },
        { id: 'STU002', name: 'Priya Singh', rollNo: '2', photoUrl: '' },
        { id: 'STU003', name: 'Rahul Verma', rollNo: '3', photoUrl: '' },
        { id: 'STU004', name: 'Sneha Patel', rollNo: '4', photoUrl: '' },
        { id: 'STU005', name: 'Rohan Gupta', rollNo: '5', photoUrl: '' }
      ]
    },
    {
      id: 'CLS002',
      standard: 'Class 1',
      section: 'B',
      academicYear: '2024-2025',
      totalStudents: 28,
      classTeacher: 'Mr. David Smith',
      students: [
        { id: 'STU006', name: 'Isha Mehra', rollNo: '1', photoUrl: '' },
        { id: 'STU007', name: 'Kabir Jain', rollNo: '2', photoUrl: '' },
        { id: 'STU008', name: 'Meera Nair', rollNo: '3', photoUrl: '' },
        { id: 'STU009', name: 'Devansh Rao', rollNo: '4', photoUrl: '' },
        { id: 'STU010', name: 'Simran Kaur', rollNo: '5', photoUrl: '' }
      ]
    }
  ];
}

// Only initialize mockClasses once per session, avoid hot reload resets
declare global {
  interface Window {
    __mockClasses?: SchoolClass[];
  }
}
let mockClasses: SchoolClass[] = window.__mockClasses || getInitialClasses();
window.__mockClasses = mockClasses;
function persistClasses() {
  try { localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(mockClasses)); } catch {}
}
// This structure makes it easy to replace with real backend endpoints later

interface SchoolInfo {
  id: string;
  name: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  plan?: string;
  principalName?: string;
  establishmentDate?: string;
  boardAffiliation?: string;
  totalStudents?: number;
  totalStaff?: number;
  websiteUrl?: string;
  description?: string;
}

// User management interface
interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff' | 'parent';
  status: 'active' | 'inactive';
  schoolId?: string;
  createdAt: string;
  lastLogin?: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  dob: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  category: string;
  previousSchool?: string;
  status: 'active' | 'inactive';
  admissionDate: string;
  photoUrl?: string;
}

interface Staff {
  id: string;
  name: string;
  designation: string;
  department: string;
  subjects: string[];
  phone: string;
  email: string;
  address: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  experience?: number;
  qualification?: string;
  salary?: number;
  photoUrl?: string;
}

// Payroll
export interface StaffPayroll {
  id: string;
  staffId: string;
  month: string; // e.g. '2025-09'
  basic: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'paid' | 'pending';
}

// Leave
export interface StaffLeave {
  id: string;
  staffId: string;
  type: string; // e.g. 'Sick', 'Casual', 'Earned'
  from: string;
  to: string;
  status: 'approved' | 'pending' | 'rejected';
  reason: string;
}

// Performance
export interface StaffPerformance {
  id: string;
  staffId: string;
  year: string;
  rating: number; // 1-5
  remarks: string;
}

// New attendance system interfaces
interface AttendanceRecord {
  id: string;
  class_id: string;
  date: string;
  created_by: string;
  source: 'teacher' | 'biometric' | 'admin_manual';
  entries: AttendanceEntry[];
}

interface AttendanceEntry {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
  recorded_at: string;
  recorded_by: string;
}

interface BiometricDevice {
  id: string;
  name: string;
  last_sync: string;
  status: 'online' | 'offline';
  mapping: BiometricMapping[];
}

interface BiometricMapping {
  device_user_id: string;
  system_student_id: string;
}

interface ResultEntry {
  id: string;
  student_id: string;
  class_id: string;
  academic_year: string;
  exam_id: string;
  subject_id: string;
  marks_obtained: number;
  grade: string;
  entered_by: string;
  entered_at: string;
}

interface Subject {
  id: string;
  name: string;
  max_marks: number;
}

interface Grade {
  grade: string;
  min_marks: number;
  max_marks: number;
}

interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  paymentMode?: string;
  academicYear: string;
}

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  attendanceToday: number;
  pendingFees: number;
  upcomingEvents: number;
}

  // New interfaces for missing modules
  interface Transport {
    id: string;
    busNumber: string;
    route: string;
    driverId: string;
    driverName: string;
    capacity: number;
    students: string[];
    status: 'active' | 'maintenance' | 'inactive';
  }

  interface Alumni {
    id: string;
    name: string;
    graduationYear: string;
    class: string;
    currentOccupation: string;
    company: string;
    location: string;
    email: string;
    phone: string;
    achievements: string;
    photoUrl?: string;
    isStarAlumni: boolean;
    createdAt: string;
  }

  interface AlumniMeet {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    attendees: string[];
    status: 'planned' | 'completed' | 'cancelled';
  }

  interface StaffAttendanceRecord {
    id: string;
    staffId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'on_leave';
    reason?: string;
    markedBy: string;
    markedAt: string;
  }

  interface StaffLeaveRequest {
    id: string;
    staffId: string;
    startDate: string;
    endDate: string;
    days: number;
    isHalfDay: boolean;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
    approvedBy?: string;
    approvedAt?: string;
  }

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
}

interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
}

interface HealthRecord {
  id: string;
  studentId: string;
  date: string;
  checkupType: string;
  findings: string;
  doctorName: string;
  recommendations?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: string[];
  createdBy: string;
  createdAt: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'draft';
}

interface Exam {
  id: string;
  name: string;
  class: string;
  subject: string;
  date: string;
  duration: number;
  maxMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  remarks?: string;
}

interface TimetableSlot {
  id: string;
  class: string;
  section: string;
  day: string;
  period: number;
  subject: string;
  teacherId: string;
  startTime: string;
  endTime: string;
}

interface Admission {
  id: string;
  studentName: string;
  guardianName: string;
  guardianPhone: string;
  email: string;
  appliedClass: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
}

interface Communication {
  id: string;
  type: 'sms' | 'email' | 'notification';
  recipient: string;
  subject?: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed';
}


// Mock data
const mockSchools: SchoolInfo[] = [
  {
    id: "SCH001",
    name: "Vitana Schools",
    logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=200&fit=crop&crop=center",
    address: "123 Education Street, Learning City, LC 12345",
    phone: "+91 98765 43210",
    email: "info@vitanaSchools.edu",
    status: "active",
    plan: "Pro",
    principalName: "Dr. Sarah Johnson",
    establishmentDate: "1985-04-15",
    boardAffiliation: "CBSE",
    totalStudents: 1200,
    totalStaff: 85,
    websiteUrl: "https://vitanaschools.edu",
    description: "A premier educational institution focused on holistic development"
  },
  {
    id: "SCH002",
    name: "Delhi Public School",
    logoUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop&crop=center",
    address: "456 Knowledge Ave, Delhi, 110001",
    phone: "+91 91234 56789",
    email: "contact@dps.edu.in",
    status: "inactive",
    principalName: "Mr. Rajesh Kumar",
    establishmentDate: "1992-08-20",
    boardAffiliation: "CBSE",
    totalStudents: 980,
    totalStaff: 72,
    websiteUrl: "https://dps.edu.in",
    description: "Excellence in education with focus on character building"
  }
];

// Mock users data
const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Admin User",
    email: "admin@vitanaschools.edu",
    role: "super_admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-02-15T09:30:00Z"
  },
  {
    id: "USR002", 
    name: "John Smith",
    email: "john.smith@vitanaschools.edu",
    role: "admin",
    status: "active",
    schoolId: "SCH001",
    createdAt: "2024-01-15T00:00:00Z",
    lastLogin: "2024-02-14T14:20:00Z"
  },
  {
    id: "USR003",
    name: "Mary Wilson",
    email: "mary.wilson@vitanaschools.edu", 
    role: "staff",
    status: "active",
    schoolId: "SCH001",
    createdAt: "2024-02-01T00:00:00Z",
    lastLogin: "2024-02-13T11:45:00Z"
  }
];

const schoolInfo: SchoolInfo = mockSchools[0];

const mockStudents: Student[] = [
  {
    id: "STU001",
    name: "Aarav Gupta",
    class: "10",
    section: "A",
    rollNo: "001",
    dob: "2008-05-15",
    guardianName: "Suresh Gupta",
    guardianPhone: "+1 (555) 987-6543",
    address: "456 Shastri Nagar, Delhi",
    category: "General",
    previousSchool: "Delhi Public School",
    status: "active",
    admissionDate: "2023-04-01",
    photoUrl: undefined
  },
  {
    id: "STU002",
    name: "Rohan Mehra",
    class: "10",
    section: "A",
    rollNo: "002",
    dob: "2008-08-22",
    guardianName: "Meena Mehra",
    guardianPhone: "+1 (555) 876-5432",
    address: "789 Patel Colony, Lucknow",
    category: "General",
    status: "active",
    admissionDate: "2023-04-01",
    photoUrl: undefined
  },
  {
    id: "STU003",
  name: "Ananya Sharma",
    class: "9",
    section: "B",
    rollNo: "015",
    dob: "2009-02-10",
  guardianName: "Rekha Sharma",
    guardianPhone: "+1 (555) 765-4321",
  address: "321 Civil Lines, Jaipur",
    category: "General",
    status: "active",
    admissionDate: "2023-04-01"
  }
];

function getInitialStaff() {
  const stored = localStorage.getItem('mockStaff');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback to default
    }
  }
  return [
    {
      id: "STAFF001",
      name: "Dr. Rajesh Sharma",
      designation: "Principal",
      department: "Administration",
      subjects: [],
      phone: "+1 (555) 111-2222",
      email: "admin@vitanaSchools.edu",
      address: "567 Sector 21, Noida",
      joiningDate: "2020-01-15",
      status: "active"
    },
    {
      id: "STAFF002",
      name: "Anil Kumar",
      designation: "Mathematics Teacher",
      department: "Mathematics",
      subjects: ["Algebra", "Geometry", "Calculus"],
      phone: "+1 (555) 222-3333",
      email: "anil.kumar@vitanaSchools.edu",
      address: "890 Model Town, Chandigarh",
      joiningDate: "2019-08-20",
      status: "active"
    },
    {
      id: "STAFF003",
      name: "Priya Singh",
      designation: "English Teacher",
      department: "English",
      subjects: ["Literature", "Grammar", "Creative Writing"],
      phone: "+1 (555) 333-4444",
      email: "priya.singh@vitanaSchools.edu",
      address: "234 Ashok Vihar, Kanpur",
      joiningDate: "2021-06-10",
      status: "active"
    }
  ];
}

let mockStaff: Staff[] = getInitialStaff();

function persistStaff() {
  localStorage.setItem('mockStaff', JSON.stringify(mockStaff));
}

// Mock Payroll Data
const mockPayroll: StaffPayroll[] = [
  {
    id: 'PAY001', staffId: 'STAFF001', month: '2025-08', basic: 30000, allowances: 5000, deductions: 2000, netPay: 33000, status: 'paid'
  },
  {
    id: 'PAY002', staffId: 'STAFF002', month: '2025-08', basic: 28000, allowances: 4000, deductions: 1500, netPay: 30500, status: 'pending'
  }
];

// Mock Leave Data
const mockLeaves: StaffLeave[] = [
  {
    id: 'LEAVE001', staffId: 'STAFF001', type: 'Sick', from: '2025-08-10', to: '2025-08-12', status: 'approved', reason: 'Fever'
  },
  {
    id: 'LEAVE002', staffId: 'STAFF002', type: 'Casual', from: '2025-08-15', to: '2025-08-16', status: 'pending', reason: 'Personal'
  }
];

// Mock Performance Data
const mockPerformance: StaffPerformance[] = [
  {
    id: 'PERF001', staffId: 'STAFF001', year: '2024', rating: 4.5, remarks: 'Excellent teaching and discipline.'
  },
  {
    id: 'PERF002', staffId: 'STAFF002', year: '2024', rating: 3.8, remarks: 'Good, needs improvement in punctuality.'
  }
];

const mockDashboardStats: DashboardStats = {
  totalStudents: 1247,
  totalStaff: 85,
  attendanceToday: 92.5,
  pendingFees: 15420,
  upcomingEvents: 3
};

// New mock data for missing modules
const mockTransports: Transport[] = [
  {
    id: "BUS001",
    busNumber: "SCH-001",
    route: "Route A - Downtown",
    driverId: "DRV001",
    driverName: "John Smith",
    capacity: 45,
    students: ["STU001", "STU002"],
    status: "active"
  },
  {
    id: "BUS002",
    busNumber: "SCH-002", 
    route: "Route B - Suburbs",
    driverId: "DRV002",
    driverName: "Mike Wilson",
    capacity: 50,
    students: ["STU003"],
    status: "active"
  }
];

const mockLibraryBooks: LibraryBook[] = [
  {
    id: "LIB001",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    totalCopies: 15,
    availableCopies: 12,
    location: "Fiction Section - A1"
  },
  {
    id: "LIB002",
    title: "Introduction to Physics",
    author: "John Doe",
    isbn: "978-0-12-345678-9",
    category: "Science",
    totalCopies: 20,
    availableCopies: 18,
    location: "Science Section - B2"
  }
];

const mockHealthRecords: HealthRecord[] = [
  {
    id: "HEALTH001",
    studentId: "STU001",
    date: "2024-01-15",
    checkupType: "Annual Physical",
    findings: "Healthy, no issues found",
    doctorName: "Dr. Emily Brown",
    recommendations: "Continue regular exercise"
  }
];

const mockAnnouncements: Announcement[] = [
  {
    id: "ANN001",
    title: "Annual Sports Day",
    content: "Annual sports day will be held on March 15th, 2024. All students are required to participate.",
    category: "Events",
    priority: "high",
    targetAudience: ["students", "parents"],
    createdBy: "STAFF001",
    createdAt: "2024-02-01T10:00:00Z",
    expiryDate: "2024-03-20",
    status: "active"
  }
];

const mockExams: Exam[] = [
  {
    id: "EXAM001",
    name: "Mid-Term Mathematics",
    class: "10",
    subject: "Mathematics",
    date: "2024-03-10",
    duration: 120,
    maxMarks: 100,
    status: "upcoming"
  }
];

const mockTimetable: TimetableSlot[] = [
  {
    id: "TT001",
    class: "10",
    section: "A",
    day: "Monday",
    period: 1,
    subject: "Mathematics",
    teacherId: "STAFF002",
    startTime: "09:00",
    endTime: "10:00"
  }
];

const mockAdmissions: Admission[] = [
  {
    id: "ADM001",
    studentName: "New Student",
    guardianName: "Parent Name",
    guardianPhone: "+1 (555) 999-8888",
    email: "parent@email.com",
    appliedClass: "9",
    applicationDate: "2024-01-20",
    status: "pending",
    documents: ["birth_certificate", "transfer_certificate"]
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Staff attendance store (mock)
type StaffAttendanceStatus = 'present' | 'leave' | 'late';
interface StaffAttendanceEntry { staffId: string; date: string; status: StaffAttendanceStatus; reason?: string }

const STAFF_ATTENDANCE_KEY = 'mockStaffAttendance';
function getInitialStaffAttendance(): StaffAttendanceEntry[] {
  try {
    const raw = localStorage.getItem(STAFF_ATTENDANCE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
let mockStaffAttendance: StaffAttendanceEntry[] = getInitialStaffAttendance();
function persistStaffAttendance() {
  try { localStorage.setItem(STAFF_ATTENDANCE_KEY, JSON.stringify(mockStaffAttendance)); } catch {}
}

export const mockApi = {
  // Class Management APIs
  getClasses: async (): Promise<SchoolClass[]> => {
    await delay(300);
    return mockClasses;
  },
  getClass: async (id: string): Promise<SchoolClass | null> => {
    await delay(300);
    return mockClasses.find(cls => cls.id === id) || null;
  },
  createClass: async (cls: Omit<SchoolClass, 'id'>): Promise<SchoolClass> => {
    await delay(300);
    const newClass: SchoolClass = {
      ...cls,
      id: `CLS${String(mockClasses.length + 1).padStart(3, '0')}`,
      students: []
    };
    mockClasses.push(newClass);
    persistClasses();
    return newClass;
  },
  updateClass: async (id: string, updates: Partial<SchoolClass>): Promise<SchoolClass | null> => {
    await delay(300);
    const idx = mockClasses.findIndex(cls => cls.id === id);
    if (idx === -1) return null;
    mockClasses[idx] = { ...mockClasses[idx], ...updates };
    persistClasses();
    return mockClasses[idx];
  },
  deleteClass: async (id: string): Promise<boolean> => {
    await delay(300);
    const idx = mockClasses.findIndex(cls => cls.id === id);
    if (idx === -1) return false;
    mockClasses.splice(idx, 1);
    persistClasses();
    return true;
  },
  // Get subjects for a class and section
  getSubjectsForClassSection: async (className: string, section: string): Promise<string[]> => {
    await delay(300);
    // Find all syllabus entries for the class
    return mockSyllabi.filter(s => s.class === className).map(s => s.subject);
  },
  // Syllabus APIs
  getSyllabi: async (): Promise<Syllabus[]> => {
    await delay(300);
    return mockSyllabi;
  },
  addSyllabus: async (syllabus: Omit<Syllabus, 'id'>): Promise<Syllabus> => {
    await delay(300);
    const newSyllabus: Syllabus = {
      ...syllabus,
      id: `SYL${String(mockSyllabi.length + 1).padStart(3, '0')}`
    };
    mockSyllabi.push(newSyllabus);
    return newSyllabus;
  },
  // School Management CRUD
  getSchools: async (): Promise<SchoolInfo[]> => {
    await delay(300);
    return mockSchools;
  },
  addSchool: async (school: Omit<SchoolInfo, 'id' | 'status'>): Promise<SchoolInfo> => {
    await delay(300);
    const newSchool: SchoolInfo = {
      ...school,
      id: `SCH${String(mockSchools.length + 1).padStart(3, '0')}`,
      status: 'active'
    };
    mockSchools.push(newSchool);
    return newSchool;
  },
  
  uploadSchoolLogo: async (logoFile: File): Promise<string> => {
    await delay(300);
    // Convert file to data URL for mock storage
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(logoFile);
    });
    return dataUrl;
  },
  updateSchool: async (id: string, updates: Partial<SchoolInfo>): Promise<SchoolInfo | null> => {
    await delay(300);
    const idx = mockSchools.findIndex(s => s.id === id);
    if (idx === -1) return null;
    mockSchools[idx] = { ...mockSchools[idx], ...updates };
    return mockSchools[idx];
  },
  // School Info
  getSchoolInfo: async (): Promise<SchoolInfo> => {
    await delay(300);
    return schoolInfo;
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    await delay(500);
    return mockStudents;
  },

  getStudent: async (id: string): Promise<Student | null> => {
    await delay(300);
    return mockStudents.find(student => student.id === id) || null;
  },

  createStudent: async (student: Omit<Student, 'id'>): Promise<Student> => {
    await delay(500);
    const newStudent = {
      ...student,
      id: `STU${String(mockStudents.length + 1).padStart(3, '0')}`
    };
    mockStudents.push(newStudent);
    return newStudent;
  },

  updateStudent: async (id: string, updates: Partial<Student>): Promise<Student | null> => {
    await delay(500);
    const index = mockStudents.findIndex(student => student.id === id);
    if (index === -1) return null;
    
    mockStudents[index] = { ...mockStudents[index], ...updates };
    return mockStudents[index];
  },

  deleteStudent: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockStudents.findIndex(student => student.id === id);
    if (index === -1) return false;
    
    mockStudents.splice(index, 1);
    return true;
  },

  // Staff
  getStaff: async (): Promise<Staff[]> => {
    await delay(500);
    return mockStaff;
  },

  // Payroll APIs
  getStaffPayroll: async (staffId: string): Promise<StaffPayroll[]> => {
    await delay(300);
    return mockPayroll.filter(p => p.staffId === staffId);
  },
  addStaffPayroll: async (payroll: Omit<StaffPayroll, 'id'>): Promise<StaffPayroll> => {
    await delay(300);
    const newPayroll: StaffPayroll = { ...payroll, id: `PAY${mockPayroll.length + 1}` };
    mockPayroll.push(newPayroll);
    return newPayroll;
  },

  // Leave APIs
  getStaffLeaves: async (staffId: string): Promise<StaffLeave[]> => {
    await delay(300);
    return mockLeaves.filter(l => l.staffId === staffId);
  },
  addStaffLeave: async (leave: Omit<StaffLeave, 'id'>): Promise<StaffLeave> => {
    await delay(300);
    const newLeave: StaffLeave = { ...leave, id: `LEAVE${mockLeaves.length + 1}` };
    mockLeaves.push(newLeave);
    return newLeave;
  },

  // Performance APIs
  getStaffPerformance: async (staffId: string): Promise<StaffPerformance[]> => {
    await delay(300);
    return mockPerformance.filter(p => p.staffId === staffId);
  },
  addStaffPerformance: async (performance: Omit<StaffPerformance, 'id'>): Promise<StaffPerformance> => {
    await delay(300);
    const newPerf: StaffPerformance = { ...performance, id: `PERF${mockPerformance.length + 1}` };
    mockPerformance.push(newPerf);
    return newPerf;
  },

  getStaffMember: async (id: string): Promise<Staff | null> => {
    await delay(300);
    return mockStaff.find(staff => staff.id === id) || null;
  },

  createStaff: async (staff: Omit<Staff, 'id'>): Promise<Staff> => {
    await delay(500);
    const newStaff = {
      ...staff,
      id: `STAFF${String(mockStaff.length + 1).padStart(3, '0')}`
    };
    mockStaff.push(newStaff);
    persistStaff();
    return newStaff;
  },

  updateStaff: async (id: string, updates: Partial<Staff>): Promise<Staff | null> => {
    await delay(500);
    const index = mockStaff.findIndex(staff => staff.id === id);
    if (index === -1) return null;
    mockStaff[index] = { ...mockStaff[index], ...updates };
    persistStaff();
    return mockStaff[index];
  },

  deleteStaff: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockStaff.findIndex(staff => staff.id === id);
    if (index === -1) return false;
    mockStaff.splice(index, 1);
    persistStaff();
    return true;
  },

  // Attendance (New System)
  getAttendance: async (date?: string, classId?: string): Promise<AttendanceRecord[]> => {
    await delay(500);
    // Return new attendance format
    const mockRecord: AttendanceRecord = {
      id: `ATT${Date.now()}`,
      class_id: classId || "cls_10a",
      date: date || new Date().toISOString().split('T')[0],
      created_by: "STAFF002",
      source: "teacher",
      entries: mockStudents.map(student => ({
        student_id: student.id,
        status: Math.random() > 0.1 ? 'present' : Math.random() > 0.5 ? 'late' : 'absent',
        recorded_at: new Date().toISOString(),
        recorded_by: "STAFF002"
      }))
    };
    return [mockRecord];
  },

  saveAttendance: async (record: Omit<AttendanceRecord, 'id'>): Promise<boolean> => {
    await delay(800);
    console.log('Saving attendance record:', record);
    return true;
  },

  // Staff Attendance (Admin Central)
  getStaffAttendanceByDate: async (date: string): Promise<StaffAttendanceEntry[]> => {
    await delay(200);
    return mockStaffAttendance.filter(e => e.date === date);
  },
  markStaffAttendance: async ({ staffId, date, status, reason }: { staffId: string; date: string; status: StaffAttendanceStatus; reason?: string; }): Promise<boolean> => {
    await delay(200);
    const idx = mockStaffAttendance.findIndex(e => e.staffId === staffId && e.date === date);
    if (idx >= 0) {
      mockStaffAttendance[idx] = { ...mockStaffAttendance[idx], status, reason };
    } else {
      mockStaffAttendance.push({ staffId, date, status, reason });
    }
    persistStaffAttendance();
    return true;
  },
  getStaffAttendanceHistory: async (staffId: string): Promise<StaffAttendanceEntry[]> => {
    await delay(200);
    return mockStaffAttendance
      .filter(e => e.staffId === staffId)
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  },

  // Fees
  getFees: async (): Promise<FeeRecord[]> => {
    await delay(500);
    const academicYears = ['2023-24', '2024-25'];
    const mockFees: FeeRecord[] = mockStudents.flatMap((student, index) => academicYears.map(year => ({
      id: `FEE${String(index + 1).padStart(3, '0')}-${year}`,
      studentId: student.id,
      amount: 5000,
      dueDate: year === '2023-24' ? '2024-03-30' : '2025-03-30',
      status: Math.random() > 0.7 ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
      paymentDate: Math.random() > 0.5 ? (year === '2023-24' ? '2024-03-15' : '2025-03-15') : undefined,
      paymentMode: Math.random() > 0.5 ? 'online' : 'cash',
      academicYear: year
    })));
    return mockFees;
  },

  collectFee: async (feeId: string, paymentMode: string): Promise<boolean> => {
    await delay(500);
    return true;
  },

  // Transport APIs
  getTransports: async (): Promise<Transport[]> => {
    await delay(500);
    return mockTransports;
  },

  getTransport: async (id: string): Promise<Transport | null> => {
    await delay(300);
    return mockTransports.find(transport => transport.id === id) || null;
  },

  createTransport: async (transport: Omit<Transport, 'id'>): Promise<Transport> => {
    await delay(500);
    const newTransport = {
      ...transport,
      id: `BUS${String(mockTransports.length + 1).padStart(3, '0')}`
    };
    mockTransports.push(newTransport);
    return newTransport;
  },

  updateTransport: async (id: string, updates: Partial<Transport>): Promise<Transport | null> => {
    await delay(500);
    const index = mockTransports.findIndex(transport => transport.id === id);
    if (index === -1) return null;
    
    mockTransports[index] = { ...mockTransports[index], ...updates };
    return mockTransports[index];
  },

  deleteTransport: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockTransports.findIndex(transport => transport.id === id);
    if (index === -1) return false;
    
    mockTransports.splice(index, 1);
    return true;
  },

  // Library APIs
  getLibraryBooks: async (): Promise<LibraryBook[]> => {
    await delay(500);
    return mockLibraryBooks;
  },

  getLibraryBook: async (id: string): Promise<LibraryBook | null> => {
    await delay(300);
    return mockLibraryBooks.find(book => book.id === id) || null;
  },

  createLibraryBook: async (book: Omit<LibraryBook, 'id'>): Promise<LibraryBook> => {
    await delay(500);
    const newBook = {
      ...book,
      id: `LIB${String(mockLibraryBooks.length + 1).padStart(3, '0')}`
    };
    mockLibraryBooks.push(newBook);
    return newBook;
  },

  issueBook: async (bookId: string, studentId: string): Promise<BookIssue> => {
    await delay(500);
    const issue: BookIssue = {
      id: `ISS${Date.now()}`,
      bookId,
      studentId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'issued'
    };
    return issue;
  },

  returnBook: async (issueId: string): Promise<boolean> => {
    await delay(300);
    return true;
  },

  // Health APIs
  getHealthRecords: async (studentId?: string): Promise<HealthRecord[]> => {
    await delay(500);
    return studentId ? mockHealthRecords.filter(record => record.studentId === studentId) : mockHealthRecords;
  },

  createHealthRecord: async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
    await delay(500);
    const newRecord = {
      ...record,
      id: `HEALTH${String(mockHealthRecords.length + 1).padStart(3, '0')}`
    };
    mockHealthRecords.push(newRecord);
    return newRecord;
  },

  // Announcements APIs
  getAnnouncements: async (): Promise<Announcement[]> => {
    await delay(500);
    return mockAnnouncements;
  },

  createAnnouncement: async (announcement: Omit<Announcement, 'id'>): Promise<Announcement> => {
    await delay(500);
    const newAnnouncement = {
      ...announcement,
      id: `ANN${String(mockAnnouncements.length + 1).padStart(3, '0')}`
    };
    mockAnnouncements.push(newAnnouncement);
    return newAnnouncement;
  },

  updateAnnouncement: async (id: string, updates: Partial<Announcement>): Promise<Announcement | null> => {
    await delay(500);
    const index = mockAnnouncements.findIndex(announcement => announcement.id === id);
    if (index === -1) return null;
    
    mockAnnouncements[index] = { ...mockAnnouncements[index], ...updates };
    return mockAnnouncements[index];
  },

  deleteAnnouncement: async (id: string): Promise<boolean> => {
    await delay(300);
    const index = mockAnnouncements.findIndex(announcement => announcement.id === id);
    if (index === -1) return false;
    
    mockAnnouncements.splice(index, 1);
    return true;
  },

  // Examinations APIs
  getExams: async (): Promise<Exam[]> => {
    await delay(500);
    return mockExams;
  },

  createExam: async (exam: Omit<Exam, 'id'>): Promise<Exam> => {
    await delay(500);
    const newExam = {
      ...exam,
      id: `EXAM${String(mockExams.length + 1).padStart(3, '0')}`
    };
    mockExams.push(newExam);
    return newExam;
  },

  getExamResults: async (examId: string): Promise<ExamResult[]> => {
    await delay(500);
    const mockResults: ExamResult[] = mockStudents.map((student, index) => ({
      id: `RES${String(index + 1).padStart(3, '0')}`,
      examId,
      studentId: student.id,
      marksObtained: Math.floor(Math.random() * 40) + 60,
      grade: ['A+', 'A', 'B+', 'B'][Math.floor(Math.random() * 4)]
    }));
    return mockResults;
  },

  saveExamResults: async (results: Omit<ExamResult, 'id'>[]): Promise<boolean> => {
    await delay(800);
    return true;
  },

  // Timetable APIs
  getTimetable: async (classId?: string): Promise<TimetableSlot[]> => {
    await delay(500);
    return classId ? mockTimetable.filter(slot => slot.class === classId) : mockTimetable;
  },

  saveTimetable: async (slots: Omit<TimetableSlot, 'id'>[]): Promise<boolean> => {
    await delay(800);
    return true;
  },

  // Admissions APIs
  getAdmissions: async (): Promise<Admission[]> => {
    await delay(500);
    return mockAdmissions;
  },

  createAdmission: async (admission: Omit<Admission, 'id'>): Promise<Admission> => {
    await delay(500);
    const newAdmission = {
      ...admission,
      id: `ADM${String(mockAdmissions.length + 1).padStart(3, '0')}`
    };
    mockAdmissions.push(newAdmission);
    return newAdmission;
  },

  updateAdmissionStatus: async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
    await delay(500);
    const index = mockAdmissions.findIndex(admission => admission.id === id);
    if (index === -1) return false;
    
    mockAdmissions[index].status = status;
    return true;
  },

  // Communication APIs
  sendCommunication: async (communication: Omit<Communication, 'id' | 'sentAt' | 'status'>): Promise<Communication> => {
    await delay(1000);
    const newCommunication: Communication = {
      ...communication,
      id: `COMM${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    return newCommunication;
  },

  getCommunicationHistory: async (): Promise<Communication[]> => {
    await delay(500);
    const mockCommunications: Communication[] = [
      {
        id: "COMM001",
        type: "sms",
        recipient: "+1 (555) 987-6543",
        message: "Your child Alice Johnson was absent today.",
        sentAt: "2024-02-15T10:30:00Z",
        status: "delivered"
      }
    ];
    return mockCommunications;
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(400);
    return mockDashboardStats;
  },

  // Login API
  loginStaff: async (email: string, password: string): Promise<Staff | null> => {
    await delay(300);
    // Only allow login for active staff
    const staff = mockStaff.find(s => s.email === email && s.status === 'active');
    // You can add password check logic here if needed
    return staff || null;
  },

  // Photo upload APIs
  uploadStudentPhoto: async (studentId: string, photoFile: File): Promise<string> => {
    // Read the file as a data URL and persist to mock student record
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(photoFile);
    });
    const studentIndex = mockStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      mockStudents[studentIndex].photoUrl = dataUrl;
    }
    return dataUrl;
  },

  uploadStaffPhoto: async (staffId: string, photoFile: File): Promise<string> => {
    // Read the file as a data URL and persist to mock staff record
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(photoFile);
    });
    const staffIndex = mockStaff.findIndex(s => s.id === staffId);
    if (staffIndex !== -1) {
      mockStaff[staffIndex].photoUrl = dataUrl;
      persistStaff();
    }
    return dataUrl;
  },

  // Alumni APIs
  getAlumni: async (): Promise<any[]> => Promise.resolve([]),
  addAlumni: async (data: any): Promise<any> => Promise.resolve({...data, id: 'ALU001'}),
  getAlumniMeets: async (): Promise<any[]> => Promise.resolve([]),
  addAlumniMeet: async (data: any): Promise<any> => Promise.resolve({...data, id: 'MEET001'}),

  // Staff leave APIs  
  getStaffLeaveRequests: async (): Promise<any[]> => {
    await delay(300);
    return [
      {
        id: '1',
        staffId: 'STAFF001',
        startDate: '2024-01-20',
        endDate: '2024-01-20',
        days: 1,
        isHalfDay: false,
        reason: 'Medical appointment',
        status: 'pending',
        requestedAt: '2024-01-15T10:00:00Z'
      }
    ];
  },
  addStaffLeaveRequest: async (data: any): Promise<any> => {
    await delay(300);
    return {
      ...data, 
      id: `SLR${Date.now()}`,
      requestedAt: new Date().toISOString()
    };
  },

  // Teacher attendance API
  markStudentAttendanceByTeacher: async (classId: string, date: string, data: any[]): Promise<any> => 
    Promise.resolve({id: 'ATT001', class_id: classId, date, entries: data}),

  async getParentMessages(staffId: string): Promise<any[]> {
    await delay(300);
    return [
      {
        id: '1',
        staffId,
        studentId: 'student1',
        subject: 'Math Performance Update',
        message: 'Your child is doing exceptionally well in mathematics this semester.',
        priority: 'medium',
        status: 'sent',
        sentAt: '2024-01-15T10:30:00Z'
      }
    ];
  },

  async sendParentMessage(messageData: any): Promise<any> {
    await delay(300);
    return {
      id: Date.now().toString(),
      ...messageData
    };
  },

  // User Management APIs
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return mockUsers;
  },

  addUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await delay(300);
    const newUser: User = {
      ...user,
      id: `USR${String(mockUsers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    await delay(300);
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    mockUsers[idx] = { ...mockUsers[idx], ...updates };
    return mockUsers[idx];
  },

  deleteUser: async (id: string): Promise<boolean> => {
    await delay(300);
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx === -1) return false;
    mockUsers.splice(idx, 1);
    return true;
  },

};

// Export types for use in components
export type { 
  SchoolInfo, 
  Student, 
  Staff, 
  DashboardStats, 
  AttendanceRecord, 
  FeeRecord,
  Transport,
  LibraryBook,
  BookIssue,
  HealthRecord,
  Announcement,
  Exam,
  ExamResult,
  TimetableSlot,
  Admission,
  Communication,
  Syllabus,
  User
};
