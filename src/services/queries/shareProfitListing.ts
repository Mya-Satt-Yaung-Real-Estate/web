import { shareProfitListingApi } from '../api/shareProfitListing';
import type { ShareProfitListFilters } from '../api/shareProfitListing';

export const shareProfitListingKeys = {
  all: ['share-profit-listings'] as const,
  lists: () => [...shareProfitListingKeys.all, 'list'] as const,
  list: (filters?: ShareProfitListFilters) => [...shareProfitListingKeys.lists(), filters] as const,
  details: () => [...shareProfitListingKeys.all, 'detail'] as const,
  detail: (slug: string) => [...shareProfitListingKeys.details(), slug] as const,
  statistics: () => [...shareProfitListingKeys.all, 'statistics'] as const,
};

export const shareProfitListingQueries = {
  getPublicListings: (filters?: ShareProfitListFilters) => {
    return shareProfitListingApi.getPublicListings(filters);
  },

  getPublicDetail: (slug: string) => {
    return shareProfitListingApi.getPublicDetail(slug);
  },

  getPublicStatistics: () => {
    return shareProfitListingApi.getPublicStatistics();
  },
};
