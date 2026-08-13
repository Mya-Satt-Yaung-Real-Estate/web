/**
 * Companies API Endpoints
 * 
 * Company-related API operations.
 */

import { api } from './client';
import type { CompaniesResponse, CompanyDetailResponse, CompanyFilters } from '@/types';
import type { PropertyListResponse } from '@/types/properties';
import type { AdvertisementListResponse } from '@/types/advertisement';
import type { WantedListResponse } from '@/types/wantedList';
import type { ActivityListResponse } from '@/types/activity';

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

  /**
   * Get company advertisements by slug
   */
  getCompanyAdvertisements: (slug: string, params?: { per_page?: number; page?: number }) => {
    return api.get<AdvertisementListResponse>(`/api/v1/frontend/companies/${slug}/advertisements`, {
      params,
    });
  },

  /**
   * Get company wanted lists by slug
   */
  getCompanyWantedLists: (slug: string, params?: { per_page?: number; page?: number }) => {
    return api.get<WantedListResponse>(`/api/v1/frontend/companies/${slug}/wanted-lists`, {
      params,
    });
  },

  /**
   * Get company activities by slug
   */
  getCompanyActivities: (slug: string, params?: { per_page?: number; page?: number; search?: string }) => {
    return api.get<ActivityListResponse>(`/api/v1/frontend/companies/${slug}/activities`, {
      params,
    });
  },
};
