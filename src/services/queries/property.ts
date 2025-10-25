/**
 * Property Query Definitions
 * 
 * TanStack Query definitions for property-related operations.
 */

import { 
  getProperties, 
  getProperty, 
  searchProperties, 
  getFavoriteProperties, 
  getPropertyStats 
} from '../api/property';
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

/**
 * Get all properties
 */
export async function fetchProperties(page = 1, limit = 12, filters?: SearchFilters) {
  return getProperties(page, limit, filters);
}

/**
 * Get property by ID
 */
export async function fetchProperty(id: string) {
  return getProperty(id);
}

/**
 * Search properties
 */
export async function fetchSearchProperties(filters: SearchFilters, page = 1, limit = 12) {
  return searchProperties(filters, page, limit);
}

/**
 * Get user's favorite properties
 */
export async function fetchFavoriteProperties() {
  return getFavoriteProperties();
}

/**
 * Get property statistics
 */
export async function fetchPropertyStats() {
  return getPropertyStats();
}
