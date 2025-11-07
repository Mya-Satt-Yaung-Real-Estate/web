import { apiClient } from './client';
import type { LoginRequest, LoginResponse, ExtendedUser } from '@/types/auth';

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/frontend/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<ExtendedUser> {
    // Cookies are automatically included in requests due to credentials: 'include'
    const response = await apiClient.get<ExtendedUser>('/api/v1/frontend/profile');
    return response.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/api/v1/frontend/auth/logout');
    return response.data;
  },

  async changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/api/v1/frontend/auth/change-password', data);
    return response.data;
  },

  async updateProfile(data: {
    name: string;
    email: string;
    phone: string;
    media_id?: number;
    company_name?: string;
    company_type_id?: number;
    address?: string;
    region_id?: number;
    township_id?: number;
    description?: string;
  }): Promise<{ success: boolean; message: string; data: ExtendedUser }> {
    const response = await apiClient.put<{ success: boolean; message: string; data: ExtendedUser }>('/api/v1/frontend/profile', data);
    return response.data;
  },
};