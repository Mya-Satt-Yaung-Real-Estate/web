/**
 * Wanting List API Service
 * 
 * API operations for wanting list endpoints.
 */

import { apiClient } from './client';
import type { 
  WantingListResponse, 
  WantingListListResponse, 
  WantingListFilters, 
  WantingListCreateData, 
  WantingListUpdateData,
  WantingListStatisticsResponse 
} from '@/types/wantingList';

export const wantingListApi = {
  /**
   * Get user's wanting lists with filters (authenticated)
   */
  async getUserLists(filters: WantingListFilters = {}): Promise<WantingListListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.wanted_type) params.append('wanted_type', filters.wanted_type);
    if (filters.property_type_id) params.append('property_type_id', filters.property_type_id.toString());
    if (filters.prefer_region_id) params.append('prefer_region_id', filters.prefer_region_id.toString());
    if (filters.prefer_township_id) params.append('prefer_township_id', filters.prefer_township_id.toString());
    if (filters.verification_status) params.append('verification_status', filters.verification_status);
    if (filters.min_budget) params.append('min_budget', filters.min_budget.toString());
    if (filters.max_budget) params.append('max_budget', filters.max_budget.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.min_area) params.append('min_area', filters.min_area.toString());
    if (filters.max_area) params.append('max_area', filters.max_area.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_direction) params.append('sort_direction', filters.sort_direction);

    const response = await apiClient.get<WantingListListResponse>(`/api/v1/frontend/wanted-lists?${params.toString()}`);
    return response.data;
  },

  /**
   * Create a new wanting list (authenticated)
   */
  async createList(data: WantingListCreateData): Promise<WantingListResponse> {
    const response = await apiClient.post<WantingListResponse>('/api/v1/frontend/wanted-lists', data);
    return response.data;
  },

  /**
   * Get a single wanting list by slug (authenticated)
   */
  async getList(slug: string): Promise<WantingListResponse> {
    const response = await apiClient.get<WantingListResponse>(`/api/v1/frontend/wanted-lists/${slug}`);
    return response.data;
  },

  /**
   * Update a wanting list (authenticated)
   */
  async updateList(slug: string, data: WantingListUpdateData): Promise<WantingListResponse> {
    const response = await apiClient.put<WantingListResponse>(`/api/v1/frontend/wanted-lists/${slug}`, data);
    return response.data;
  },

  /**
   * Delete a wanting list (authenticated)
   */
  async deleteList(slug: string): Promise<{ success: boolean; message: string; }> {
    const response = await apiClient.delete<{ success: boolean; message: string; }>(`/api/v1/frontend/wanted-lists/${slug}`);
    return response.data;
  },

  /**
   * Toggle wanting list status (authenticated)
   */
  async toggleStatus(slug: string): Promise<{ success: boolean; message: string; data: any; }> {
    const response = await apiClient.patch<{ success: boolean; message: string; data: any; }>(`/api/v1/frontend/wanted-lists/${slug}/toggle-status`);
    return response.data;
  },

  /**
   * Get wanting list statistics (authenticated)
   */
  async getStatistics(): Promise<WantingListStatisticsResponse> {
    const response = await apiClient.get<WantingListStatisticsResponse>('/api/v1/frontend/wanted-lists/statistics');
    return response.data;
  },

  /**
   * Get public wanting lists (no auth required)
   */
  async getPublicLists(filters: Omit<WantingListFilters, 'verification_status'> = {}): Promise<WantingListListResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.wanted_type) params.append('wanted_type', filters.wanted_type);
    if (filters.property_type_id) params.append('property_type_id', filters.property_type_id.toString());
    if (filters.prefer_region_id) params.append('prefer_region_id', filters.prefer_region_id.toString());
    if (filters.prefer_township_id) params.append('prefer_township_id', filters.prefer_township_id.toString());
    if (filters.min_budget) params.append('min_budget', filters.min_budget.toString());
    if (filters.max_budget) params.append('max_budget', filters.max_budget.toString());
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.min_area) params.append('min_area', filters.min_area.toString());
    if (filters.max_area) params.append('max_area', filters.max_area.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_direction) params.append('sort_direction', filters.sort_direction);

    const response = await apiClient.get<WantingListListResponse>(`/api/v1/website/public/wanted-lists?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single public wanting list by slug (no auth required)
   */
  async getPublicList(slug: string): Promise<WantingListResponse> {
    const response = await apiClient.get<WantingListResponse>(`/api/v1/website/public/wanted-lists/${slug}`);
    return response.data;
  },

  /**
   * Get public wanting list statistics (no auth required)
   */
  async getPublicStatistics(): Promise<WantingListStatisticsResponse> {
    const response = await apiClient.get<WantingListStatisticsResponse>('/api/v1/website/public/wanted-lists/statistics');
    return response.data;
  },
};