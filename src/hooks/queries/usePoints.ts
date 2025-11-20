/**
 * Point Query Hooks
 * 
 * TanStack Query hooks for point operations.
 */

import { useQuery } from '@tanstack/react-query';
import { pointKeys, pointQueries } from '@/services/queries/points';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get point packages with balance and recent transactions
 */
export function usePointPackages() {
  return useQuery({
    queryKey: pointKeys.packages(),
    queryFn: () => pointQueries.getPointPackages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get FIFO point allocations
 */
export function usePointFifo() {
  return useQuery({
    queryKey: pointKeys.fifo(),
    queryFn: () => pointQueries.getPointFifo(),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for balance)
    refetchOnWindowFocus: true,
  });
}

/**
 * Get point transactions
 */
export function usePointTransactions(params?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: pointKeys.transactions(params),
    queryFn: () => pointQueries.getPointTransactions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

