/**
 * Legacy Team Query Keys and Functions
 * 
 * TanStack Query definitions for legacy team operations.
 */

import { legacyApi } from '../api/legacy';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const legacyKeys = {
  all: ['legacy'] as const,
  lists: () => [...legacyKeys.all, 'list'] as const,
  list: () => [...legacyKeys.lists()] as const,
  details: () => [...legacyKeys.all, 'detail'] as const,
  detail: (slug: string) => [...legacyKeys.details(), slug] as const,
};

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const legacyQueries = {
  /**
   * Get legacy team members
   */
  getLegacyTeam: () => ({
    queryKey: legacyKeys.list(),
    queryFn: () => legacyApi.getLegacyTeam(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  }),

  /**
   * Get legacy team member by slug
   */
  getLegacyTeamBySlug: (slug: string) => ({
    queryKey: legacyKeys.detail(slug),
    queryFn: () => legacyApi.getLegacyTeamBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  }),
};
