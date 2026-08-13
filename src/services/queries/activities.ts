import { activityApi } from '../api/activities';
import type { ActivityOwnerFilters } from '@/types/activity';

export const activityKeys = {
  all: ['activities'] as const,
  ownerLists: () => [...activityKeys.all, 'owner-list'] as const,
  ownerList: (filters?: ActivityOwnerFilters) => [...activityKeys.ownerLists(), filters] as const,
  ownerDetails: () => [...activityKeys.all, 'owner-detail'] as const,
  ownerDetail: (slug: string) => [...activityKeys.ownerDetails(), slug] as const,
};

export const activityQueries = {
  getOwnerListings: (filters?: ActivityOwnerFilters) => activityApi.getOwnerListings(filters),
  getOwnerDetail: (slug: string) => activityApi.getOwnerDetail(slug),
};
