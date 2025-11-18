import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';
import type { RegisterIndividualRequest, RegisterCompanyRequest } from '@/types/auth';

export const useRegisterIndividual = () => {
  return useMutation({
    mutationFn: (data: RegisterIndividualRequest) => authApi.registerIndividual(data),
    onError: (error) => {
      console.error('Individual registration failed:', error);
    },
  });
};

export const useRegisterCompany = () => {
  return useMutation({
    mutationFn: (data: RegisterCompanyRequest) => authApi.registerCompany(data),
    onError: (error) => {
      console.error('Company registration failed:', error);
    },
  });
};


