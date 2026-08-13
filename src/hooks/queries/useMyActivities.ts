import { useQuery } from '@tanstack/react-query';
import { activityKeys, activityQueries } from '@/services/queries/activities';
import type { ActivityOwnerFilters } from '@/types/activity';

export function useMyActivities(filters: ActivityOwnerFilters = {}) {
  return useQuery({
    queryKey: activityKeys.ownerList(filters),
    queryFn: () => activityQueries.getOwnerListings(filters),
    staleTime: 60 * 1000,
  });
}

export function useMyActivity(slug: string) {
  return useQuery({
    queryKey: activityKeys.ownerDetail(slug),
    queryFn: () => activityQueries.getOwnerDetail(slug),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
