import { useInfiniteQuery } from '@tanstack/react-query';
import { shareProfitListingKeys, shareProfitListingQueries } from '@/services/queries/shareProfitListing';
import type { ShareProfitListFilters } from '@/services/api/shareProfitListing';

export function useShareProfitListings(filters?: ShareProfitListFilters) {
  return useInfiniteQuery({
    queryKey: shareProfitListingKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: ShareProfitListFilters = {
        ...filters,
        page: pageParam,
      };
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return shareProfitListingQueries.getPublicListings(queryParams);
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (pagination?.has_more_pages) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}
