/**
 * Property API Service
 * 
 * Property-related API operations.
 */

import { api } from './base';
import type { Property, SearchFilters, PaginatedResponse } from '@/types';

// ============================================================================
// PROPERTY API FUNCTIONS
// ============================================================================

/**
 * Get all properties with pagination
 */
export async function getProperties(page = 1, limit = 12, _filters?: SearchFilters) {
  const response = await api.get<PaginatedResponse<Property>>('/properties', {
    headers: {
      'X-Page': page.toString(),
      'X-Limit': limit.toString(),
    },
  });
  return response.data;
}

/**
 * Get property by ID
 */
export async function getProperty(id: string) {
  const response = await api.get<Property>(`/properties/${id}`);
  return response.data;
}

/**
 * Search properties
 */
export async function searchProperties(_filters: SearchFilters, page = 1, limit = 12) {
  const response = await api.get<PaginatedResponse<Property>>('/properties/search', {
    headers: {
      'X-Page': page.toString(),
      'X-Limit': limit.toString(),
    },
  });
  return response.data;
}

/**
 * Create new property
 */
export async function createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
  const response = await api.post<Property>('/properties', property);
  return response.data;
}

/**
 * Update property
 */
export async function updateProperty(id: string, property: Partial<Property>) {
  const response = await api.put<Property>(`/properties/${id}`, property);
  return response.data;
}

/**
 * Delete property
 */
export async function deleteProperty(id: string) {
  const response = await api.delete<{ success: boolean }>(`/properties/${id}`);
  return response.data;
}

/**
 * Get user's favorite properties
 */
export async function getFavoriteProperties() {
  const response = await api.get<Property[]>('/properties/favorites');
  return response.data;
}

/**
 * Add property to favorites
 */
export async function addToFavorites(propertyId: string) {
  const response = await api.post<{ success: boolean }>(`/properties/${propertyId}/favorite`);
  return response.data;
}

/**
 * Remove property from favorites
 */
export async function removeFromFavorites(propertyId: string) {
  const response = await api.delete<{ success: boolean }>(`/properties/${propertyId}/favorite`);
  return response.data;
}

/**
 * Get property statistics
 */
export async function getPropertyStats() {
  const response = await api.get<{
    total: number;
    available: number;
    sold: number;
    rented: number;
  }>('/properties/stats');
  return response.data;
}
