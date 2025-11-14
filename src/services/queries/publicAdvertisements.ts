import { publicAdvertisementApi } from '../api/publicAdvertisements';
import type { PublicAdvertisementFilters } from '@/types/publicAdvertisements';

export const publicAdvertisementKeys = {
  all: ['public-advertisements'] as const,
  lists: () => [...publicAdvertisementKeys.all, 'list'] as const,
  list: (filters?: PublicAdvertisementFilters) => [...publicAdvertisementKeys.lists(), filters] as const,
  details: () => [...publicAdvertisementKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...publicAdvertisementKeys.details(), id] as const,
} as const;

export const publicAdvertisementQueries = {
  getPublicAdvertisements: (filters?: PublicAdvertisementFilters) => {
    return publicAdvertisementApi.getPublicAdvertisements(filters);
  },

  getPublicAdvertisementDetail: (id: string | number) => {
    return publicAdvertisementApi.getPublicAdvertisementDetail(id);
  },
};

