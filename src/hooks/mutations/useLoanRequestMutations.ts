/**
 * Loan Request Mutation Hooks
 * 
 * TanStack Query mutation hooks for loan request operations.
 */

import { useMutation } from '@tanstack/react-query';
import { loanRequestApi } from '@/services/api/loanRequest';
import type { CreateLoanRequestData } from '@/types/loanRequest';

/**
 * Create loan request mutation hook
 */
export const useCreateLoanRequest = () => {
  return useMutation({
    mutationFn: (data: CreateLoanRequestData) => loanRequestApi.createLoanRequest(data),
  });
};

