/**
 * Statistics Counts Query Hook
 * 
 * TanStack Query hook for fetching statistics counts.
 */

import { useQuery } from '@tanstack/react-query';
import { statisticsKeys, statisticsQueries } from '@/services/queries/statistics';

/**
 * Get statistics counts
 */
export function useStatisticsCounts() {
  return useQuery({
    queryKey: statisticsKeys.counts(),
    queryFn: () => statisticsQueries.getCounts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

