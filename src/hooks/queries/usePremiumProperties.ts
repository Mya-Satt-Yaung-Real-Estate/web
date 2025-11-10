/**
 * Premium Property Query Hooks
 * 
 * TanStack Query hooks for premium property operations.
 */

import { useQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

/**
 * Get premium properties with filters
 */
export function usePremiumProperties(filters?: Omit<PublicPropertyFilters, 'premium'>) {
  return useQuery({
    queryKey: publicPropertyKeys.premiumList(filters),
    queryFn: () => publicPropertyQueries.getPremiumProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

