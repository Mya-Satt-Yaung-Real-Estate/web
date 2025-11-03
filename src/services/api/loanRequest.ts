/**
 * Loan Request API Endpoints
 * 
 * Loan request-related API operations.
 */

import { apiClient } from './client';
import type { CreateLoanRequestData, LoanRequestResponse } from '@/types/loanRequest';

export const loanRequestApi = {
  /**
   * Create loan request
   */
  async createLoanRequest(data: CreateLoanRequestData): Promise<LoanRequestResponse> {
    const response = await apiClient.post<LoanRequestResponse>('/api/v1/frontend/loan-requests', data);
    return response.data;
  },
};

