import { apiClient } from './client';
import type { 
  AppointmentResponse, 
  AppointmentListResponse,
  AppointmentFilters
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
};
