/**
 * Public Advertisement Query Hooks
 * 
 * TanStack Query hooks for public advertisement operations.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { publicAdvertisementKeys, publicAdvertisementQueries } from '@/services/queries/publicAdvertisements';
import type { PublicAdvertisementFilters } from '@/types/publicAdvertisements';

/**
 * Get public advertisements with filters (infinite scroll)
 */
export function usePublicAdvertisements(filters?: PublicAdvertisementFilters) {
  return useInfiniteQuery({
    queryKey: publicAdvertisementKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: PublicAdvertisementFilters = {
        ...filters,
        page: pageParam,
      };
      // Only set per_page if not already provided in filters
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return publicAdvertisementQueries.getPublicAdvertisements(queryParams);
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (pagination?.has_more_pages) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

