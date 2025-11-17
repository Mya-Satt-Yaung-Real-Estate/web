import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/queries/useNotifications';
import { useNotificationCount } from '@/hooks/queries/useNotificationCount';
import { 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead, 
  useDeleteNotification,
  useClearAllNotifications
} from '@/hooks/mutations/useNotificationMutations';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Notification as ApiNotification } from '@/services/api/notifications';

export function NotificationDropdown() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Fetch notifications from API
  const { data: notificationsResponse, isLoading, refetch } = useNotifications({ per_page: 30 });
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const clearAllMutation = useClearAllNotifications();
  const { isOpen, options, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();
  
  // Get unread count from profile (more efficient)
  // Fallback to calculating from notifications list if profile count not available
  const profileUnreadCount = useNotificationCount();
  const notifications = notificationsResponse?.data?.data || [];
  const calculatedUnreadCount = notifications.filter((n: ApiNotification) => n.is_read === 0).length;
  // Use profile count if available (not undefined/null), otherwise calculate from list
  const unreadCount = profileUnreadCount !== undefined && profileUnreadCount !== null 
    ? profileUnreadCount 
    : calculatedUnreadCount;

  const getNotificationIcon = (type: string) => {
    // Use category if available, otherwise use type
    const notificationType = type;
    
    switch (notificationType) {
      case 'announcement':
        return '📢';
      case 'new_property':
        return '🏠';
      case 'property_approve':
        return '✅';
      case 'appointment_rescheduled':
        return '🔄';
      case 'property_reject':
        return '❌';
      case 'advertisement_approved':
        return '✅';
      case 'new_advertisement':
        return '📰';
      case 'property_comment_reply':
        return '💬';
      case 'new_housing_event':
        return '🎉';
      default:
        return '📬';
    }
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDismiss = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };

  const getNotificationDetailUrl = (notification: ApiNotification): string | null => {
    const notificationType = notification.type;
    const referenceSlug = notification.reference_slug;
    const referenceId = notification.reference_id;

    // Property-related notifications that go to my property detail page
    if (notificationType === 'property_reject' || notificationType === 'property_approve') {
      if (!referenceSlug) {
        return null; // Can't navigate without slug
      }
      return `/my-properties/${referenceSlug}`;
    }

    // Property-related notifications that go to public property detail page
    if (notificationType === 'new_property' || 
        notificationType === 'property_comment_reply' || 
        notificationType === 'property_comment_create') {
      if (!referenceSlug) {
        return null; // Can't navigate without slug
      }
      return `/properties/${referenceSlug}`;
    }

    // Point purchase request approved goes to profile page
    if (notificationType === 'point_purchase_request_approved') {
      return '/profile';
    }

    // Housing event notifications go to public event detail page
    if (notificationType === 'new_housing_event') {
      if (!referenceSlug) {
        return null; // Can't navigate without slug
      }
      return `/events/${referenceSlug}`;
    }

    // Appointment confirmed goes to appointments list page
    if (notificationType === 'appointment_confirmed') {
      return '/appointments';
    }

    // Advertisement notifications
    if (notificationType === 'new_advertisement') {
      // Public advertisement detail uses ID, not slug
      if (!referenceId) {
        return null;
      }
      return `/advertisements/${referenceId}`;
    }

    if (notificationType === 'advertisement_approved') {
      // My advertisement detail uses ID, not slug
      if (!referenceId) {
        return null;
      }
      return `/advertisements/detail/${referenceId}`;
    }

    return null;
  };

  const handleViewDetail = (notification: ApiNotification, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Mark notification as read if it's unread
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    
    const url = getNotificationDetailUrl(notification);
    if (url) {
      navigate(url);
      setDropdownOpen(false);
    }
  };

  const handleClearAll = () => {
    // Close dropdown when opening modal
    setDropdownOpen(false);
    showConfirm({
      title: t('notifications.clearAllTitle') || 'Clear All Notifications',
      message: t('notifications.clearAllMessage') || 'Are you sure you want to clear all notifications? This action cannot be undone.',
      confirmText: t('notifications.clearAll') || 'Clear All',
      cancelText: t('common.cancel') || 'Cancel',
      onConfirm: async () => {
        await clearAllMutation.mutateAsync();
      },
    });
  };

  // Refetch notifications when dropdown opens to ensure fresh data
  useEffect(() => {
    if (dropdownOpen) {
      refetch();
    }
  }, [dropdownOpen, refetch]);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl hover:bg-primary/10 transition-all group"
        >
          <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 bg-white">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h6 className="font-semibold">{t('notifications.title') || 'Notifications'}</h6>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="h-auto py-1 px-2"
            >
              {t('notifications.markAllRead') || 'Mark all read'}
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification: ApiNotification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors ${
                    !notification.is_read 
                      ? 'bg-primary/10 hover:bg-primary/20' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="mb-1 text-sm font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mb-2 whitespace-normal break-words">
                            {notification.body}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {notification.time_ago}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="h-7 px-2"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {t('notifications.markRead') || 'Mark read'}
                          </Button>
                        )}
                        {getNotificationDetailUrl(notification) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleViewDetail(notification, e)}
                            className="h-7 px-2"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {t('notifications.viewDetail') || 'View Detail'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(notification.id)}
                          disabled={deleteNotificationMutation.isPending}
                          className="h-7 px-2 hover:text-red-500 hover:bg-red-50/50"
                        >
                          <X className="h-3 w-3 mr-1" />
                          {t('notifications.dismiss') || 'Dismiss'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button 
              variant="ghost" 
              className="w-full justify-center gap-2" 
              size="sm"
              onClick={handleClearAll}
              disabled={clearAllMutation.isPending}
            >
              {t('notifications.clearAll') || 'Clear All'}
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </DropdownMenuContent>
      </DropdownMenu>
      
      <ConfirmModal
        isOpen={isOpen}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        onConfirm={handleConfirm}
        onClose={hideConfirm}
        isLoading={clearAllMutation.isPending}
      />
    </>
  );
}


