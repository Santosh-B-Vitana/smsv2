import apiClient from './apiClient';

// ========== TYPE DEFINITIONS ==========

export interface FeeStructureBasic {
  id: string;
  name: string;
  class: string;
  academicYear: string;
  totalAmount: number;
  installmentCount: number;
  status: string;
}

export interface FeeStructure {
  id: string;
  schoolId: string;
  name: string;
  class: string;
  academicYear: string;
  tuitionFee: number;
  admissionFee: number;
  examFee: number;
  libraryFee: number;
  labFee: number;
  sportsFee: number;
  transportFee: number;
  hostelFee: number;
  uniformFee: number;
  booksFee: number;
  developmentFee: number;
  miscellaneous: number;
  totalAmount: number;
  installmentCount: number;
  installmentAmounts?: string;
  installmentDueDates?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeeStructureDto {
  schoolId: string;
  name: string;
  class: string;
  academicYear: string;
  tuitionFee?: number;
  admissionFee?: number;
  examFee?: number;
  libraryFee?: number;
  labFee?: number;
  sportsFee?: number;
  transportFee?: number;
  hostelFee?: number;
  uniformFee?: number;
  booksFee?: number;
  developmentFee?: number;
  miscellaneous?: number;
  installmentCount?: number;
  installmentAmounts?: string;
  installmentDueDates?: string;
  description?: string;
}

export interface FeeRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  class: string;
  feeStructureId?: string;
  feeStructureName?: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  lateFeeAmount: number;
  pendingAmount: number;
  lastPaymentDate?: string;
  academicYear: string;
  status: string;
  payments: PaymentTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeeRecordDto {
  schoolId: string;
  studentId: string;
  feeStructureId?: string;
  dueDate: string;
  totalAmount: number;
  paidAmount?: number;
  discountAmount?: number;
  lateFeeAmount?: number;
  academicYear: string;
  status?: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: string;
  receiptNumber?: string;
  gatewayRef?: string;
  gatewayOrderId?: string;
  chequeNumber?: string;
  chequeDate?: string;
  bankName?: string;
  processedBy?: string;
  remarks?: string;
  createdAt: string;
}

export interface CreatePaymentDto {
  schoolId: string;
  studentId: string;
  feeRecordId: string;
  amount: number;
  method: string;
  date: string;
  receiptNumber?: string;
  chequeNumber?: string;
  chequeDate?: string;
  bankName?: string;
  processedBy?: string;
  remarks?: string;
}

export interface LateFeeConfig {
  id: string;
  schoolId: string;
  amount: number;
  frequency: string;
  maxAmount?: number;
  gracePeriodDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLateFeeConfigDto {
  schoolId: string;
  amount: number;
  frequency: string;
  maxAmount?: number;
  gracePeriodDays: number;
  isActive: boolean;
}

export interface PaymentGatewayResponse {
  orderId: string;
  gateway: string;
  amount: number;
  currency: string;
  gatewayKey?: string;
  checkoutUrl?: string;
  metadata: Record<string, string>;
}

export interface InitiatePaymentDto {
  amount: number;
  gateway: string;
  currency: string;
}

export interface VerifyPaymentDto {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

export interface RefundResponse {
  refundId: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: string;
  gatewayRefundId?: string;
  processedAt?: string;
  createdAt: string;
}

export interface CreateRefundDto {
  amount: number;
  reason: string;
}

export interface ReminderResult {
  totalSent: number;
  emailsSent: number;
  smsSent: number;
  notificationsSent: number;
  errors: string[];
}

export interface SendRemindersDto {
  class?: string;
  section?: string;
  minOverdueDays?: number;
  channels: string[];
}

export interface FeeStats {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  totalDiscount: number;
  totalLateFee: number;
  collectionRate: number;
  monthlyCollection: Record<string, number>;
  classwiseCollection: Record<string, number>;
}

export interface PaginatedResponse<T> {
  feeRecords?: T[];
  items?: T[];
  total?: number;
  totalCount?: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

// ========== API FUNCTIONS ==========

const BASE_PATH = '/fees';

/**
 * Get all fee structures with optional class filter
 */
export const getFeeStructures = async (classFilter?: string): Promise<FeeStructure[]> => {
  const params = classFilter ? `?class=${classFilter}` : '';
  const response = await apiClient.get(`${BASE_PATH}/structures${params}`);
  return response.data;
};

/**
 * Get fee structure by ID
 */
export const getFeeStructureById = async (structureId: string): Promise<FeeStructure> => {
  const response = await apiClient.get(`${BASE_PATH}/structures/${structureId}`);
  return response.data;
};

/**
 * Create a new fee structure
 */
export const createFeeStructure = async (data: CreateFeeStructureDto): Promise<FeeStructure> => {
  const response = await apiClient.post(`${BASE_PATH}/structures`, data);
  return response.data;
};

/**
 * Update an existing fee structure
 */
export const updateFeeStructure = async (
  structureId: string,
  data: Partial<CreateFeeStructureDto>
): Promise<FeeStructure> => {
  const response = await apiClient.put(`${BASE_PATH}/structures/${structureId}`, data);
  return response.data;
};

/**
 * Delete a fee structure
 */
export const deleteFeeStructure = async (structureId: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/structures/${structureId}`);
};

/**
 * Get paginated fee records with filters
 */
export const getFeeRecords = async (
  page: number = 1,
  pageSize: number = 10,
  studentId?: string,
  status?: string
): Promise<PaginatedResponse<FeeRecord>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (studentId) params.append('studentId', studentId);
  if (status) params.append('status', status);

  const response = await apiClient.get(`${BASE_PATH}/records?${params.toString()}`);
  return response.data;
};

/**
 * Get fee record by ID
 */
export const getFeeRecordById = async (recordId: string): Promise<FeeRecord> => {
  const response = await apiClient.get(`${BASE_PATH}/records/${recordId}`);
  return response.data;
};

/**
 * Create a new fee record
 */
export const createFeeRecord = async (data: CreateFeeRecordDto): Promise<FeeRecord> => {
  const response = await apiClient.post(`${BASE_PATH}/records`, data);
  return response.data;
};

/**
 * Update an existing fee record
 */
export const updateFeeRecord = async (
  recordId: string,
  data: Partial<CreateFeeRecordDto>
): Promise<FeeRecord> => {
  const response = await apiClient.put(`${BASE_PATH}/records/${recordId}`, data);
  return response.data;
};

/**
 * Delete a fee record
 */
export const deleteFeeRecord = async (recordId: string): Promise<void> => {
  await apiClient.delete(`${BASE_PATH}/records/${recordId}`);
};

/**
 * Create a payment transaction
 */
export const createPayment = async (data: CreatePaymentDto): Promise<PaymentTransaction> => {
  const response = await apiClient.post(`${BASE_PATH}/payments`, data);
  return response.data;
};

/**
 * Get late fee configuration
 */
export const getLateFeeConfig = async (): Promise<LateFeeConfig> => {
  const response = await apiClient.get(`${BASE_PATH}/late-fee/config`);
  return response.data;
};

/**
 * Create or update late fee configuration
 */
export const createOrUpdateLateFeeConfig = async (
  data: CreateLateFeeConfigDto
): Promise<LateFeeConfig> => {
  const response = await apiClient.post(`${BASE_PATH}/late-fee/config`, data);
  return response.data;
};

/**
 * Calculate late fee for a specific fee record
 */
export const calculateLateFee = async (feeRecordId: string): Promise<number> => {
  const response = await apiClient.get(`${BASE_PATH}/late-fee/calculate/${feeRecordId}`);
  return response.data;
};

/**
 * Initiate payment gateway transaction
 */
export const initiatePayment = async (
  feeRecordId: string,
  data: InitiatePaymentDto
): Promise<PaymentGatewayResponse> => {
  const response = await apiClient.post(
    `${BASE_PATH}/payment-gateway/initiate/${feeRecordId}`,
    data
  );
  return response.data;
};

/**
 * Verify payment gateway transaction
 */
export const verifyPayment = async (
  transactionId: string,
  data: VerifyPaymentDto
): Promise<boolean> => {
  const response = await apiClient.post(
    `${BASE_PATH}/payment-gateway/verify/${transactionId}`,
    data
  );
  return response.data;
};

/**
 * Generate receipt PDF
 */
export const generateReceipt = async (transactionId: string): Promise<Blob> => {
  const response = await apiClient.get(`${BASE_PATH}/receipts/${transactionId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Send receipt via email
 */
export const sendReceiptEmail = async (transactionId: string, email: string): Promise<string> => {
  const response = await apiClient.post(`${BASE_PATH}/receipts/${transactionId}/send`, {
    email,
  });
  return response.data;
};

/**
 * Send fee reminders
 */
export const sendFeeReminders = async (data: SendRemindersDto): Promise<ReminderResult> => {
  const response = await apiClient.post(`${BASE_PATH}/reminders/send`, data);
  return response.data;
};

/**
 * Get overdue fee records
 */
export const getOverdueFees = async (): Promise<FeeRecord[]> => {
  const response = await apiClient.get(`${BASE_PATH}/overdue`);
  return response.data;
};

/**
 * Get fee statistics
 */
export const getFeeStats = async (academicYear?: string): Promise<FeeStats> => {
  const params = academicYear ? `?academicYear=${academicYear}` : '';
  const response = await apiClient.get(`${BASE_PATH}/stats${params}`);
  return response.data;
};

/**
 * Process refund for a transaction
 */
export const processRefund = async (
  transactionId: string,
  data: CreateRefundDto
): Promise<RefundResponse> => {
  const response = await apiClient.post(`${BASE_PATH}/refunds/${transactionId}`, data);
  return response.data;
};

/**
 * Get refund status
 */
export const getRefundStatus = async (refundId: string): Promise<RefundResponse> => {
  const response = await apiClient.get(`${BASE_PATH}/refunds/${refundId}`);
  return response.data;
};

// Export all functions as a single object for convenience
export const feeApi = {
  getFeeStructures,
  getFeeStructureById,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
  getFeeRecords,
  getFeeRecordById,
  createFeeRecord,
  updateFeeRecord,
  deleteFeeRecord,
  createPayment,
  getLateFeeConfig,
  createOrUpdateLateFeeConfig,
  calculateLateFee,
  initiatePayment,
  verifyPayment,
  generateReceipt,
  sendReceiptEmail,
  sendFeeReminders,
  getOverdueFees,
  getFeeStats,
  processRefund,
  getRefundStatus,
};

export default feeApi;
