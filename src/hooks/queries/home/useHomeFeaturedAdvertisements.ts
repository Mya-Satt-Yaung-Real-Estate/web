/**
 * Home Page Featured Advertisements Hook
 * 
 * Fetches featured advertisements for home page (6 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeFeaturedAdvertisements() {
  return useQuery({
    queryKey: homeKeys.featuredAdvertisements(),
    queryFn: homeQueries.getFeaturedAdvertisements,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

