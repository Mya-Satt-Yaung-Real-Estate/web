import { useInfiniteQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

export function useJadeMarketplaceProperties(filters?: Omit<PublicPropertyFilters, 'jade_market'>) {
  return useInfiniteQuery({
    queryKey: publicPropertyKeys.jadeMarketplaceList(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Omit<PublicPropertyFilters, 'jade_market'> = {
        ...filters,
        page: pageParam,
      };
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return publicPropertyQueries.getJadeMarketplaceProperties(queryParams);
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
