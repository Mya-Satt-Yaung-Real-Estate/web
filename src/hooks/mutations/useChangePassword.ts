import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onError: (error) => {
      console.error('Change password failed:', error);
    },
  });
};

