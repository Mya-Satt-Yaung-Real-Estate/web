/**
 * Property Mutation Hooks
 * 
 * TanStack Query mutation hooks for property operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '@/services/api/properties';
import { propertyKeys } from '@/services/queries/properties';
import type { Property } from '@/types/properties';

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create property mutation
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyApi.createProperty,
    onSuccess: () => {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

/**
 * Update property mutation
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Property> }) => 
      propertyApi.updateProperty(String(id), data),
    onSuccess: (data, variables) => {
      // Update the specific property in cache
      queryClient.setQueryData(propertyKeys.detail(String(variables.id)), data);
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

/**
 * Delete property mutation
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyApi.deleteProperty,
    onSuccess: (_, propertyId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(propertyId) });
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
}

/**
 * Add to favorites mutation
 */
export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyApi.addToFavorites,
    onSuccess: () => {
      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() });
    },
  });
}

/**
 * Remove from favorites mutation
 */
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: propertyApi.removeFromFavorites,
    onSuccess: () => {
      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() });
    },
  });
}