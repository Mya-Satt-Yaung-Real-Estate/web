/**
 * Detail page sidebar ads — one GET returns { sidebar_1, sidebar_2 }; this hook selects one strip.
 */

import { useQuery } from '@tanstack/react-query';
import type { ApiResponse } from '@/types';
import type { DetailPageSidebarsAdsResponse, SliderAd } from '@/types/ads';
import { homeKeys, homeQueries } from '@/services/queries/home';

export type DetailSidebarAdsSlot = 1 | 2;

function pickSidebarAds(
  response: ApiResponse<DetailPageSidebarsAdsResponse>,
  sidebarSlot: DetailSidebarAdsSlot
): SliderAd[] {
  const payload = response.data?.data;
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return [];
  }
  const key = sidebarSlot === 1 ? 'sidebar_1' : 'sidebar_2';
  const list = payload[key];
  return Array.isArray(list) ? list : [];
}

export function useDetailSidebarAds(sidebarSlot: DetailSidebarAdsSlot = 1) {
  return useQuery({
    queryKey: homeKeys.detailSidebarAds(),
    queryFn: () => homeQueries.getDetailPageSidebarsAds(),
    select: (response) => pickSidebarAds(response, sidebarSlot),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

