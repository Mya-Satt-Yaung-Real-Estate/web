/**
 * Profile Broadcast Listener
 * 
 * Component that subscribes to profile updates via Echo
 * This component doesn't render anything, it just sets up the subscription
 */

import { useProfileBroadcast } from '@/hooks/useProfileBroadcast';

export function ProfileBroadcastListener() {
  useProfileBroadcast();
  return null;
}

