/**
 * Appointment Query Keys and Functions
 * 
 * TanStack Query definitions for appointment operations.
 */

import { appointmentApi } from '../api/appointment';
import type { AppointmentFilters } from '@/types/appointment';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const appointmentKeys = {
  all: ['appointment'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
};

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const appointmentQueries = {
  /**
   * Get user's appointments with filters (authenticated)
   */
  getUserAppointments: (filters: AppointmentFilters = {}) => ({
    queryKey: appointmentKeys.list(filters),
    queryFn: () => appointmentApi.getUserAppointments(filters),
    placeholderData: (previousData: any) => previousData,
  }),

  /**
   * Get a single appointment by ID (authenticated)
   */
  getAppointmentById: (id: number) => ({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentApi.getAppointment(id),
    enabled: !!id,
  }),
};
