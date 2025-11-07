/**
 * Notification Mutation Hooks
 * 
 * TanStack Query mutation hooks for notification operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/services/api/notifications';
import { notificationKeys } from '@/services/queries/notifications';
import { useAuthStore } from '@/stores/authStore';
import { authKeys } from '@/services/queries/auth';
import { toast } from 'sonner';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Mark notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      // Update profile unread count optimistically (decrease by 1)
      const user = useAuthStore.getState().user;
      if (user && user.unread_notification_count !== undefined && user.unread_notification_count > 0) {
        useAuthStore.getState().updateUser({
          unread_notification_count: Math.max(0, user.unread_notification_count - 1)
        });
      }
      
      // Invalidate and refetch notifications list and profile
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.all,
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: authKeys.profile(),
        refetchType: 'active'
      });
    },
    onError: (error: any) => {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      // Update profile unread count optimistically (set to 0)
      useAuthStore.getState().updateUser({
        unread_notification_count: 0
      });
      
      // Invalidate and refetch notifications list and profile
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.all,
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: authKeys.profile(),
        refetchType: 'active'
      });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', error);
    },
  });
}

/**
 * Delete/dismiss a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => notificationApi.deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      // Get current notifications to check if dismissed one was unread
      const notificationsData = queryClient.getQueryData(notificationKeys.list({ per_page: 30 }));
      const notifications = (notificationsData as any)?.data?.data?.data || [];
      const dismissedNotification = notifications.find((n: any) => n.id === notificationId);
      const wasUnread = dismissedNotification?.is_read === 0;
      
      // Update profile unread count optimistically if dismissed notification was unread
      if (wasUnread) {
        const user = useAuthStore.getState().user;
        if (user && user.unread_notification_count !== undefined && user.unread_notification_count > 0) {
          useAuthStore.getState().updateUser({
            unread_notification_count: Math.max(0, user.unread_notification_count - 1)
          });
        }
      }
      
      return { wasUnread };
    },
    onSuccess: async (_, __, context) => {
      // Invalidate and refetch to ensure consistency
      await queryClient.invalidateQueries({ 
        queryKey: notificationKeys.all,
        refetchType: 'active'
      });
      await queryClient.invalidateQueries({ 
        queryKey: authKeys.profile(),
        refetchType: 'active'
      });
    },
    onError: (error: any, __, context) => {
      // Rollback optimistic update on error
      if (context?.wasUnread) {
        const user = useAuthStore.getState().user;
        if (user && user.unread_notification_count !== undefined) {
          useAuthStore.getState().updateUser({
            unread_notification_count: (user.unread_notification_count || 0) + 1
          });
        }
      }
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', error);
    },
  });
}

/**
 * Clear all notifications
 */
export function useClearAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.clearAll(),
    onSuccess: () => {
      // Update profile unread count optimistically (set to 0)
      useAuthStore.getState().updateUser({
        unread_notification_count: 0
      });
      
      // Invalidate and refetch notifications list and profile
      queryClient.invalidateQueries({ 
        queryKey: notificationKeys.all,
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: authKeys.profile(),
        refetchType: 'active'
      });
      toast.success('All notifications cleared');
    },
    onError: (error: any) => {
      toast.error('Failed to clear all notifications');
      console.error('Error clearing all notifications:', error);
    },
  });
}

