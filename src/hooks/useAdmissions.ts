import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionService, Admission, AdmissionFilters, AdmissionPaginationParams } from '@/services/admissionService';

interface UseAdmissionsOptions {
  schoolId: string;
  filters?: AdmissionFilters;
  pagination?: AdmissionPaginationParams;
  autoFetch?: boolean;
}

export function useAdmissions(options: UseAdmissionsOptions) {
  const { schoolId, filters, pagination, autoFetch = true } = options;
  const queryClient = useQueryClient();

  const queryKey = ['admissions', schoolId, filters, pagination];

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: () => admissionService.getAdmissions(schoolId, filters, pagination),
    enabled: autoFetch,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000 // 5 minutes (formerly cacheTime)
  });

  const addMutation = useMutation({
    mutationFn: (admission: Omit<Admission, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>) =>
      admissionService.addAdmission(schoolId, admission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions', schoolId] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ admissionId, status }: { admissionId: string; status: Admission['status'] }) =>
      admissionService.updateAdmissionStatus(schoolId, admissionId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions', schoolId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (admissionId: string) => admissionService.deleteAdmission(schoolId, admissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions', schoolId] });
    }
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || 20,
    totalPages: data?.totalPages || 1,
    isLoading,
    error: error instanceof Error ? error.message : null,
    addAdmission: addMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteAdmission: deleteMutation.mutateAsync,
    refetch
  };
}

export function useAdmissionStats(schoolId: string) {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['admission-stats', schoolId],
    queryFn: () => admissionService.getAdmissionStats(schoolId),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  return {
    stats: data || null,
    isLoading,
    error: error instanceof Error ? error.message : null
  };
}
