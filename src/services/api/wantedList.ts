import { api } from './client';
import type { WantedListResponse, WantedListDetailResponse } from '@/types/wantedList';

export interface WantedListFilters {
  search?: string;
  property_type_id?: number;
  prefer_region_id?: number;
  prefer_township_id?: number;
  wanted_type?: 'buyer' | 'renter';
  min_budget?: number;
  max_budget?: number;
  min_area?: number;
  max_area?: number;
  per_page?: number;
  page?: number;
}

export const wantedListApi = {
  getPublicWantedLists: (filters: WantedListFilters = {}) => {
    return api.get<WantedListResponse>('/api/v1/frontend/public/wanted-lists', {
      params: filters,
    });
  },

  getPublicWantedDetail: (slug: string) => {
    return api.get<WantedListDetailResponse>(`/api/v1/frontend/public/wanted-lists/${slug}`);
  },

  unlockPublicWantedDetail: (slug: string) => {
    return api.post<WantedListDetailResponse>(`/api/v1/frontend/unlock/wanted-list/${slug}`);
  },
};

