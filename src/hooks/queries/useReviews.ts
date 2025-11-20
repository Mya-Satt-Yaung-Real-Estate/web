/**
 * Review Query Hooks
 * 
 * TanStack Query hooks for review operations.
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewKeys, reviewQueries } from '@/services/queries/reviews';
import type { ReviewFilters } from '@/types/reviews';

/**
 * Get public reviews with infinite scroll
 */
export function usePublicReviews(filters?: ReviewFilters) {
  return useInfiniteQuery({
    queryKey: reviewKeys.infinite(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: ReviewFilters = {
        ...filters,
        page: pageParam,
      };
      // Only set per_page if not already provided in filters
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 30;
      }
      return reviewQueries.getPublicReviews(queryParams);
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

