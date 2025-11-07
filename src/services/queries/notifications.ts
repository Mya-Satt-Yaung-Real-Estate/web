/**
 * Notification Query Definitions
 * 
 * TanStack Query definitions for notification operations.
 */

import { notificationApi } from '../api/notifications';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: { per_page?: number; page?: number; filter?: string }) => 
    [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const notificationQueries = {
  /**
   * Get user's notifications
   */
  getNotifications: (params?: { per_page?: number; page?: number; filter?: string }) => {
    return notificationApi.getNotifications(params);
  },
};

