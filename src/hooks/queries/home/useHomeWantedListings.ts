/**
 * Home Page Wanted Listings Hook
 * 
 * Fetches wanted listings for home page (6 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeWantedListings() {
  return useQuery({
    queryKey: homeKeys.wantedListings(),
    queryFn: homeQueries.getWantedListings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

