/**
 * Auth API Endpoints
 * 
 * Authentication-related API operations.
 */

import { api } from './client';
import type { User } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// ============================================================================
// AUTH API FUNCTIONS
// ============================================================================

export const authApi = {
  /**
   * Get current user profile
   */
  getProfile: () => {
    return api.get<User>('/auth/profile');
  },

  /**
   * Login user
   */
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  register: (data: RegisterData) => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Logout user
   */
  logout: () => {
    return api.post<{ success: boolean }>('/auth/logout');
  },

  /**
   * Update user profile
   */
  updateProfile: (updates: Partial<User>) => {
    return api.put<User>('/auth/profile', updates);
  },

  /**
   * Change password
   */
  changePassword: (currentPassword: string, newPassword: string) => {
    return api.post<{ success: boolean }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};
