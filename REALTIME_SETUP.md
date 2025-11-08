# Real-Time Profile Updates - Frontend Setup

## Overview

This document describes the real-time profile updates implementation using Laravel Echo and Pusher Channels.

## Architecture

```
┌─────────────────┐
│   Laravel API   │
│  (BroadcastService)│
└────────┬────────┘
         │
         │ Broadcasts via Pusher
         │
         ▼
┌─────────────────┐
│  Pusher Channels│
│  (WebSocket)    │
└────────┬────────┘
         │
         │ Receives events
         │
         ▼
┌─────────────────┐
│  Laravel Echo   │
│  (React Frontend)│
└────────┬────────┘
         │
         │ Updates Zustand Store
         │
         ▼
┌─────────────────┐
│  React Components│
│  (Auto Updates)  │
└─────────────────┘
```

## Files Created

### 1. Configuration
- **`src/config/echo.ts`** - Laravel Echo configuration and initialization

### 2. Context
- **`src/contexts/EchoContext.tsx`** - Echo provider for React context

### 3. Hooks
- **`src/hooks/useProfileBroadcast.ts`** - Hook to subscribe to profile channel

### 4. Components
- **`src/components/ProfileBroadcastListener.tsx`** - Component that sets up subscription

### 5. App Integration
- **`src/App.tsx`** - Updated to include EchoProvider

## How It Works

### 1. Echo Initialization
- When user logs in, `EchoProvider` initializes Laravel Echo
- Echo connects to Pusher using credentials from `.env`
- Authentication token is sent to `/broadcasting/auth` endpoint

### 2. Channel Subscription
- `ProfileBroadcastListener` component subscribes to user's private channel
- Channel name: `App.Models.User.{userId}`
- Only subscribed when user is authenticated

### 3. Event Listening
- Listens for `profile.fields.updated` event
- Event contains 3 fields:
  - `current_point`
  - `unread_notification_count`
  - `member_level`

### 4. Store Updates
- When event is received, `useProfileBroadcast` hook updates Zustand store
- Components using `useAuthStore` automatically re-render
- UI updates in real-time without page refresh

## Environment Variables

Required in `.env`:
```env
VITE_PUSHER_APP_KEY=your_pusher_key
VITE_PUSHER_APP_CLUSTER=ap1
VITE_API_BASE_URL=https://api.jadeproperty.com
```

## Usage

### Components Automatically Update

Any component using `useAuthStore` will automatically receive updates:

```tsx
import { useAuthStore } from '@/stores/authStore';

function MyComponent() {
  const { user } = useAuthStore();
  
  // This will automatically update when broadcast is received
  return <div>Points: {user?.current_point}</div>;
}
```

### Fields Updated

- `user.current_point` - Point balance
- `user.unread_notification_count` - Unread notification count
- `user.member_level` - Member level (basic/silver/gold/premium)

## Testing

### 1. Check Connection
- Open browser console
- Look for Echo connection logs
- Should see "Connected to Pusher" message

### 2. Test Broadcast
- Trigger an action that changes points (e.g., consume points)
- Check console for "Profile fields updated" log
- Verify UI updates automatically

### 3. Test Disconnection
- Log out
- Echo should disconnect
- Channel should be unsubscribed

## Troubleshooting

### Echo Not Connecting
- Check `.env` variables are set correctly
- Verify Pusher credentials are valid
- Check browser console for errors
- Verify `/broadcasting/auth` endpoint is accessible

### Events Not Received
- Check channel name matches: `App.Models.User.{userId}`
- Verify event name: `profile.fields.updated`
- Check Laravel logs for broadcast errors
- Verify user is authenticated

### UI Not Updating
- Check if component uses `useAuthStore`
- Verify store update is being called
- Check browser console for errors
- Verify Zustand store is working

## Security

- Channel is private (requires authentication)
- Only user can subscribe to their own channel
- Token is sent securely via HTTPS
- Channel authorization is handled by Laravel

## Performance

- Echo connection is established once per session
- Channel subscription happens once when user logs in
- Events are lightweight (only 3 fields)
- Store updates are optimized (only changed fields)

## Next Steps

1. Test the implementation
2. Monitor for any connection issues
3. Add error handling if needed
4. Consider adding reconnection logic
5. Add loading states if needed

