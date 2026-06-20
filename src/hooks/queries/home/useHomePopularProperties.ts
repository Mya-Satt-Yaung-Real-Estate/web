/**
 * Home Page Popular Properties Hook
 *
 * Fetches top 4 properties by view count for home page.
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomePopularProperties() {
  return useQuery({
    queryKey: homeKeys.popularProperties(),
    queryFn: homeQueries.getPopularProperties,
    staleTime: 5 * 60 * 1000,
  });
}
