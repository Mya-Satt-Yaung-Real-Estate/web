import { useEffect, useState } from 'react';
import { authApi } from '@/services/api/auth';
import { useAuthStore } from '@/stores/authStore';

let syncPromise: Promise<void> | null = null;
let lastSyncedAt = 0;
const SYNC_TTL_MS = 60_000;

async function refreshAuthProfileFlags(): Promise<void> {
  const now = Date.now();
  if (syncPromise) return syncPromise;
  if (now - lastSyncedAt < SYNC_TTL_MS) return;

  syncPromise = (async () => {
    try {
      const profile = await authApi.getProfile();
      const raw =
        profile && typeof profile === 'object' && 'data' in profile
          ? (profile as { data: unknown }).data
          : profile;
      const userData =
        raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : null;

      if (userData) {
        useAuthStore.getState().updateUser({
          is_property_note_approver: Boolean(userData.is_property_note_approver),
          property_note_access: Boolean(userData.property_note_access),
          current_point:
            typeof userData.current_point === 'number'
              ? userData.current_point
              : undefined,
          points:
            typeof userData.current_point === 'number'
              ? userData.current_point
              : undefined,
          point_balance:
            typeof userData.current_point === 'number'
              ? userData.current_point
              : undefined,
        });
      }
      lastSyncedAt = Date.now();
    } finally {
      syncPromise = null;
    }
  })();

  return syncPromise;
}

/**
 * Refresh approver / access flags from profile after admin config changes
 * without forcing a full re-login. Shared + throttled across callers.
 */
export function useSyncAuthProfileFlags(enabled = true): { isSynced: boolean } {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isSynced, setIsSynced] = useState(() => {
    if (!enabled || !isAuthenticated) return true;
    return Date.now() - lastSyncedAt < SYNC_TTL_MS;
  });

  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      setIsSynced(true);
      return;
    }

    let cancelled = false;

    if (Date.now() - lastSyncedAt < SYNC_TTL_MS) {
      setIsSynced(true);
      return;
    }

    setIsSynced(false);
    refreshAuthProfileFlags()
      .catch(() => {
        /**
         * Keep existing store flags if profile refresh fails.
         */
      })
      .finally(() => {
        if (!cancelled) setIsSynced(true);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, isAuthenticated]);

  return { isSynced };
}
