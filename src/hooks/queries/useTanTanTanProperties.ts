import { useInfiniteQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

export function useTanTanTanProperties(filters?: Omit<PublicPropertyFilters, 'tan_tan_tan'>) {
  return useInfiniteQuery({
    queryKey: publicPropertyKeys.tanTanTanList(filters),
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: Omit<PublicPropertyFilters, 'tan_tan_tan'> = {
        ...filters,
        page: pageParam,
      };
      // Only set per_page if not already provided in filters
      if (queryParams.per_page === undefined) {
        queryParams.per_page = 20;
      }
      return publicPropertyQueries.getTanTanTanProperties(queryParams);
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


