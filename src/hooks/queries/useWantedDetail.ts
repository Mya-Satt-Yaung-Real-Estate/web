/**
 * Wanted Detail Query Hook
 * 
 * TanStack Query hook for fetching a single wanted list detail.
 */

import { useQuery } from '@tanstack/react-query';
import { wantedListKeys, wantedListQueries } from '@/services/queries/wantedList';

/**
 * Get a single wanted list detail by slug
 */
export function useWantedDetail(slug: string) {
  return useQuery({
    queryKey: wantedListKeys.detail(slug),
    queryFn: () => wantedListQueries.getPublicWantedDetail(slug),
    enabled: !!slug,
    staleTime: 0, // Always refetch on mount to get fresh data
    refetchOnMount: 'always',
  });
}

