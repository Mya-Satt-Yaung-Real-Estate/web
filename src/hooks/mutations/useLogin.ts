import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';
import type { LoginRequest } from '@/types/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      // Success handled in component
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};
