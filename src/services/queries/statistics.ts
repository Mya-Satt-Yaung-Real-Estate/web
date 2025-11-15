/**
 * Statistics Query Keys and Functions
 * 
 * TanStack Query keys and query functions for statistics.
 */

import { statisticsApi } from '../api/statistics';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const statisticsKeys = {
  all: ['statistics'] as const,
  counts: () => [...statisticsKeys.all, 'counts'] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const statisticsQueries = {
  getCounts: () => {
    return statisticsApi.getCounts();
  },
};

