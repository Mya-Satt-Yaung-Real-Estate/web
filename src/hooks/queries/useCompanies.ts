/**
 * Companies Query Hooks
 * 
 * TanStack Query hooks for companies data.
 */

import { useQuery } from '@tanstack/react-query';
import { companiesKeys, companiesQueries } from '@/services/queries/companies';
import type { CompanyFilters } from '@/types';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get all companies with optional filters
 */
export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: companiesKeys.list(filters),
    queryFn: () => companiesQueries.getCompanies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get company by ID
 */
export function useCompany(id: number) {
  return useQuery({
    queryKey: companiesKeys.detail(id),
    queryFn: () => companiesQueries.getCompany(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get company by slug
 */
export function useCompanyBySlug(slug: string) {
  return useQuery({
    queryKey: companiesKeys.detailBySlug(slug),
    queryFn: () => companiesQueries.getCompanyBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
