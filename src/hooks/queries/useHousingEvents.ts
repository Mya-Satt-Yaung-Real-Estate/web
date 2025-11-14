/**
 * Housing Events Query Hook
 * 
 * TanStack Query hook for fetching housing events with infinite scroll.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { housingEventKeys, housingEventQueries } from '@/services/queries/housingEvents';
import type { HousingEventFilters } from '@/types/housingEvents';

/**
 * Get housing events with infinite scroll
 */
export function useHousingEvents(filters: HousingEventFilters = {}) {
  return useInfiniteQuery({
    queryKey: housingEventKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => {
      return housingEventQueries.getHousingEvents({
        ...filters,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (!pagination) return undefined;
      
      if (pagination.has_more_pages) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

