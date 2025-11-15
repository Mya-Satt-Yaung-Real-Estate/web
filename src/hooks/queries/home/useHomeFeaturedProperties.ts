/**
 * Home Page Featured Properties Hook
 * 
 * Fetches featured properties for home page (4 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeFeaturedProperties() {
  return useQuery({
    queryKey: homeKeys.featuredProperties(),
    queryFn: homeQueries.getFeaturedProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

