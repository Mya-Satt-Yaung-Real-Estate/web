import { apiClient } from './client';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/frontend/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.get<User>('/api/v1/frontend/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },
};