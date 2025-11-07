# Notification Count Implementation Guide

## Overview
This document outlines the recommended approach for managing notification count that supports real-time push notifications.

## ✅ Frontend Implementation (COMPLETED)

### 1. Created `useNotificationCount` Hook
- Location: `/web/src/hooks/queries/useNotificationCount.ts`
- Gets count from user profile (efficient, no extra API call)
- Falls back to calculating from notifications list if profile count not available

### 2. Updated NotificationDropdown
- Now uses `useNotificationCount()` to get count from profile
- Falls back to calculating from list if profile count unavailable
- Optimistic updates implemented for immediate UI feedback

### 3. Updated Mutation Hooks
- All mutations (mark as read, mark all read, dismiss) now:
  - Update profile count optimistically
  - Invalidate profile query to refetch from server
  - Handle rollback on errors

### 4. Updated TypeScript Types
- Added `unread_notification_count?: number` to `ExtendedUser` interface

## 🔧 Backend Implementation (REQUIRED)

### Step 1: Add `unread_notification_count` to Profile API Response

**File**: `api/app/Http/Controllers/Api/V1/Frontend/ProfileController.php`

Update both `getIndividualProfile()` and `getCompanyProfile()` methods:

```php
private function getIndividualProfile($user): array
{
    // ... existing code ...
    
    return [
        'user_id' => $user->id,
        'name' => $user->name,
        // ... other fields ...
        'unread_notification_count' => $user->unreadNotifications()->count(), // ADD THIS
    ];
}

private function getCompanyProfile($user): array
{
    // ... existing code ...
    
    return [
        // ... existing fields ...
        'unread_notification_count' => $user->unreadNotifications()->count(), // ADD THIS
    ];
}
```

**Note**: The `User` model already has `unreadNotifications()` relationship, so this should work immediately.

### Step 2: Update Notification Mutations to Invalidate Profile Cache

When notifications are created/updated/deleted, consider invalidating the profile cache on the backend (optional, frontend handles this).

## 🚀 Real-Time Push Notification Integration (FUTURE)

### Recommended Approach:

1. **WebSocket/SSE Connection**
   - Establish connection when user logs in
   - Listen for `notification.created` events

2. **Update Count on Push Notification**
   ```typescript
   // When push notification arrives
   useAuthStore.getState().updateUser({
     unread_notification_count: (currentCount || 0) + 1
   });
   ```

3. **Update Count on Actions**
   - Already implemented in mutation hooks
   - Count updates optimistically, then syncs with server

### Benefits of This Approach:

✅ **Efficient**: No need to fetch all notifications just for count  
✅ **Real-time Ready**: Easy to update count when push notifications arrive  
✅ **Optimistic Updates**: Immediate UI feedback  
✅ **Consistent**: Single source of truth (profile API)  
✅ **Scalable**: Works well with WebSocket/SSE for real-time updates  

## 📝 Summary

**Current Status:**
- ✅ Frontend ready to use `unread_notification_count` from profile
- ✅ Optimistic updates implemented
- ✅ Fallback to calculated count if profile count unavailable
- ⏳ Backend needs to add `unread_notification_count` to profile response

**Next Steps:**
1. Add `unread_notification_count` to profile API (backend)
2. Test notification count updates
3. Integrate real-time push notifications (future)

