# Multi-Tenant Fee Module Implementation

## Overview
This document describes the multi-tenant architecture implemented for the fee module, designed to scale to 1,000 schools with 1,000 students each (1 million total records).

## Architecture Decisions

### 1. Multi-Tenancy Approach
- **School-based isolation**: Every API call requires `schoolId`
- **Data segregation**: Each school's data is cached separately
- **Row-level security ready**: Interfaces prepared for database RLS policies

### 2. Scalability Features Implemented

#### Phase 1: Multi-Tenancy (✅ COMPLETE)
- Added `schoolId` to all interfaces
- Updated `feeService` to filter by `schoolId`
- Updated all hooks to require `schoolId`
- Created school-isolated data caches

#### Phase 2: Pagination & Search (✅ COMPLETE)
- **Cursor-based pagination**: `getFeeRecordsCursor()` for better performance
- **Offset pagination**: Kept for backward compatibility
- **Optimized search**: Full-text search simulation with proper filtering
- **Bulk operations**: `bulkProcessPayments()` for batch processing

#### Phase 3: Background Jobs & Rate Limiting (✅ COMPLETE)
- **Job Queue System**: Mock implementation for long-running tasks
  - Send fee reminders
  - Generate reports
  - Bulk payment imports
- **Rate Limiter**: Per-school request throttling
  - 100 API requests per minute per school
  - 20 payment requests per minute per school

## Usage Examples

### Basic Fee Records Fetch (with SchoolContext)
```typescript
import { useSchool } from '@/contexts/SchoolContext';
import { useFeeRecords } from '@/hooks/useFeeRecords';

function FeeComponent() {
  const { schoolInfo } = useSchool();
  
  const { data, loading, error } = useFeeRecords({
    schoolId: schoolInfo?.id || '', // ✅ School ID from context
    filters: { status: 'pending' },
    pagination: { page: 1, pageSize: 20 }
  });

  return (
    // Your UI
  );
}
```

### Cursor-Based Pagination (Better for Large Datasets)
```typescript
import { useSchool } from '@/contexts/SchoolContext';
import { useFeeRecordsCursor } from '@/hooks/useFeeRecordsCursor';

function FeeListInfiniteScroll() {
  const { schoolInfo } = useSchool();
  
  const { data, hasMore, loadNext, loading } = useFeeRecordsCursor({
    schoolId: schoolInfo?.id || '',
    filters: { academicYear: '2023-24' },
    limit: 50
  });

  return (
    <div>
      {data.map(record => <FeeRow key={record.id} record={record} />)}
      {hasMore && <button onClick={loadNext}>Load More</button>}
    </div>
  );
}
```

### Process Payment with Multi-Tenancy
```typescript
import { useSchool } from '@/contexts/SchoolContext';
import { useFeePayment } from '@/hooks/useFeePayment';

function PaymentForm() {
  const { schoolInfo } = useSchool();
  const { processPayment, processing } = useFeePayment(schoolInfo?.id || '');

  const handlePay = async () => {
    const result = await processPayment('S001', 5000, 'online');
    
    if (result.success) {
      toast.success('Payment successful!');
    }
  };

  return <button onClick={handlePay} disabled={processing}>Pay</button>;
}
```

### Background Job Example
```typescript
import { useBackgroundJob } from '@/hooks/useBackgroundJob';
import { useSchool } from '@/contexts/SchoolContext';

function BulkReminderSender() {
  const { schoolInfo } = useSchool();
  const { createJob, job, isProcessing, progress } = useBackgroundJob();

  const sendReminders = async () => {
    await createJob('send-fee-reminders', {
      schoolId: schoolInfo?.id,
      studentIds: ['S001', 'S002', 'S003'],
      template: 'fee_overdue'
    });
  };

  return (
    <div>
      <button onClick={sendReminders} disabled={isProcessing}>
        Send Reminders
      </button>
      {isProcessing && <Progress value={progress} />}
      {job?.result && <p>{job.result.message}</p>}
    </div>
  );
}
```

### Rate Limiting Check (Automatic in Service)
```typescript
import { feeApiLimiter, checkRateLimit } from '@/services/rateLimiter';

// Rate limiting is automatically checked in service layer
// But you can manually check if needed:
try {
  await checkRateLimit(schoolId);
  // Proceed with API call
} catch (error) {
  console.error('Rate limit exceeded:', error.message);
}
```

## Database Migration Strategy

When moving from mock data to real database (Supabase/PostgreSQL):

### 1. Update `feeService.ts`
Replace mock implementations with Supabase queries:

```typescript
// OLD (Mock)
async getFeeRecords(schoolId: string, filters?: FeeFilters) {
  let filtered = getSchoolFeeRecords(schoolId);
  // ... filtering logic
}

// NEW (Supabase)
async getFeeRecords(schoolId: string, filters?: FeeFilters) {
  let query = supabase
    .from('fee_records')
    .select('*')
    .eq('school_id', schoolId); // RLS will also enforce this

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.searchTerm) {
    query = query.textSearch('student_name', filters.searchTerm);
  }

  const { data, error } = await query.range(start, end);
  return { data, ... };
}
```

### 2. Required Database Schema
```sql
CREATE TABLE fee_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  student_id UUID NOT NULL REFERENCES students(id),
  student_name VARCHAR(255) NOT NULL,
  class VARCHAR(50),
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  pending_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('paid', 'pending', 'overdue', 'partial')),
  due_date DATE,
  academic_year VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical indexes for performance
CREATE INDEX idx_fees_school_id ON fee_records(school_id);
CREATE INDEX idx_fees_school_student ON fee_records(school_id, student_id);
CREATE INDEX idx_fees_school_status ON fee_records(school_id, status);
CREATE INDEX idx_fees_school_year ON fee_records(school_id, academic_year);
CREATE INDEX idx_fees_due_date ON fee_records(due_date) WHERE status != 'paid';

-- Full-text search index
CREATE INDEX idx_fees_student_search 
  ON fee_records 
  USING gin(to_tsvector('english', student_name));

-- Row Level Security (RLS)
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schools can only access their own fee records"
  ON fee_records
  FOR ALL
  USING (school_id = (auth.jwt() ->> 'school_id')::uuid);
```

### 3. Enable React Query for Caching
```bash
# Already installed
npm install @tanstack/react-query
```

Update hooks to use React Query:
```typescript
import { useQuery } from '@tanstack/react-query';

export function useFeeRecords({ schoolId, filters, pagination }) {
  return useQuery({
    queryKey: ['fees', schoolId, filters, pagination],
    queryFn: () => feeService.getFeeRecords(schoolId, filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000 // 30 minutes
  });
}
```

## Performance Benchmarks

### Current Mock Implementation
- **Query time**: ~100ms (simulated)
- **Memory usage**: Minimal (small mock dataset)
- **Concurrent requests**: Unlimited (no real backend)

### Expected Production Performance (with database)
- **Query time**: <200ms (with proper indexes)
- **Cursor pagination**: <100ms (even at page 10,000)
- **Full-text search**: <150ms (with GIN index)
- **Concurrent users**: 1,000+ schools simultaneously
- **Data capacity**: 10M+ records

## Testing Multi-Tenancy

### Test Data Isolation
```typescript
// Generate test data for multiple schools
const school1 = 'school-001';
const school2 = 'school-002';

// Fetch school 1 records
const records1 = await feeService.getFeeRecords(school1);
console.log('School 1 records:', records1.data.length);

// Fetch school 2 records
const records2 = await feeService.getFeeRecords(school2);
console.log('School 2 records:', records2.data.length);

// Verify isolation: no overlap in student IDs
const ids1 = new Set(records1.data.map(r => r.studentId));
const ids2 = new Set(records2.data.map(r => r.studentId));
const overlap = [...ids1].filter(id => ids2.has(id));
console.log('Data leak check:', overlap.length === 0 ? 'PASS' : 'FAIL');
```

## Migration Checklist

- [x] Add `schoolId` to all interfaces
- [x] Update service layer with multi-tenancy
- [x] Update all hooks to use `schoolId`
- [x] Implement cursor-based pagination
- [x] Add rate limiting
- [x] Create background job queue
- [x] Document migration strategy
- [ ] Setup Supabase database schema
- [ ] Implement RLS policies
- [ ] Add database indexes
- [ ] Integrate React Query
- [ ] Add virtual scrolling for large lists
- [ ] Setup monitoring & analytics

## Next Steps

1. **Setup Supabase Database** (High Priority)
   - Create tables with proper schema
   - Implement RLS policies
   - Add performance indexes

2. **Replace Mock Service** (High Priority)
   - Update `feeService.ts` with Supabase queries
   - Test data isolation between schools
   - Verify query performance

3. **Add React Query** (High Priority)
   - Wrap hooks with React Query
   - Configure cache strategies
   - Add optimistic updates

4. **Performance Testing** (Medium Priority)
   - Load test with 1,000 concurrent schools
   - Verify query times stay under 200ms
   - Test cursor pagination with large datasets

5. **Production Monitoring** (Medium Priority)
   - Setup Sentry for error tracking
   - Add performance monitoring
   - Create alerting for slow queries

## Support

For questions or issues:
1. Review `src/components/fees/README.md` for architecture details
2. Check `SCALABILITY_ANALYSIS.md` for performance considerations
3. Refer to Supabase documentation for RLS and indexing best practices
