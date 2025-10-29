/**
 * Appointment Query Hooks
 * 
 * TanStack Query hooks for appointment operations.
 */

import { useQuery } from '@tanstack/react-query';
import { appointmentQueries } from '../../services/queries/appointment';
import type { AppointmentFilters } from '@/types/appointment';

// ============================================================================
// AUTHENTICATED USER APPOINTMENTS
// ============================================================================

/**
 * Get user's appointments with filters (authenticated)
 */
export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery(appointmentQueries.getUserAppointments(filters));
}

/**
 * Get a single appointment by ID (authenticated)
 */
export function useAppointment(id: number) {
  return useQuery(appointmentQueries.getAppointmentById(id));
}

// ============================================================================
// RE-EXPORT QUERY KEYS FOR EXTERNAL USE
// ============================================================================

export { appointmentKeys } from '../../services/queries/appointment';
