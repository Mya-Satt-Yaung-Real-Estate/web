/**
 * Review Mutation Hooks
 * 
 * TanStack Query mutation hooks for review operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/services/api/reviews';
import { reviewKeys } from '@/services/queries/reviews';
import type { CreateReviewRequest } from '@/types/reviews';

/**
 * Create review mutation hook
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewApi.createReview(data),
    onSuccess: () => {
      // Invalidate and refetch reviews list
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.infinite() });
    },
  });
};

