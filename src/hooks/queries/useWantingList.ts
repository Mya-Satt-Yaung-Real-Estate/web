/**
 * Wanting List Query Hooks
 * 
 * TanStack Query hooks for wanting list operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wantingListQueries, wantingListKeys } from '../../services/queries/wantingList';
import { wantingListApi } from '../../services/api/wantingList';
import type { WantingListFilters, WantingListCreateData, WantingListUpdateData } from '@/types/wantingList';

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
// MUTATIONS
// ============================================================================

/**
 * Create a new wanting list (authenticated)
 */
export function useCreateWantingList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WantingListCreateData) => wantingListApi.createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wantingListKeys.all });
    },
  });
}

/**
 * Update a wanting list (authenticated)
 */
export function useUpdateWantingList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: WantingListUpdateData }) => 
      wantingListApi.updateList(slug, data),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: wantingListKeys.all });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.detail(slug) });
    },
  });
}

/**
 * Delete a wanting list (authenticated)
 */
export function useDeleteWantingList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (slug: string) => wantingListApi.deleteList(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wantingListKeys.all });
    },
  });
}

/**
 * Toggle wanting list status (authenticated)
 */
export function useToggleWantingListStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (slug: string) => wantingListApi.toggleStatus(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: wantingListKeys.all });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.detail(slug) });
    },
  });
}

// ============================================================================
// RE-EXPORT QUERY KEYS FOR EXTERNAL USE
// ============================================================================

export { wantingListKeys } from '../../services/queries/wantingList';
