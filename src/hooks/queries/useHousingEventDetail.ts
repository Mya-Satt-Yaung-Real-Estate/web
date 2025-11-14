/**
 * Housing Event Detail Query Hook
 * 
 * TanStack Query hook for fetching a single housing event detail.
 */

import { useQuery } from '@tanstack/react-query';
import { housingEventKeys, housingEventQueries } from '@/services/queries/housingEvents';

/**
 * Get a single housing event detail by slug
 */
export function useHousingEventDetail(slug: string) {
  return useQuery({
    queryKey: housingEventKeys.detail(slug),
    queryFn: () => housingEventQueries.getHousingEventDetail(slug),
    enabled: !!slug,
    staleTime: 0, // Always refetch on mount to get fresh data
    refetchOnMount: 'always',
  });
}

