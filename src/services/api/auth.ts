import { apiClient } from './client';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/frontend/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    // Cookies are automatically included in requests due to credentials: 'include'
    const response = await apiClient.get<User>('/api/v1/frontend/profile');
    return response.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>('/api/v1/frontend/auth/logout');
    return response.data;
  },
};