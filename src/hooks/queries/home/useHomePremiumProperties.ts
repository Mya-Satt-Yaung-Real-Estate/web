/**
 * Home Page Premium Properties Hook
 * 
 * Fetches premium properties for home page (8 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomePremiumProperties() {
  return useQuery({
    queryKey: homeKeys.premiumProperties(),
    queryFn: homeQueries.getPremiumProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

