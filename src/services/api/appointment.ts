import { apiClient } from './client';
import type { 
  AppointmentResponse, 
  AppointmentListResponse,
  AppointmentFilters,
  AppointmentTimeSlotResponse,
  PropertyListingTypeResponse,
  CreateAppointmentData,
  UpdateAppointmentData
} from '@/types/appointment';

export const appointmentApi = {
  // Get user's appointments
  async getUserAppointments(filters?: AppointmentFilters): Promise<AppointmentListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get<AppointmentListResponse>(`/api/v1/frontend/appointments?${params.toString()}`);
    return response.data;
  },

  // Get single appointment
  async getAppointment(id: number): Promise<AppointmentResponse> {
    const response = await apiClient.get<AppointmentResponse>(`/api/v1/frontend/appointments/${id}`);
    return response.data;
  },

  // Create appointment
  async createAppointment(data: CreateAppointmentData): Promise<AppointmentResponse> {
    const response = await apiClient.post<AppointmentResponse>('/api/v1/frontend/appointments', data);
    return response.data;
  },

  // Update appointment
  async updateAppointment(id: number, data: UpdateAppointmentData): Promise<AppointmentResponse> {
    const response = await apiClient.put<AppointmentResponse>(`/api/v1/frontend/appointments/${id}`, data);
    return response.data;
  },

  // Get appointment time slots
  async getTimeSlots(): Promise<AppointmentTimeSlotResponse> {
    const response = await apiClient.get<AppointmentTimeSlotResponse>('/api/v1/frontend/appointment-time-slots');
    return response.data;
  },

  // Get property listing types
  async getPropertyListingTypes(): Promise<PropertyListingTypeResponse> {
    const response = await apiClient.get<PropertyListingTypeResponse>('/api/v1/frontend/property-listing-types');
    return response.data;
  },
};
