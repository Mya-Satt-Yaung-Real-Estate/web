/**
 * Company Types Query Hooks
 *
 * TanStack Query hooks for company type-related data.
 */

import { useQuery } from '@tanstack/react-query';
import { companyTypeKeys, companyTypeQueries } from '@/services/queries/companyTypes';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch all company types.
 */
export function useCompanyTypes() {
  return useQuery({
    queryKey: companyTypeKeys.list(),
    queryFn: () => companyTypeQueries.getCompanyTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes (company types don't change often)
  });
}
