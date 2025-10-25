/**
 * Property API Endpoints
 * 
 * Property-related API operations.
 */

import { api } from './client';
import type { Property, SearchFilters, PaginatedResponse } from '@/types';

// ============================================================================
// PROPERTY API FUNCTIONS
// ============================================================================

export const propertyApi = {
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
   * Get user's favorite properties
   */
  getFavoriteProperties: () => {
    return api.get<Property[]>('/properties/favorites');
  },

  /**
   * Add property to favorites
   */
  addToFavorites: (propertyId: string) => {
    return api.post<{ success: boolean }>(`/properties/${propertyId}/favorite`);
  },

  /**
   * Remove property from favorites
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
};
