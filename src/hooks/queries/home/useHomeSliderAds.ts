/**
 * Home Page Slider Ads Hook
 * 
 * Fetches slider ads for home page carousel.
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeSliderAds() {
  return useQuery({
    queryKey: homeKeys.sliderAds(),
    queryFn: homeQueries.getSliderAds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


