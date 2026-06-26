/**
 * Home Page Explore Categories Hook
 *
 * Fetches admin-managed explore-by-category cards (max 9 active).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeExploreCategories() {
  return useQuery({
    queryKey: homeKeys.exploreCategories(),
    queryFn: homeQueries.getExploreCategories,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
