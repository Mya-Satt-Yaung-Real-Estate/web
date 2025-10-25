/**
 * Auth Mutation Hooks
 * 
 * TanStack Query mutation hooks for authentication operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';
import { authKeys } from '@/services/queries/auth';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(), data.data.user);
      // Store token (you might want to use a different approach)
      localStorage.setItem('token', data.data.token);
    },
  });
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(), data.data.user);
      // Store token
      localStorage.setItem('token', data.data.token);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Remove token
      localStorage.removeItem('token');
    },
  });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      // Update profile in cache
      queryClient.setQueryData(authKeys.profile(), data.data);
    },
  });
}

/**
 * Change password mutation
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(currentPassword, newPassword),
  });
}