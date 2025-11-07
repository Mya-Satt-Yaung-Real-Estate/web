/**
 * Notification Count Hook
 * 
 * Gets unread notification count from user profile.
 * This is more efficient than fetching all notifications just for the count.
 */

import { useAuthStore } from '@/stores/authStore';

/**
 * Get unread notification count from user profile
 * Returns 0 if user is not authenticated or count is not available
 */
export function useNotificationCount(): number {
  const user = useAuthStore((state) => state.user);
  
  // Return count from profile if available, otherwise 0
  return user?.unread_notification_count ?? 0;
}

