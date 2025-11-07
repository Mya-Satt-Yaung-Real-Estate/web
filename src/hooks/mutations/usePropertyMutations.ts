/**
 * Property Mutation Hooks
 * 
 * TanStack Query mutation hooks for property operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '@/services/api/properties';
import { propertyKeys } from '@/services/queries/properties';
import { useModal } from '@/contexts/ModalContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
 * Update my property mutation by slug (authenticated)
 */
export function useUpdateMyProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: any }) => 
      propertyApi.updateMyProperty(slug, data),
    onSuccess: (data, variables) => {
      // Update the specific property in cache with the response data
      // The response should match the structure expected by useMyProperty hook
      queryClient.setQueryData(['my-property', variables.slug], data);
      // Invalidate properties list (but not the current property query to avoid refetch)
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
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

/**
 * Toggle favorite status for a property
 * Reusable hook that can be used anywhere in the app
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useModal();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: (slug: string) => propertyApi.toggleFavorite(slug),
    onSuccess: (response, slug) => {
      const isFavorited = response.data?.data?.is_favorited ?? false;
      
      // Invalidate favorites list
      queryClient.invalidateQueries({ queryKey: propertyKeys.favorites() });
      
      // Invalidate property detail to update favorite status
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(slug) });
      
      // Invalidate property lists that might show favorite status
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      
      // Show success message
      if (isFavorited) {
        showSuccess(t('properties.addedToFavorites') || 'Added to favorites');
      } else {
        showSuccess(t('properties.removedFromFavorites') || 'Removed from favorites');
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('properties.favoriteError') || 'Failed to update favorite status';
      showError(errorMessage);
    },
  });
}