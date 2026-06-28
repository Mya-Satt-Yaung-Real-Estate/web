/**
 * Home Page Block Ads Hook
 * 
 * Fetches home block ads grouped by slot (left / right) for the home page.
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeBlockAds() {
  return useQuery({
    queryKey: homeKeys.homeBlockAds(),
    queryFn: homeQueries.getHomeBlockAds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

