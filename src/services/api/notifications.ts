/**
 * Notification API Endpoints
 * 
 * Notification-related API operations.
 */

import { api } from './client';

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  category: string;
  reference_type: string | null;
  reference_id: number | null;
  reference_slug?: string | null; // Reference slug for navigation (property, event, etc.)
  is_read: number; // 0 or 1
  created_at: string;
  time_ago: string;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: Notification[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ============================================================================
// NOTIFICATION API FUNCTIONS
// ============================================================================

export const notificationApi = {
  /**
   * Get user's notifications (authenticated)
   */
  getNotifications: (params?: { per_page?: number; page?: number; filter?: string }) => {
    return api.get<NotificationListResponse>('/api/v1/frontend/notifications', {
      params,
    });
  },

  /**
   * Mark notification as read
   */
  markAsRead: (notificationId: number) => {
    return api.patch<NotificationResponse>(`/api/v1/frontend/notifications/${notificationId}/mark-read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: () => {
    return api.patch<NotificationResponse>('/api/v1/frontend/notifications/mark-all-read');
  },

  /**
   * Delete/dismiss a notification
   */
  deleteNotification: (notificationId: number) => {
    return api.delete<NotificationResponse>(`/api/v1/frontend/notifications/${notificationId}`);
  },

  /**
   * Clear all notifications
   */
  clearAll: () => {
    return api.delete<NotificationResponse>('/api/v1/frontend/notifications/clear-all');
  },
};

