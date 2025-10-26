/**
 * Companies API Endpoints
 * 
 * Company-related API operations.
 */

import { api } from './client';
import type { CompaniesResponse, CompanyFilters } from '@/types';

// ============================================================================
// COMPANIES API FUNCTIONS
// ============================================================================

export const companiesApi = {
  /**
   * Get all companies
   */
  getCompanies: (filters?: CompanyFilters) => {
    return api.get<CompaniesResponse>('/api/v1/frontend/companies', {
      params: filters,
    });
  },

  /**
   * Get company by ID
   */
  getCompany: (id: number) => {
    return api.get<CompaniesResponse>(`/api/v1/frontend/companies/${id}`);
  },

  /**
   * Get company by slug
   */
  getCompanyBySlug: (slug: string) => {
    return api.get<CompaniesResponse>(`/api/v1/frontend/companies/slug/${slug}`);
  },
};
