import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wantingListApi } from '@/services/api/wantingList';
import { wantingListKeys } from '@/services/queries/wantingList';
import type { WantingListCreateData, WantingListUpdateData } from '@/types/wantingList';

export const useCreateWantingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WantingListCreateData) => wantingListApi.createList(data),
    onSuccess: (response) => {
      // Invalidate and refetch wanting lists
      queryClient.invalidateQueries({ queryKey: wantingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.statistics() });
      
      // Return response for component to use
      return response;
    },
  });
};

export const useUpdateWantingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: WantingListUpdateData }) => 
      wantingListApi.updateList(slug, data),
    onSuccess: (response, { slug }) => {
      // Invalidate and refetch wanting lists
      queryClient.invalidateQueries({ queryKey: wantingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.statistics() });
      
      // Return response for component to use
      return response;
    },
  });
};

export const useDeleteWantingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => wantingListApi.deleteList(slug),
    onSuccess: () => {
      // Invalidate and refetch wanting lists
      queryClient.invalidateQueries({ queryKey: wantingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.statistics() });
    },
  });
};

export const useToggleWantingListStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => wantingListApi.toggleStatus(slug),
    onSuccess: (_, slug) => {
      // Invalidate and refetch wanting lists
      queryClient.invalidateQueries({ queryKey: wantingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.statistics() });
    },
  });
};
