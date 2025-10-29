/**
 * Cache Utilities
 * 
 * Centralized utilities for managing React Query cache clearing
 * to prevent data leakage between different user sessions.
 */

import { queryClient } from '@/providers/QueryProvider';
import { wantingListKeys } from '@/services/queries/wantingList';
import { appointmentKeys } from '@/services/queries/appointment';
import { authKeys } from '@/services/queries/auth';
import { propertyKeys } from '@/services/queries/properties';

/**
 * Clear all user-specific queries from the cache
 * This should be called when:
 * - User logs out
 * - User logs in (to ensure fresh data)
 * - Authentication state changes
 */
export const clearUserSpecificCache = () => {
  // Clear wanting list queries
  queryClient.removeQueries({ queryKey: wantingListKeys.all });
  queryClient.removeQueries({ queryKey: wantingListKeys.public.all });
  
  // Clear appointment queries
  queryClient.removeQueries({ queryKey: appointmentKeys.all });
  
  // Clear auth profile queries
  queryClient.removeQueries({ queryKey: authKeys.all });
  
  // Clear property favorites and user-specific queries
  queryClient.removeQueries({ queryKey: propertyKeys.favorites() });
  queryClient.removeQueries({ queryKey: propertyKeys.stats() });
  
  // Clear all queries to ensure no data leakage
  // This is the most comprehensive approach
  queryClient.clear();
};

/**
 * Clear only specific user data without clearing public data
 * This is a more targeted approach for login scenarios
 */
export const clearUserDataOnly = () => {
  // Clear wanting list queries (user-specific)
  queryClient.removeQueries({ queryKey: wantingListKeys.all });
  
  // Clear appointment queries (user-specific)
  queryClient.removeQueries({ queryKey: appointmentKeys.all });
  
  // Clear auth profile queries
  queryClient.removeQueries({ queryKey: authKeys.all });
  
  // Clear property favorites and user-specific queries
  queryClient.removeQueries({ queryKey: propertyKeys.favorites() });
  queryClient.removeQueries({ queryKey: propertyKeys.stats() });
};

/**
 * Invalidate user-specific queries to trigger refetch
 * This is useful when user data might have changed
 */
export const invalidateUserData = () => {
  // Invalidate wanting list queries
  queryClient.invalidateQueries({ queryKey: wantingListKeys.all });
  
  // Invalidate appointment queries
  queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
  
  // Invalidate auth profile queries
  queryClient.invalidateQueries({ queryKey: authKeys.all });
  
  // Invalidate property favorites
  queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() });
  queryClient.invalidateQueries({ queryKey: propertyKeys.stats() });
};
