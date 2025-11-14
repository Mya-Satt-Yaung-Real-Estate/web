/**
 * Public Property Query Hooks
 * 
 * TanStack Query hooks for public property operations.
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

/**
 * Get all public properties with filters (infinite scroll)
 */
export function usePublicProperties(filters?: PublicPropertyFilters) {
  return useInfiniteQuery({
    queryKey: publicPropertyKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: PublicPropertyFilters = {
        ...filters,
        page: pageParam,
      };
      // Only set per_page if not already provided in filters
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return publicPropertyQueries.getPublicProperties(queryParams);
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

/**
 * Get public property by slug
 */
export function usePublicProperty(slug: string) {
  return useQuery({
    queryKey: publicPropertyKeys.detail(slug),
    queryFn: () => publicPropertyQueries.getPublicPropertyBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  });
}


