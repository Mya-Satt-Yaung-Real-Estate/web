/**
 * Knowledge Hub API Service
 * 
 * API operations for knowledge hub endpoints.
 */

import { apiClient } from './client';
import type { KnowledgeHubResponse, KnowledgeHubFilters, KnowledgeHubDetailResponse } from '@/types/knowledge';

export const knowledgeApi = {
  /**
   * Get knowledge hub articles with filters
   */
  async getKnowledgeHubs(filters: KnowledgeHubFilters = {}): Promise<KnowledgeHubResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.category) {
      params.append('category', filters.category.toString());
    }
    if (filters.tag) {
      params.append('tag', filters.tag);
    }
    if (filters.per_page) {
      params.append('per_page', filters.per_page.toString());
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }

    const queryString = params.toString();
    const url = `/api/v1/frontend/knowledges-hubs${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<KnowledgeHubResponse>(url);
    return response.data;
  },

  /**
   * Get a single knowledge hub article by slug
   */
  async getKnowledgeHubBySlug(slug: string): Promise<KnowledgeHubDetailResponse> {
    const response = await apiClient.get<KnowledgeHubDetailResponse>(`/api/v1/frontend/knowledges-hubs/${slug}`);
    return response.data;
  },

  /**
   * Get knowledge hub categories
   */
  async getKnowledgeCategories(): Promise<{ success: boolean; data: any[] }> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/api/v1/frontend/knowledge-categories');
    return response.data;
  },

  /**
   * Get popular knowledge hub articles
   */
  async getPopularKnowledgeHubs(limit: number = 5): Promise<KnowledgeHubResponse> {
    const response = await apiClient.get<KnowledgeHubResponse>(`/api/v1/frontend/knowledges-hubs?per_page=${limit}&sort=popular`);
    return response.data;
  },

  /**
   * Get recent knowledge hub articles
   */
  async getRecentKnowledgeHubs(limit: number = 5): Promise<KnowledgeHubResponse> {
    const response = await apiClient.get<KnowledgeHubResponse>(`/api/v1/frontend/knowledges-hubs?per_page=${limit}&sort=recent`);
    return response.data;
  },
};
