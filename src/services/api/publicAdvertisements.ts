import { api } from './client';
import type { PublicAdvertisementListResponse, PublicAdvertisementFilters } from '@/types/publicAdvertisements';

export const publicAdvertisementApi = {
  getPublicAdvertisements: (filters: PublicAdvertisementFilters = {}) => {
    return api.get<PublicAdvertisementListResponse>('/api/v1/frontend/public/advertisements', {
      params: filters,
    });
  },
};

