import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wantingListApi } from '@/services/api/wantingList';
import { wantingListKeys } from '@/services/queries/wantingList';
import type { WantingListCreateData, WantingListUpdateData } from '@/types/wantingList';
import { toast } from 'sonner';

export const useCreateWantingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WantingListCreateData) => wantingListApi.createList(data),
    onSuccess: () => {
      // Invalidate and refetch wanting lists
      queryClient.invalidateQueries({ queryKey: wantingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.statistics() });
      
      toast.success('Wanted listing created successfully!');
    },
    onError: (error: any) => {
      console.error('Create wanting list failed:', error);
      toast.error(error?.message || 'Failed to create wanted listing');
    },
  });
};

export const useUpdateWantingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: WantingListUpdateData }) => 
      wantingListApi.updateList(slug, data),
    onSuccess: (_, { slug }) => {
      // Invalidate and refetch wanting lists
      queryClient.invalidateQueries({ queryKey: wantingListKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: wantingListKeys.statistics() });
      
      toast.success('Wanted listing updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update wanting list failed:', error);
      toast.error(error?.message || 'Failed to update wanted listing');
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
      
      toast.success('Wanted listing deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete wanting list failed:', error);
      toast.error(error?.message || 'Failed to delete wanted listing');
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
      
      toast.success('Wanted listing status updated successfully!');
    },
    onError: (error: any) => {
      console.error('Toggle wanting list status failed:', error);
      toast.error(error?.message || 'Failed to update wanted listing status');
    },
  });
};
