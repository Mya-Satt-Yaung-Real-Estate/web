import { shareProfitListingApi } from '../api/shareProfitListing';
import type { ShareProfitListFilters } from '../api/shareProfitListing';
import type { ShareProfitOwnerFilters } from '@/types/shareProfitListing';

export const shareProfitListingKeys = {
  all: ['share-profit-listings'] as const,
  lists: () => [...shareProfitListingKeys.all, 'list'] as const,
  list: (filters?: ShareProfitListFilters) => [...shareProfitListingKeys.lists(), filters] as const,
  ownerLists: () => [...shareProfitListingKeys.all, 'owner-list'] as const,
  ownerList: (filters?: ShareProfitOwnerFilters) => [...shareProfitListingKeys.ownerLists(), filters] as const,
  details: () => [...shareProfitListingKeys.all, 'detail'] as const,
  detail: (slug: string) => [...shareProfitListingKeys.details(), slug] as const,
  ownerDetails: () => [...shareProfitListingKeys.all, 'owner-detail'] as const,
  ownerDetail: (slug: string) => [...shareProfitListingKeys.ownerDetails(), slug] as const,
  statistics: () => [...shareProfitListingKeys.all, 'statistics'] as const,
  ownerStatistics: () => [...shareProfitListingKeys.all, 'owner-statistics'] as const,
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

  getOwnerListings: (filters?: ShareProfitOwnerFilters) => {
    return shareProfitListingApi.getOwnerListings(filters);
  },

  getOwnerDetail: (slug: string) => {
    return shareProfitListingApi.getOwnerDetail(slug);
  },

  getOwnerStatistics: () => {
    return shareProfitListingApi.getOwnerStatistics();
  },
};
