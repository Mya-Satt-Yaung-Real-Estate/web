/**
 * Property Query Hooks
 * 
 * TanStack Query hooks for property operations.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { listingTypeApi } from '@/services/api/listingTypes';
import { propertyApi } from '@/services/api/properties';
import { propertyKeys, propertyQueries } from '@/services/queries/properties';
import type { SearchFilters } from '@/types';
import type { PropertyFilters } from '@/types/properties';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get all properties with pagination
 */
export function useProperties(page = 1, limit = 12, filters?: SearchFilters) {
  return useQuery({
    queryKey: propertyKeys.list(filters || {} as SearchFilters),
    queryFn: () => propertyQueries.getProperties(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get properties with infinite scroll
 */
export function useInfiniteProperties(filters?: SearchFilters) {
  return useInfiniteQuery({
    queryKey: propertyKeys.list(filters || {} as SearchFilters),
    queryFn: ({ pageParam = 1 }) => propertyQueries.getProperties(pageParam, 12, filters),
    getNextPageParam: (lastPage) => {
      return lastPage.data.pagination.hasNext ? lastPage.data.pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get property by ID
 */
export function useProperty(id: string) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyQueries.getProperty(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Search properties
 */
export function useSearchProperties(filters: SearchFilters, page = 1, limit = 12) {
  return useQuery({
    queryKey: propertyKeys.search(JSON.stringify(filters)),
    queryFn: () => propertyQueries.searchProperties(filters, page, limit),
    enabled: !!filters.keywords || Object.keys(filters).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get user's favorite properties
 */
export function useFavoriteProperties() {
  return useQuery({
    queryKey: propertyKeys.favorites(),
    queryFn: propertyQueries.getFavoriteProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get property statistics
 */
export function usePropertyStats() {
  return useQuery({
    queryKey: propertyKeys.stats(),
    queryFn: propertyQueries.getPropertyStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get property listing types
 */
export function useListingTypes() {
  return useQuery({
    queryKey: ['property-listing-types'],
    queryFn: listingTypeApi.getListingTypes,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get user's properties with filters (authenticated)
 */
export function useMyProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['my-properties', filters],
    queryFn: () => propertyApi.getMyProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}