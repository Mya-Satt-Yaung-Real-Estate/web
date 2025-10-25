/**
 * Property Query Definitions
 * 
 * TanStack Query definitions for property operations.
 */

import { propertyApi } from '../api/properties';
import type { SearchFilters } from '@/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: SearchFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  search: (query: string) => [...propertyKeys.all, 'search', query] as const,
  favorites: () => [...propertyKeys.all, 'favorites'] as const,
  stats: () => [...propertyKeys.all, 'stats'] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const propertyQueries = {
  /**
   * Get all properties
   */
  getProperties: (page = 1, limit = 12, filters?: SearchFilters) => {
    return propertyApi.getProperties(page, limit, filters);
  },

  /**
   * Get property by ID
   */
  getProperty: (id: string) => {
    return propertyApi.getProperty(id);
  },

  /**
   * Search properties
   */
  searchProperties: (filters: SearchFilters, page = 1, limit = 12) => {
    return propertyApi.searchProperties(filters, page, limit);
  },

  /**
   * Get user's favorite properties
   */
  getFavoriteProperties: () => {
    return propertyApi.getFavoriteProperties();
  },

  /**
   * Get property statistics
   */
  getPropertyStats: () => {
    return propertyApi.getPropertyStats();
  },
};
