/**
 * Home Page New Projects Hook
 *
 * Fetches new projects for home page (3 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeNewProjects() {
  return useQuery({
    queryKey: homeKeys.newProjects(),
    queryFn: homeQueries.getNewProjects,
    staleTime: 5 * 60 * 1000,
  });
}
