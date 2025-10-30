/**
 * Advertisement Query Keys and Functions
 * 
 * TanStack Query definitions for advertisement operations.
 */

import { advertisementApi } from '../api/advertisement';
import type { AdvertisementFilters } from '@/types/advertisement';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const advertisementKeys = {
  all: ['advertisement'] as const,
  lists: () => [...advertisementKeys.all, 'list'] as const,
  list: (filters: AdvertisementFilters) => [...advertisementKeys.lists(), filters] as const,
  details: () => [...advertisementKeys.all, 'detail'] as const,
  detail: (id: number) => [...advertisementKeys.details(), id] as const,
  categories: () => [...advertisementKeys.all, 'categories'] as const,
  stats: () => [...advertisementKeys.all, 'stats'] as const,
};

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const advertisementQueries = {
  /**
   * Get user's advertisements with filters (authenticated)
   */
  getUserAdvertisements: (filters: AdvertisementFilters = {}) => ({
    queryKey: advertisementKeys.list(filters),
    queryFn: () => advertisementApi.getUserAdvertisements(filters),
    placeholderData: (previousData: any) => previousData,
  }),

  /**
   * Get a single advertisement by ID (authenticated)
   */
  getAdvertisementById: (id: number) => ({
    queryKey: advertisementKeys.detail(id),
    queryFn: () => advertisementApi.getAdvertisement(id),
    enabled: !!id,
  }),

  /**
   * Get advertisement categories
   */
  getAdvertisementCategories: () => ({
    queryKey: advertisementKeys.categories(),
    queryFn: () => advertisementApi.getAdvertisementCategories(),
  }),

  /**
   * Get advertisement statistics (authenticated)
   */
  getAdvertisementStats: () => ({
    queryKey: advertisementKeys.stats(),
    queryFn: () => advertisementApi.getAdvertisementStats(),
  }),
};

