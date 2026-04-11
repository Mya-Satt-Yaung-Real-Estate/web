import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeGridAds() {
  return useQuery({
    queryKey: homeKeys.homeGridAds(),
    queryFn: homeQueries.getHomeGridAds,
    staleTime: 5 * 60 * 1000,
  });
}
