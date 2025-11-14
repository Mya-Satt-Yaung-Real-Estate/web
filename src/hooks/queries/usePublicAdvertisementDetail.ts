/**
 * Public Advertisement Detail Query Hook
 * 
 * TanStack Query hook for fetching a single public advertisement detail.
 */

import { useQuery } from '@tanstack/react-query';
import { publicAdvertisementKeys, publicAdvertisementQueries } from '@/services/queries/publicAdvertisements';

/**
 * Get a single public advertisement detail by ID
 */
export function usePublicAdvertisementDetail(id: string | number) {
  return useQuery({
    queryKey: publicAdvertisementKeys.detail(id),
    queryFn: () => publicAdvertisementQueries.getPublicAdvertisementDetail(id),
    enabled: !!id,
    staleTime: 0, // Always refetch on mount to get fresh data
    refetchOnMount: 'always',
  });
}

