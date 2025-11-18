import { apiClient } from './client';
import type { LoginRequest, LoginResponse, ExtendedUser, OtpRequestRequest, OtpRequestResponse, OtpVerifyRequest, OtpVerifyResponse, RegisterIndividualRequest, RegisterCompanyRequest, RegisterResponse } from '@/types/auth';

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

  async requestOtp(data: OtpRequestRequest): Promise<OtpRequestResponse> {
    const response = await apiClient.post<OtpRequestResponse>('/api/v2/frontend/otp/request', data);
    return response.data;
  },

  async verifyOtp(data: OtpVerifyRequest): Promise<OtpVerifyResponse> {
    const response = await apiClient.post<OtpVerifyResponse>('/api/v2/frontend/otp/verify', data);
    return response.data;
  },

  async registerIndividual(data: RegisterIndividualRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/v2/frontend/auth/register/individual', data);
    return response.data;
  },

  async registerCompany(data: RegisterCompanyRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/v2/frontend/auth/register/company', data);
    return response.data;
  },
};