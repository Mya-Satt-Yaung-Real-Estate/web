/**
 * Public Property Query Hooks
 * 
 * TanStack Query hooks for public property operations.
 */

import { useQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

/**
 * Get all public properties with filters
 */
export function usePublicProperties(filters?: PublicPropertyFilters) {
  return useQuery({
    queryKey: publicPropertyKeys.list(filters),
    queryFn: () => publicPropertyQueries.getPublicProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

