/**
 * Review Query Keys and Functions
 * 
 * TanStack Query configuration for reviews.
 */

import { reviewApi } from '../api/reviews';
import type { ReviewFilters } from '@/types/reviews';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters?: ReviewFilters) => [...reviewKeys.lists(), filters] as const,
  infinite: (filters?: ReviewFilters) => [...reviewKeys.all, 'infinite', filters] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const reviewQueries = {
  getPublicReviews: (filters?: ReviewFilters) => {
    return reviewApi.getPublicReviews(filters);
  },
};

