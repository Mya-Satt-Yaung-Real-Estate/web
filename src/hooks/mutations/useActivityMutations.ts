import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activityApi } from '@/services/api/activities';
import { activityKeys } from '@/services/queries/activities';
import type { ActivityCreateData, ActivityUpdateData } from '@/types/activity';

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityCreateData) => activityApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.ownerLists() });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ActivityUpdateData }) =>
      activityApi.update(slug, data),
    onSuccess: (_response, { slug }) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.ownerLists() });
      queryClient.invalidateQueries({ queryKey: activityKeys.ownerDetail(slug) });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => activityApi.remove(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.ownerLists() });
    },
  });
};
