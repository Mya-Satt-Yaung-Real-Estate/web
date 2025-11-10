import { useQuery } from '@tanstack/react-query';
import { wantedListKeys, wantedListQueries } from '@/services/queries/wantedList';
import type { WantedListFilters } from '@/services/api/wantedList';

export function useWantedLists(filters?: WantedListFilters) {
  return useQuery({
    queryKey: wantedListKeys.list(filters),
    queryFn: () => wantedListQueries.getPublicWantedLists(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

