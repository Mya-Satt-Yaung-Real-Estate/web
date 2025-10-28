/**
 * Wanting List Query Keys and Functions
 * 
 * TanStack Query definitions for wanting list operations.
 */

import { wantingListApi } from '../api/wantingList';
import type { WantingListFilters, WantingListCreateData, WantingListUpdateData } from '@/types/wantingList';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const wantingListKeys = {
  all: ['wantingList'] as const,
  lists: () => [...wantingListKeys.all, 'list'] as const,
  list: (filters: WantingListFilters) => [...wantingListKeys.lists(), filters] as const,
  details: () => [...wantingListKeys.all, 'detail'] as const,
  detail: (slug: string) => [...wantingListKeys.details(), slug] as const,
  statistics: () => [...wantingListKeys.all, 'statistics'] as const,
  public: {
    all: ['publicWantingList'] as const,
    lists: () => [...wantingListKeys.public.all, 'list'] as const,
    list: (filters: Omit<WantingListFilters, 'verification_status'>) => [...wantingListKeys.public.lists(), filters] as const,
    details: () => [...wantingListKeys.public.all, 'detail'] as const,
    detail: (slug: string) => [...wantingListKeys.public.details(), slug] as const,
    statistics: () => [...wantingListKeys.public.all, 'statistics'] as const,
  }
};

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const wantingListQueries = {
  /**
   * Get user's wanting lists with filters (authenticated)
   */
  getUserLists: (filters: WantingListFilters = {}) => ({
    queryKey: wantingListKeys.list(filters),
    queryFn: () => wantingListApi.getUserLists(filters),
    placeholderData: (previousData: any) => previousData,
  }),

  /**
   * Get a single wanting list by slug (authenticated)
   */
  getWantingListBySlug: (slug: string) => ({
    queryKey: wantingListKeys.detail(slug),
    queryFn: () => wantingListApi.getList(slug),
    enabled: !!slug,
  }),

  /**
   * Get wanting list statistics (authenticated)
   */
  getStatistics: () => ({
    queryKey: wantingListKeys.statistics(),
    queryFn: () => wantingListApi.getStatistics(),
  }),

  /**
   * Get public wanting lists (no auth required)
   */
  getPublicLists: (filters: Omit<WantingListFilters, 'verification_status'> = {}) => ({
    queryKey: wantingListKeys.public.list(filters),
    queryFn: () => wantingListApi.getPublicLists(filters),
    placeholderData: (previousData: any) => previousData,
  }),

  /**
   * Get a single public wanting list by slug (no auth required)
   */
  getPublicWantingListBySlug: (slug: string) => ({
    queryKey: wantingListKeys.public.detail(slug),
    queryFn: () => wantingListApi.getPublicList(slug),
    enabled: !!slug,
  }),

  /**
   * Get public wanting list statistics (no auth required)
   */
  getPublicStatistics: () => ({
    queryKey: wantingListKeys.public.statistics(),
    queryFn: () => wantingListApi.getPublicStatistics(),
  }),
};

// ============================================================================
// MUTATION FUNCTIONS
// ============================================================================

export const wantingListMutations = {
  /**
   * Create a new wanting list (authenticated)
   */
  createList: (data: WantingListCreateData) => ({
    mutationFn: () => wantingListApi.createList(data),
  }),

  /**
   * Update a wanting list (authenticated)
   */
  updateList: (slug: string, data: WantingListUpdateData) => ({
    mutationFn: () => wantingListApi.updateList(slug, data),
  }),

  /**
   * Delete a wanting list (authenticated)
   */
  deleteList: (slug: string) => ({
    mutationFn: () => wantingListApi.deleteList(slug),
  }),

  /**
   * Toggle wanting list status (authenticated)
   */
  toggleStatus: (slug: string) => ({
    mutationFn: () => wantingListApi.toggleStatus(slug),
  }),
};

