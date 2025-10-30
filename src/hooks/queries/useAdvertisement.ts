/**
 * Advertisement Query Hooks
 * 
 * Custom hooks for advertisement data fetching using TanStack Query.
 */

import { useQuery } from '@tanstack/react-query';
import { advertisementQueries } from '@/services/queries/advertisement';
import type { AdvertisementFilters } from '@/types/advertisement';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get user's advertisements with filters (authenticated)
 */
export const useUserAdvertisements = (filters: AdvertisementFilters = {}) => {
  return useQuery(advertisementQueries.getUserAdvertisements(filters));
};

/**
 * Get a single advertisement by ID (authenticated)
 */
export const useAdvertisement = (id: number) => {
  return useQuery(advertisementQueries.getAdvertisementById(id));
};

/**
 * Get advertisement categories
 */
export const useAdvertisementCategories = () => {
  return useQuery(advertisementQueries.getAdvertisementCategories());
};

/**
 * Get advertisement statistics (authenticated)
 */
export const useAdvertisementStats = () => {
  return useQuery(advertisementQueries.getAdvertisementStats());
};

