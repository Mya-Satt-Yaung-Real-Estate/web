import { api } from './client';
import type { HousingEventListResponse, HousingEventDetailResponse, HousingEventFilters } from '@/types/housingEvents';

export const housingEventApi = {
  getHousingEvents: (filters: HousingEventFilters = {}) => {
    return api.get<HousingEventListResponse>('/api/v1/frontend/housing-events', {
      params: filters,
    });
  },

  getHousingEventDetail: (slug: string) => {
    return api.get<HousingEventDetailResponse>(`/api/v1/frontend/housing-events/${slug}`);
  },

  registerEvent: (id: number) => {
    return api.post<{ success: boolean; message: string; data?: any }>(`/api/v1/housing-events/${id}/register`);
  },
};

