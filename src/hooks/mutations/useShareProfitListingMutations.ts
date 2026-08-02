import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shareProfitListingApi } from '@/services/api/shareProfitListing';
import { shareProfitListingKeys } from '@/services/queries/shareProfitListing';
import type { ShareProfitCreateData, ShareProfitUpdateData } from '@/types/shareProfitListing';

export const useCreateShareProfitListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShareProfitCreateData) => shareProfitListingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerLists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.statistics() });
    },
  });
};

export const useUpdateShareProfitListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: ShareProfitUpdateData }) =>
      shareProfitListingApi.update(slug, data),
    onSuccess: (_response, { slug }) => {
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerLists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerDetail(slug) });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.detail(slug) });
    },
  });
};

export const useDeleteShareProfitListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => shareProfitListingApi.remove(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerLists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.lists() });
    },
  });
};

export const useToggleShareProfitListingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => shareProfitListingApi.toggleStatus(slug),
    onSuccess: (_response, slug) => {
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerLists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerDetail(slug) });
    },
  });
};

export const useRenewShareProfitListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => shareProfitListingApi.renew(slug),
    onSuccess: (_response, slug) => {
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerLists() });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerDetail(slug) });
      queryClient.invalidateQueries({ queryKey: shareProfitListingKeys.ownerStatistics() });
    },
  });
};
