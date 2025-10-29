import { apiClient } from './client';
import type { 
  WantingListCreateData, 
  WantingListResponse, 
  WantingListListResponse,
  WantingListUpdateData,
  WantingListFilters,
  WantingListStatisticsResponse
} from '@/types/wantingList';

export const wantingListApi = {
  // Create wanting list
  async createWantingList(data: WantingListCreateData): Promise<WantingListResponse> {
    const response = await apiClient.post<WantingListResponse>('/api/v1/frontend/wanted-lists', data);
    return response.data;
  },

  // Create wanting list (alias for createWantingList)
  async createList(data: WantingListCreateData): Promise<WantingListResponse> {
    const response = await apiClient.post<WantingListResponse>('/api/v1/frontend/wanted-lists', data);
    return response.data;
  },

  // Get user's wanting lists
  async getUserLists(filters?: WantingListFilters): Promise<WantingListListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get<WantingListListResponse>(`/api/v1/frontend/wanted-lists?${params.toString()}`);
    return response.data;
  },

  // Get single wanting list
  async getList(slug: string): Promise<WantingListResponse> {
    const response = await apiClient.get<WantingListResponse>(`/api/v1/frontend/wanted-lists/${slug}`);
    return response.data;
  },

  // Update wanting list
  async updateList(slug: string, data: WantingListUpdateData): Promise<WantingListResponse> {
    const response = await apiClient.put<WantingListResponse>(`/api/v1/frontend/wanted-lists/${slug}`, data);
    return response.data;
  },

  // Delete wanting list
  async deleteList(slug: string): Promise<WantingListResponse> {
    const response = await apiClient.delete<WantingListResponse>(`/api/v1/frontend/wanted-lists/${slug}`);
    return response.data;
  },

  // Toggle status
  async toggleStatus(slug: string): Promise<WantingListResponse> {
    const response = await apiClient.patch<WantingListResponse>(`/api/v1/frontend/wanted-lists/${slug}/toggle-status`);
    return response.data;
  },

  // Get statistics
  async getStatistics(): Promise<WantingListStatisticsResponse> {
    const response = await apiClient.get<WantingListStatisticsResponse>('/api/v1/frontend/wanted-lists/statistics');
    return response.data;
  },

  // Public APIs
  async getPublicLists(filters?: WantingListFilters): Promise<WantingListListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get<WantingListListResponse>(`/api/v1/public/wanted-lists?${params.toString()}`);
    return response.data;
  },

  async getPublicList(slug: string): Promise<WantingListResponse> {
    const response = await apiClient.get<WantingListResponse>(`/api/v1/public/wanted-lists/${slug}`);
    return response.data;
  },

  async getPublicStatistics(): Promise<WantingListStatisticsResponse> {
    const response = await apiClient.get<WantingListStatisticsResponse>('/api/v1/public/wanted-lists/statistics');
    return response.data;
  },
};