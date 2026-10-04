/**
 * Profile Broadcast Hook
 *
 * Subscribes to user's profile channel and listens for real-time updates
 */

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useEcho } from '@/contexts/EchoContext';
import { useAuthStore } from '@/stores/authStore';
import { propertyNoteKeys } from '@/services/queries/propertyNote';
import type { ExtendedUser } from '@/types/auth';

interface ProfileFieldsUpdatedPayload {
  user_id: number;
  fields: {
    current_point?: number;
    unread_notification_count?: number;
    member_level?: string;
    property_note_access?: boolean;
  };
  timestamp: string;
}

export function useProfileBroadcast() {
  const { echo } = useEcho();
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<NonNullable<typeof echo>['private']> | null>(null);

  useEffect(() => {
    // Only subscribe if Echo is available and user is authenticated
    if (!echo || !user?.user_id) {
      return;
    }

    // Channel name: App.Models.User.{userId}
    // Note: Laravel automatically adds 'private-' prefix for private channels
    const channelName = `App.Models.User.${user.user_id}`;

    console.log('Subscribing to channel:', channelName);

    // Subscribe to the private channel
    channelRef.current = echo.private(channelName);

    // Log subscription success
    channelRef.current.subscribed(() => {
      console.log('✅ Successfully subscribed to channel:', channelName);
    });

    // Listen for profile.fields.updated event
    // Note: When using broadcastAs(), use the event name with dot prefix
    channelRef.current.listen('.profile.fields.updated', (data: ProfileFieldsUpdatedPayload) => {
      console.log('Profile fields updated:', data);

      // Update user in store with new field values
      if (data.fields) {
        const updates: Partial<ExtendedUser> = {};

        if (data.fields.current_point !== undefined) {
          updates.current_point = data.fields.current_point;
          // Also update backward compatibility fields
          updates.point_balance = data.fields.current_point;
          updates.points = data.fields.current_point;
        }

        if (data.fields.unread_notification_count !== undefined) {
          updates.unread_notification_count = data.fields.unread_notification_count;
        }

        if (data.fields.member_level !== undefined) {
          updates.member_level = data.fields.member_level.toLowerCase();
        }

        if (data.fields.property_note_access !== undefined) {
          updates.property_note_access = Boolean(data.fields.property_note_access);
        }

        // Update the user in the store
        updateUser(updates);

        /**
         * Unlock gate uses React Query access — refetch when access flag changes.
         */
        if (data.fields.property_note_access !== undefined) {
          void queryClient.invalidateQueries({ queryKey: propertyNoteKeys.access() });
          void queryClient.invalidateQueries({ queryKey: propertyNoteKeys.all });
        }
      }
    });

    channelRef.current.listen('.payment-success', (_data: unknown) => {
      console.log('Payment event data updated:', _data);
    });

    // Handle connection errors
    channelRef.current.error((error: unknown) => {
      console.error('Echo channel error:', error);
    });

    // Cleanup: unsubscribe when component unmounts or user changes
    return () => {
      if (channelRef.current) {
        try {
          echo.leave(channelName);
          channelRef.current = null;
        } catch (error) {
          console.error('Error leaving channel:', error);
        }
      }
    };
  }, [echo, user?.user_id, updateUser, queryClient]);
}
