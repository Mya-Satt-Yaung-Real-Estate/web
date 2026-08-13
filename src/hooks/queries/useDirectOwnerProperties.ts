import { useInfiniteQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

export function useDirectOwnerProperties(filters?: Omit<PublicPropertyFilters, 'direct_owner'>) {
  return useInfiniteQuery({
    queryKey: publicPropertyKeys.directOwnerList(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Omit<PublicPropertyFilters, 'direct_owner'> = {
        ...filters,
        page: pageParam,
      };
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return publicPropertyQueries.getDirectOwnerProperties(queryParams);
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
