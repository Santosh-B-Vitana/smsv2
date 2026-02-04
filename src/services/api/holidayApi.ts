import apiClient from './apiClient';

// ========== TYPE DEFINITIONS ==========

export interface HolidayBasic {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  type: string;
  academicYear: string;
}

export interface HolidayFull {
  id: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate?: string;
  type: string;
  description?: string;
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHolidayDto {
  schoolId: string;
  name: string;
  startDate: string;
  endDate?: string;
  type: string;
  description?: string;
  academicYear: string;
}

export interface UpdateHolidayDto {
  name?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  description?: string;
  isActive?: boolean;
}

export interface HolidayFilters {
  type?: string;
  academicYear?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ========== API FUNCTIONS ==========

const BASE_PATH = '/holidays';

/**
 * Get paginated list of holidays with filters
 */
export const getHolidays = async (
  filters?: HolidayFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<HolidayBasic>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const response = await apiClient.get(`${BASE_PATH}?${params.toString()}`);
  return response.data;
};

/**
 * Get holiday by ID
 */
export const getHolidayById = async (holidayId: string): Promise<HolidayFull> => {
  const response = await apiClient.get(`${BASE_PATH}/${holidayId}`);
  return response.data;
};

/**
 * Create a new holiday
 */
export const createHoliday = async (data: CreateHolidayDto): Promise<HolidayFull> => {
  const response = await apiClient.post(BASE_PATH, data);
  return response.data;
};

/**
 * Update an existing holiday
 */
export const updateHoliday = async (
  holidayId: string,
  data: UpdateHolidayDto
): Promise<HolidayFull> => {
  const response = await apiClient.put(`${BASE_PATH}/${holidayId}`, data);
  return response.data;
};

/**
 * Delete a holiday
 */
export const deleteHoliday = async (holidayId: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/${holidayId}`);
};

/**
 * Get upcoming holidays (next 30 days by default)
 */
export const getUpcomingHolidays = async (days: number = 30): Promise<HolidayBasic[]> => {
  const response = await apiClient.get(`${BASE_PATH}/upcoming?days=${days}`);
  return response.data;
};

// Export all functions as a single object for convenience
export const holidayApi = {
  getHolidays,
  getHolidayById,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getUpcomingHolidays,
};

export default holidayApi;
