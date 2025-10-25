/**
 * Legacy Team Query Hooks
 * 
 * TanStack Query hooks for legacy team operations.
 */

import { useQuery } from '@tanstack/react-query';
import { legacyQueries } from '../../services/queries/legacy';

// ============================================================================
// LEGACY TEAM QUERIES
// ============================================================================

/**
 * Get legacy team members
 */
export function useLegacyTeam() {
  return useQuery(legacyQueries.getLegacyTeam());
}

/**
 * Get legacy team member by slug
 */
export function useLegacyTeamMember(slug: string) {
  return useQuery(legacyQueries.getLegacyTeamBySlug(slug));
}
