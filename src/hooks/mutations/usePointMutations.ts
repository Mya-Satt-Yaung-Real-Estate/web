/**
 * Point Mutation Hooks
 * 
 * TanStack Query mutation hooks for point operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pointApi } from '@/services/api/points';
import { pointKeys } from '@/services/queries/points';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Purchase point package mutation
 */
export function usePurchasePoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageId: number) => pointApi.purchasePointPackage(packageId),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: pointKeys.packages() });
      queryClient.invalidateQueries({ queryKey: pointKeys.fifo() });
    },
    onError: (error) => {
      console.error('Purchase points failed:', error);
    },
  });
}

