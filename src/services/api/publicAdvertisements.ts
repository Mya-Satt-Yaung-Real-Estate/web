import { api } from './client';
import type { PublicAdvertisementListResponse, PublicAdvertisementDetailResponse, PublicAdvertisementFilters } from '@/types/publicAdvertisements';

export const publicAdvertisementApi = {
  getPublicAdvertisements: (filters: PublicAdvertisementFilters = {}) => {
    return api.get<PublicAdvertisementListResponse>('/api/v1/frontend/public/advertisements', {
      params: filters,
    });
  },

  getPublicAdvertisementDetail: (id: string | number) => {
    return api.get<PublicAdvertisementDetailResponse>(`/api/v1/public/advertisements/${id}`);
  },

  /**
   * Toggle like status for a public advertisement (frontend endpoint)
   */
  toggleLike: (id: string | number) => {
    return api.post<{ success: boolean; message: string; data: { is_like: boolean; like_count?: number } }>(`/api/v1/frontend/advertisements/${id}/like`);
  },
};

