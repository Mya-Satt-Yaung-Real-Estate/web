/**
 * Companies Query Functions
 * 
 * TanStack Query functions for companies data.
 */

import { companiesApi } from '../api/companies';
import type { CompanyFilters } from '@/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const companiesKeys = {
  all: ['companies'] as const,
  lists: () => [...companiesKeys.all, 'list'] as const,
  list: (filters?: CompanyFilters) => [...companiesKeys.lists(), filters] as const,
  details: () => [...companiesKeys.all, 'detail'] as const,
  detail: (id: number) => [...companiesKeys.details(), id] as const,
  detailBySlug: (slug: string) => [...companiesKeys.details(), 'slug', slug] as const,
  properties: (slug: string) => [...companiesKeys.detailBySlug(slug), 'properties'] as const,
  propertiesList: (slug: string, params?: { per_page?: number; page?: number }) => 
    [...companiesKeys.properties(slug), params] as const,
  advertisements: (slug: string) => [...companiesKeys.detailBySlug(slug), 'advertisements'] as const,
  advertisementsList: (slug: string, params?: { per_page?: number; page?: number }) => 
    [...companiesKeys.advertisements(slug), params] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const companiesQueries = {
  /**
   * Get all companies
   */
  getCompanies: (filters?: CompanyFilters) => {
    return companiesApi.getCompanies(filters);
  },

  /**
   * Get company by ID
   */
  getCompany: (id: number) => {
    return companiesApi.getCompany(id);
  },

  /**
   * Get company by slug
   */
  getCompanyBySlug: (slug: string) => {
    return companiesApi.getCompanyBySlug(slug);
  },

  /**
   * Get company properties by slug
   */
  getCompanyProperties: (slug: string, params?: { per_page?: number; page?: number }) => {
    return companiesApi.getCompanyProperties(slug, params);
  },

  /**
   * Get company advertisements by slug
   */
  getCompanyAdvertisements: (slug: string, params?: { per_page?: number; page?: number }) => {
    return companiesApi.getCompanyAdvertisements(slug, params);
  },
};
