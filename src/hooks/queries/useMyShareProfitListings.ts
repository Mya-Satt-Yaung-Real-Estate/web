import { useQuery } from '@tanstack/react-query';
import { shareProfitListingKeys, shareProfitListingQueries } from '@/services/queries/shareProfitListing';
import type { ShareProfitOwnerFilters } from '@/types/shareProfitListing';

export function useMyShareProfitListings(filters: ShareProfitOwnerFilters = {}) {
  return useQuery({
    queryKey: shareProfitListingKeys.ownerList(filters),
    queryFn: () => shareProfitListingQueries.getOwnerListings(filters),
    staleTime: 60 * 1000,
  });
}

export function useMyShareProfitListing(slug: string) {
  return useQuery({
    queryKey: shareProfitListingKeys.ownerDetail(slug),
    queryFn: () => shareProfitListingQueries.getOwnerDetail(slug),
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
