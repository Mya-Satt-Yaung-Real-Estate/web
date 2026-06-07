/**
 * Home Page Featured Advertisements Hook
 * 
 * Fetches featured advertisements for home page (6 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';
import type { HomeAdvertisementType } from '@/services/api/home';

export function useHomeFeaturedAdvertisements(advertisementType?: HomeAdvertisementType) {
  return useQuery({
    queryKey: homeKeys.featuredAdvertisements(advertisementType),
    queryFn: () => homeQueries.getFeaturedAdvertisements(advertisementType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

