import { api } from './client';
import type { WantedListResponse } from '@/types/wantedList';

export interface WantedListFilters {
  per_page?: number;
  page?: number;
}

export const wantedListApi = {
  getPublicWantedLists: (filters: WantedListFilters = {}) => {
    return api.get<WantedListResponse>('/api/v1/frontend/public/wanted-lists', {
      params: filters,
    });
  },
};

