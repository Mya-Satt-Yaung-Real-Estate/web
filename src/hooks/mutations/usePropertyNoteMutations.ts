import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyNoteApi } from '@/services/api/propertyNote';
import { propertyNoteKeys } from '@/services/queries/propertyNote';
import type { PropertyNoteCreateData, PropertyNoteUpdateData } from '@/types/propertyNote';

export function useUnlockPropertyNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => propertyNoteApi.unlock(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.access() });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.all });
    },
  });
}

export function useCreatePropertyNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PropertyNoteCreateData) => propertyNoteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.maps() });
    },
  });
}

export function useUpdatePropertyNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PropertyNoteUpdateData }) =>
      propertyNoteApi.update(id, data),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.maps() });
    },
  });
}

export function useUpdatePropertyNoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'sold' | 'rented' }) =>
      propertyNoteApi.updateStatus(id, status),
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.maps() });
    },
  });
}

export function useDeletePropertyNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => propertyNoteApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyNoteKeys.maps() });
    },
  });
}
