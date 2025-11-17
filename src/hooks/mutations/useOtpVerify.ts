import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';
import type { OtpVerifyRequest } from '@/types/auth';

export const useOtpVerify = () => {
  return useMutation({
    mutationFn: (data: OtpVerifyRequest) => authApi.verifyOtp(data),
    onError: (error) => {
      console.error('OTP verification failed:', error);
    },
  });
};

