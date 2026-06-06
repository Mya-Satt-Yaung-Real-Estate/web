/**
 * Property detail company logo lists hook.
 *
 * Fetches companies configured for the property detail sidebar.
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function usePropertyDetailCompanyLogoLists() {
  return useQuery({
    queryKey: homeKeys.propertyDetailCompanyLogoLists(),
    queryFn: homeQueries.getPropertyDetailCompanyLogoLists,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
