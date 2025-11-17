/**
 * Property API Endpoints
 * 
 * Property-related API operations.
 */

import { api } from './client';
import type { SearchFilters, PaginatedResponse } from '@/types';
import type { Property, PropertyListResponse, PropertyResponse, PropertyFilters } from '@/types/properties';

// ============================================================================
// PROPERTY API FUNCTIONS
// ============================================================================

export const propertyApi = {
  /**
   * Get current user's properties with filters (authenticated)
   */
  getMyProperties: (filters: PropertyFilters = {}) => {
    return api.get<PropertyListResponse>(`/api/v1/frontend/my-properties`, {
      params: filters,
    });
  },

  /**
   * Create a new property (authenticated)
   */
  createMyProperty: (payload: any) => {
    return api.post<PropertyResponse>(
      '/api/v1/frontend/my-properties',
      payload
    );
  },

  /**
   * Get my property by slug (authenticated)
   */
  getMyProperty: (slug: string) => {
    return api.get<PropertyResponse>(`/api/v1/frontend/my-properties/${slug}`);
  },

  /**
   * Update my property by slug (authenticated)
   */
  updateMyProperty: (slug: string, payload: any) => {
    return api.put<PropertyResponse>(`/api/v1/frontend/my-properties/${slug}`, payload);
  },

  /**
   * Update property status by slug (authenticated)
   */
  updateMyPropertyStatus: (slug: string, status: 'draft' | 'published' | 'sold' | 'rented') => {
    return api.patch<PropertyResponse>(`/api/v1/frontend/my-properties/${slug}/status`, { status });
  },

  /**
   * Delete property by slug (frontend my-properties)
   */
  deleteMyProperty: (slug: string) => {
    return api.delete<{ success: boolean; message?: string }>(`/api/v1/frontend/my-properties/${slug}`);
  },

  /**
   * Get all properties with pagination
   */
  getProperties: (page = 1, limit = 12, filters?: SearchFilters) => {
    return api.get<PaginatedResponse<Property>>('/properties', {
      params: { page, limit, ...filters },
    });
  },

  /**
   * Get property by ID
   */
  getProperty: (id: string) => {
    return api.get<Property>(`/properties/${id}`);
  },

  /**
   * Search properties
   */
  searchProperties: (filters: SearchFilters, page = 1, limit = 12) => {
    return api.get<PaginatedResponse<Property>>('/properties/search', {
      params: { page, limit, ...filters },
    });
  },

  /**
   * Create new property
   */
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    return api.post<Property>('/properties', property);
  },

  /**
   * Update property
   */
  updateProperty: (id: string, property: Partial<Property>) => {
    return api.put<Property>(`/properties/${id}`, property);
  },

  /**
   * Delete property
   */
  deleteProperty: (id: string) => {
    return api.delete<{ success: boolean }>(`/properties/${id}`);
  },

  /**
   * Get user's favorite properties (frontend endpoint)
   */
  getFavorites: (params?: { per_page?: number; page?: number }) => {
    return api.get<{
      success: boolean;
      message: string;
      data: Property[];
      pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
        has_more_pages: boolean;
      };
    }>('/api/v1/frontend/favorites', {
      params,
    });
  },

  /**
   * Get user's recently viewed properties (frontend endpoint)
   */
  getRecentViews: () => {
    return api.get<{
      success: boolean;
      message: string;
      data: Property[];
    }>('/api/v1/frontend/properties/recent-view');
  },

  /**
   * Get user's favorite properties (legacy endpoint)
   */
  getFavoriteProperties: () => {
    return api.get<Property[]>('/properties/favorites');
  },

  /**
   * Toggle favorite status for a property (frontend endpoint)
   */
  toggleFavorite: (slug: string) => {
    return api.post<{ success: boolean; message: string; data: { is_favorited: boolean } }>(`/api/v1/frontend/properties/${slug}/favorite`);
  },

  /**
   * Add property to favorites (legacy endpoint)
   */
  addToFavorites: (propertyId: string) => {
    return api.post<{ success: boolean }>(`/properties/${propertyId}/favorite`);
  },

  /**
   * Remove property from favorites (legacy endpoint)
   */
  removeFromFavorites: (propertyId: string) => {
    return api.delete<{ success: boolean }>(`/properties/${propertyId}/favorite`);
  },

  /**
   * Get property statistics
   */
  getPropertyStats: () => {
    return api.get<{
      total: number;
      available: number;
      sold: number;
      rented: number;
    }>('/properties/stats');
  },

  /**
   * Renew expired property
   */
  renewMyProperty: (slug: string, notes?: string) => {
    return api.post<PropertyResponse>(`/api/v1/frontend/my-properties/${slug}/renew`, {
      notes: notes || '',
    });
  },
};
