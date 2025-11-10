import { useInfiniteQuery } from '@tanstack/react-query';
import { wantedListKeys, wantedListQueries } from '@/services/queries/wantedList';
import type { WantedListFilters } from '@/services/api/wantedList';

export function useWantedLists(filters?: WantedListFilters) {
  return useInfiniteQuery({
    queryKey: wantedListKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: WantedListFilters = {
        ...filters,
        page: pageParam,
      };
      // Only set per_page if not already provided in filters
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return wantedListQueries.getPublicWantedLists(queryParams);
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

