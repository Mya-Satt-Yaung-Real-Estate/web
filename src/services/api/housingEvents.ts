import { api } from './client';
import type { HousingEventListResponse, HousingEventFilters } from '@/types/housingEvents';

export const housingEventApi = {
  getHousingEvents: (filters: HousingEventFilters = {}) => {
    return api.get<HousingEventListResponse>('/api/v1/frontend/housing-events', {
      params: filters,
    });
  },
};

