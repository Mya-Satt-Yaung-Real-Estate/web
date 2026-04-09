/**
 * Home Page Company Logo Lists Hook
 *
 * Fetches company logo list for home page slider.
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeCompanyLogoLists() {
  return useQuery({
    queryKey: homeKeys.companyLogoLists(),
    queryFn: homeQueries.getCompanyLogoLists,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

