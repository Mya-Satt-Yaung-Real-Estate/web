/**
 * Point Query Definitions
 * 
 * TanStack Query definitions for point operations.
 */

import { pointApi } from '../api/points';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const pointKeys = {
  all: ['points'] as const,
  packages: () => [...pointKeys.all, 'packages'] as const,
  fifo: () => [...pointKeys.all, 'fifo'] as const,
  transactions: (params?: { per_page?: number; page?: number }) => 
    [...pointKeys.all, 'transactions', params] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const pointQueries = {
  /**
   * Get point packages with balance and recent transactions
   */
  getPointPackages: () => {
    return pointApi.getPointPackages();
  },

  /**
   * Get FIFO point allocations
   */
  getPointFifo: () => {
    return pointApi.getPointFifo();
  },

  /**
   * Get point transactions
   */
  getPointTransactions: (params?: { per_page?: number; page?: number }) => {
    return pointApi.getPointTransactions(params);
  },
};

