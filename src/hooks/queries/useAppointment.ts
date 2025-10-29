import { useQuery } from '@tanstack/react-query';
import { appointmentQueries } from '../../services/queries/appointment';
import type { AppointmentFilters } from '@/types/appointment';

export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery(appointmentQueries.getUserAppointments(filters));
}

export function useAppointment(id: number) {
  return useQuery(appointmentQueries.getAppointmentById(id));
}

export function useTimeSlots() {
  return useQuery(appointmentQueries.getTimeSlots());
}

export function usePropertyListingTypes() {
  return useQuery(appointmentQueries.getPropertyListingTypes());
}