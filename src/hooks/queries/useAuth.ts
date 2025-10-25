/**
 * Auth Query Hooks
 * 
 * TanStack Query hooks for authentication operations.
 */

import { useQuery } from '@tanstack/react-query';
import { authKeys, authQueries } from '@/services/queries/auth';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authQueries.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on auth errors
  });
}