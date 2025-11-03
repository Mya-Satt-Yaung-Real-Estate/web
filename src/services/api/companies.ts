/**
 * Companies API Endpoints
 * 
 * Company-related API operations.
 */

import { api } from './client';
import type { CompaniesResponse, CompanyDetailResponse, CompanyFilters } from '@/types';
import type { PropertyListResponse } from '@/types/properties';

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
    return api.get<CompanyDetailResponse>(`/api/v1/frontend/companies/${slug}`);
  },

  /**
   * Get company properties by slug
   */
  getCompanyProperties: (slug: string, params?: { per_page?: number; page?: number }) => {
    return api.get<PropertyListResponse>(`/api/v1/frontend/companies/${slug}/properties`, {
      params,
    });
  },
};
