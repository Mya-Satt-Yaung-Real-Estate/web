/**
 * Auth Query Definitions
 * 
 * TanStack Query definitions for authentication operations.
 */

import { authApi } from '../api/auth';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get current user profile
 */
export const authQueries = {
  /**
   * Get current user profile
   */
  getProfile: () => {
    return authApi.getProfile();
  },
};
