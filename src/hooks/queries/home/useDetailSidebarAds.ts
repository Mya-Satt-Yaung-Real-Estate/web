/**
 * Detail Page Sidebar Ads Hook
 * 
 * Fetches detail page sidebar ads for property detail page (displayed under map location).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useDetailSidebarAds() {
  return useQuery({
    queryKey: homeKeys.detailSidebarAds(),
    queryFn: homeQueries.getDetailSidebarAds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

