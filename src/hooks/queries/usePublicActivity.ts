import { useQuery } from '@tanstack/react-query';
import { activityKeys, activityQueries } from '@/services/queries/activities';

export function usePublicActivity(slug: string) {
  return useQuery({
    queryKey: activityKeys.publicDetail(slug),
    queryFn: () => activityQueries.getPublicDetail(slug),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
