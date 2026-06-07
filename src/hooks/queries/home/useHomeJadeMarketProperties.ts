/**
 * Home Page Jade Market Properties Hook
 *
 * Fetches Jade Market properties for home page (4 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeJadeMarketProperties() {
  return useQuery({
    queryKey: homeKeys.jadeMarketProperties(),
    queryFn: homeQueries.getJadeMarketProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
