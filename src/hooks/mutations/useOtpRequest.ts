import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';
import type { OtpRequestRequest } from '@/types/auth';

export const useOtpRequest = () => {
  return useMutation({
    mutationFn: (data: OtpRequestRequest) => authApi.requestOtp(data),
    onError: (error) => {
      console.error('OTP request failed:', error);
    },
  });
};

