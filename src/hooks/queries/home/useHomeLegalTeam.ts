/**
 * Home Page Legal Team Hook
 * 
 * Fetches legal team members for home page (3 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeLegalTeam() {
  return useQuery({
    queryKey: homeKeys.legalTeam(),
    queryFn: homeQueries.getLegalTeam,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

