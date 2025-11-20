/**
 * Point Query Hooks
 * 
 * TanStack Query hooks for point operations.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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
 * Get point transactions (regular query with pagination)
 */
export function usePointTransactions(params?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: pointKeys.transactions(params),
    queryFn: () => pointQueries.getPointTransactions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get point transactions with infinite scroll
 */
export function usePointTransactionsInfinite(perPage: number = 10) {
  return useInfiniteQuery({
    queryKey: pointKeys.transactionsInfinite(perPage),
    queryFn: ({ pageParam = 1 }) => {
      return pointQueries.getPointTransactions({
        page: pageParam,
        per_page: perPage,
      });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (pagination?.has_more_pages) {
        return pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

