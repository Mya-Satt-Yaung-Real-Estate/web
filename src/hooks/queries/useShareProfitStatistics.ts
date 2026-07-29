import { useQuery } from '@tanstack/react-query';
import { shareProfitListingKeys, shareProfitListingQueries } from '@/services/queries/shareProfitListing';

export function useShareProfitStatistics() {
  return useQuery({
    queryKey: shareProfitListingKeys.statistics(),
    queryFn: () => shareProfitListingQueries.getPublicStatistics(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
