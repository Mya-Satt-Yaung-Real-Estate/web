import { useMutation, useQueryClient } from '@tanstack/react-query';
import { advertisementApi } from '@/services/api/advertisement';
import { advertisementKeys } from '@/services/queries/advertisement';
import type { CreateAdvertisementData } from '@/types/advertisement';

/**
 * Create advertisement mutation hook
 */
export const useCreateAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdvertisementData) => advertisementApi.createAdvertisement(data),
    onSuccess: () => {
      // Invalidate and refetch advertisements list
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.stats() });
    },
  });
};

/**
 * Update advertisement mutation hook
 */
export const useUpdateAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateAdvertisementData }) =>
      advertisementApi.updateAdvertisement(id, data),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: advertisementKeys.stats() });
    },
  });
};

