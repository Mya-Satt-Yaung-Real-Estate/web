/**
 * Wanting List Query Hooks
 * 
 * TanStack Query hooks for wanting list operations.
 */

import { useQuery } from '@tanstack/react-query';
import { wantingListQueries } from '../../services/queries/wantingList';
import type { WantingListFilters } from '@/types/wantingList';

// ============================================================================
// AUTHENTICATED USER WANTING LISTS
// ============================================================================

/**
 * Get user's wanting lists with filters (authenticated)
 */
export function useWantingLists(filters: WantingListFilters = {}) {
  return useQuery(wantingListQueries.getUserLists(filters));
}

/**
 * Get a single wanting list by slug (authenticated)
 */
export function useWantingList(slug: string) {
  return useQuery(wantingListQueries.getWantingListBySlug(slug));
}

/**
 * Get wanting list statistics (authenticated)
 */
export function useWantingListStatistics() {
  return useQuery(wantingListQueries.getStatistics());
}

// ============================================================================
// PUBLIC WANTING LISTS
// ============================================================================

/**
 * Get public wanting lists (no auth required)
 */
export function usePublicWantingLists(filters: Omit<WantingListFilters, 'verification_status'> = {}) {
  return useQuery(wantingListQueries.getPublicLists(filters));
}

/**
 * Get a single public wanting list by slug (no auth required)
 */
export function usePublicWantingList(slug: string) {
  return useQuery(wantingListQueries.getPublicWantingListBySlug(slug));
}

/**
 * Get public wanting list statistics (no auth required)
 */
export function usePublicWantingListStatistics() {
  return useQuery(wantingListQueries.getPublicStatistics());
}

// ============================================================================
// RE-EXPORT QUERY KEYS FOR EXTERNAL USE
// ============================================================================

export { wantingListKeys } from '../../services/queries/wantingList';
