import { rateLimiter } from './rateLimiter';

// ==================== TYPES ====================

export interface Admission {
  id: string;
  schoolId: string;
  studentName: string;
  guardianName: string;
  phone: string;
  email: string;
  appliedClass: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  previousSchool?: string;
  address: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionFilters {
  searchTerm?: string;
  status?: string;
  class?: string;
  applicationDateFrom?: string;
  applicationDateTo?: string;
}

export interface AdmissionPaginationParams {
  page: number;
  pageSize: number;
}

export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  previousCursor?: string;
  hasMore: boolean;
}

export interface AdmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  waitlisted: number;
}

// ==================== MOCK DATA GENERATOR ====================

class AdmissionService {
  private mockData: Map<string, Admission[]> = new Map();
  private schoolCaches: Map<string, { timestamp: number; data: any }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Generate mock data for different schools
    for (let schoolNum = 1; schoolNum <= 10; schoolNum++) {
      const schoolId = `SCHOOL${schoolNum.toString().padStart(3, '0')}`;
      const admissions = this.generateMockAdmissions(schoolId, 50);
      this.mockData.set(schoolId, admissions);
    }
  }

  private generateMockAdmissions(schoolId: string, count: number): Admission[] {
    const statuses: Admission['status'][] = ['pending', 'approved', 'rejected', 'waitlisted'];
    const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const firstNames = ['Ananya', 'Aarav', 'Priya', 'Arjun', 'Diya', 'Vivaan', 'Aisha', 'Reyansh', 'Sara', 'Kabir'];
    const lastNames = ['Sharma', 'Gupta', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Yadav', 'Joshi', 'Mehta', 'Nair'];

    return Array.from({ length: count }, (_, i) => {
      const id = `ADM${(i + 1).toString().padStart(6, '0')}`;
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const studentName = `${firstName} ${lastName}`;
      const guardianName = `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastName}`;
      const year = 2024;
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const applicationDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      return {
        id,
        schoolId,
        studentName,
        guardianName,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        appliedClass: classes[Math.floor(Math.random() * classes.length)],
        applicationDate,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        previousSchool: Math.random() > 0.3 ? `${lastNames[Math.floor(Math.random() * lastNames.length)]} School` : undefined,
        address: `${Math.floor(Math.random() * 999) + 1} Street, City ${Math.floor(Math.random() * 100)}`,
        dateOfBirth: `${2008 + Math.floor(Math.random() * 8)}-${(Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
        createdAt: applicationDate,
        updatedAt: applicationDate
      };
    });
  }

  // ==================== MAIN API METHODS ====================

  async getAdmissions(
    schoolId: string,
    filters?: AdmissionFilters,
    pagination?: AdmissionPaginationParams
  ): Promise<PaginatedResponse<Admission>> {
    // Rate limiting
    const rateLimitKey = `admissions:list:${schoolId}`;
    if (!rateLimiter.checkLimit(rateLimitKey, 100)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    let admissions = this.mockData.get(schoolId) || [];

    // Apply filters
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      admissions = admissions.filter(admission =>
        admission.studentName.toLowerCase().includes(term) ||
        admission.guardianName.toLowerCase().includes(term) ||
        admission.email.toLowerCase().includes(term) ||
        admission.id.toLowerCase().includes(term)
      );
    }

    if (filters?.status && filters.status !== 'all') {
      admissions = admissions.filter(admission => admission.status === filters.status);
    }

    if (filters?.class && filters.class !== 'all') {
      admissions = admissions.filter(admission => admission.appliedClass === filters.class);
    }

    if (filters?.applicationDateFrom) {
      admissions = admissions.filter(admission => admission.applicationDate >= filters.applicationDateFrom!);
    }

    if (filters?.applicationDateTo) {
      admissions = admissions.filter(admission => admission.applicationDate <= filters.applicationDateTo!);
    }

    const total = admissions.length;

    // Apply pagination
    if (pagination) {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      admissions = admissions.slice(start, end);
    }

    return {
      data: admissions,
      total,
      page: pagination?.page || 1,
      pageSize: pagination?.pageSize || total,
      totalPages: pagination ? Math.ceil(total / pagination.pageSize) : 1
    };
  }

  async getAdmissionsCursor(
    schoolId: string,
    filters?: AdmissionFilters,
    pagination?: CursorPaginationParams
  ): Promise<CursorPaginatedResponse<Admission>> {
    // Rate limiting
    const rateLimitKey = `admissions:cursor:${schoolId}`;
    if (!rateLimiter.checkLimit(rateLimitKey, 100)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    let admissions = this.mockData.get(schoolId) || [];

    // Apply filters (same as above)
    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      admissions = admissions.filter(admission =>
        admission.studentName.toLowerCase().includes(term) ||
        admission.guardianName.toLowerCase().includes(term) ||
        admission.email.toLowerCase().includes(term)
      );
    }

    if (filters?.status && filters.status !== 'all') {
      admissions = admissions.filter(admission => admission.status === filters.status);
    }

    if (filters?.class && filters.class !== 'all') {
      admissions = admissions.filter(admission => admission.appliedClass === filters.class);
    }

    // Cursor-based pagination
    const limit = pagination?.limit || 20;
    let startIndex = 0;

    if (pagination?.cursor) {
      const cursorIndex = admissions.findIndex(a => a.id === pagination.cursor);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const paginatedData = admissions.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < admissions.length;
    const nextCursor = hasMore ? paginatedData[paginatedData.length - 1]?.id : undefined;
    const previousCursor = startIndex > 0 ? admissions[startIndex - 1]?.id : undefined;

    return {
      data: paginatedData,
      nextCursor,
      previousCursor,
      hasMore
    };
  }

  async getAdmissionById(schoolId: string, admissionId: string): Promise<Admission | null> {
    const rateLimitKey = `admissions:get:${schoolId}`;
    if (!rateLimiter.checkLimit(rateLimitKey, 200)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    await new Promise(resolve => setTimeout(resolve, 50));

    const admissions = this.mockData.get(schoolId) || [];
    return admissions.find(a => a.id === admissionId) || null;
  }

  async addAdmission(schoolId: string, admission: Omit<Admission, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>): Promise<Admission> {
    const rateLimitKey = `admissions:add:${schoolId}`;
    if (!rateLimiter.checkLimit(rateLimitKey, 20)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    await new Promise(resolve => setTimeout(resolve, 150));

    const admissions = this.mockData.get(schoolId) || [];
    const newAdmission: Admission = {
      ...admission,
      id: `ADM${(admissions.length + 1).toString().padStart(6, '0')}`,
      schoolId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    admissions.push(newAdmission);
    this.mockData.set(schoolId, admissions);
    this.clearSchoolCache(schoolId);

    return newAdmission;
  }

  async updateAdmissionStatus(schoolId: string, admissionId: string, status: Admission['status']): Promise<Admission> {
    const rateLimitKey = `admissions:update:${schoolId}`;
    if (!rateLimiter.checkLimit(rateLimitKey, 50)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const admissions = this.mockData.get(schoolId) || [];
    const index = admissions.findIndex(a => a.id === admissionId);

    if (index === -1) {
      throw new Error('Admission not found');
    }

    admissions[index] = {
      ...admissions[index],
      status,
      updatedAt: new Date().toISOString()
    };

    this.mockData.set(schoolId, admissions);
    this.clearSchoolCache(schoolId);

    return admissions[index];
  }

  async deleteAdmission(schoolId: string, admissionId: string): Promise<void> {
    const rateLimitKey = `admissions:delete:${schoolId}`;
    if (!rateLimiter.checkLimit(rateLimitKey, 20)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const admissions = this.mockData.get(schoolId) || [];
    const filtered = admissions.filter(a => a.id !== admissionId);
    this.mockData.set(schoolId, filtered);
    this.clearSchoolCache(schoolId);
  }

  async getAdmissionStats(schoolId: string): Promise<AdmissionStats> {
    const cacheKey = `stats:${schoolId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    await new Promise(resolve => setTimeout(resolve, 50));

    const admissions = this.mockData.get(schoolId) || [];

    const stats: AdmissionStats = {
      total: admissions.length,
      pending: admissions.filter(a => a.status === 'pending').length,
      approved: admissions.filter(a => a.status === 'approved').length,
      rejected: admissions.filter(a => a.status === 'rejected').length,
      waitlisted: admissions.filter(a => a.status === 'waitlisted').length
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  // ==================== CACHE METHODS ====================

  private getFromCache(key: string): any {
    const cached = this.schoolCaches.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.schoolCaches.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any): void {
    this.schoolCaches.set(key, {
      timestamp: Date.now(),
      data
    });
  }

  clearSchoolCache(schoolId: string): void {
    const keysToDelete: string[] = [];
    this.schoolCaches.forEach((_, key) => {
      if (key.includes(schoolId)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.schoolCaches.delete(key));
  }
}

export const admissionService = new AdmissionService();
