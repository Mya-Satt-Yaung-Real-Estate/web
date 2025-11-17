/**
 * Notification Query Hooks
 * 
 * TanStack Query hooks for notification operations.
 */

import { useQuery } from '@tanstack/react-query';
import { notificationKeys, notificationQueries } from '@/services/queries/notifications';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get user's notifications
 */
export function useNotifications(params?: { per_page?: number; page?: number; filter?: string }) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationQueries.getNotifications(params),
    staleTime: 0, // Always consider stale to allow refetching on mutations
    refetchOnWindowFocus: true,
    refetchOnMount: 'always', // Always refetch when component mounts to get fresh data
  });
}

