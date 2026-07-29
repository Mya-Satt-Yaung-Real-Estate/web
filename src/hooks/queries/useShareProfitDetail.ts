import { useQuery } from '@tanstack/react-query';
import { shareProfitListingKeys, shareProfitListingQueries } from '@/services/queries/shareProfitListing';

export function useShareProfitDetail(slug: string) {
  return useQuery({
    queryKey: shareProfitListingKeys.detail(slug),
    queryFn: () => shareProfitListingQueries.getPublicDetail(slug),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
