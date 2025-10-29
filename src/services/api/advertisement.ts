import { apiClient } from './client';
import type {
  AdvertisementResponse,
  AdvertisementListResponse,
  AdvertisementFilters,
  AdvertisementCreateData,
  AdvertisementUpdateData,
  AdvertisementCategoryResponse
} from '@/types/advertisement';

export const advertisementApi = {
  /**
   * Get user's advertisements with filters (authenticated)
   */
  async getUserAdvertisements(filters: AdvertisementFilters = {}): Promise<AdvertisementListResponse> {
    const response = await apiClient.get<AdvertisementListResponse>('/api/v1/frontend/advertisements', {
      params: filters
    });
    return response.data;
  },

  /**
   * Get a single advertisement by ID (authenticated)
   */
  async getAdvertisement(id: number): Promise<AdvertisementResponse> {
    const response = await apiClient.get<AdvertisementResponse>(`/api/v1/frontend/advertisements/${id}`);
    return response.data;
  },

  /**
   * Create new advertisement (authenticated)
   */
  async createAdvertisement(data: AdvertisementCreateData): Promise<AdvertisementResponse> {
    const response = await apiClient.post<AdvertisementResponse>('/api/v1/frontend/advertisements', data);
    return response.data;
  },

  /**
   * Update advertisement (authenticated)
   */
  async updateAdvertisement(id: number, data: AdvertisementUpdateData): Promise<AdvertisementResponse> {
    const response = await apiClient.put<AdvertisementResponse>(`/api/v1/frontend/advertisements/${id}`, data);
    return response.data;
  },

  /**
   * Delete advertisement (authenticated)
   */
  async deleteAdvertisement(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/v1/frontend/advertisements/${id}`);
    return response.data;
  },

  /**
   * Get advertisement categories
   */
  async getAdvertisementCategories(): Promise<AdvertisementCategoryResponse> {
    const response = await apiClient.get<AdvertisementCategoryResponse>('/api/v1/frontend/advertisement-categories');
    return response.data;
  },

  /**
   * Get advertisement statistics (authenticated)
   */
  async getAdvertisementStats(): Promise<{
    success: boolean;
    message: string;
    data: {
      total_advertisements: number;
      active_advertisements: number;
      pending_advertisements: number;
      total_views: number;
      total_clicks: number;
      total_spent: number;
    };
  }> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        total_advertisements: number;
        active_advertisements: number;
        pending_advertisements: number;
        total_views: number;
        total_clicks: number;
        total_spent: number;
      };
    }>('/api/v1/frontend/advertisements/stats');
    return response.data;
  }
};
