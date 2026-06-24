import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { authKeys } from '@/services/queries/auth';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useModal();
  const { t } = useLanguage();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email?: string | null;
      phone: string;
      media_id?: number | null;
      cover_media_id?: number | null;
      company_name?: string;
      company_type_id?: number;
      address?: string;
      region_id?: number;
      township_id?: number;
      description?: string;
    }) => {
      const payload: any = {
        name: data.name,
        email: data.email && data.email.trim() !== '' ? data.email : null,
        phone: data.phone,
        ...(data.media_id && { media_id: data.media_id }),
        ...(data.cover_media_id !== undefined && { cover_media_id: data.cover_media_id }),
        ...(data.company_name && { company_name: data.company_name }),
        ...(data.company_type_id && { company_type_id: data.company_type_id }),
        ...(data.address && { address: data.address }),
        ...(data.region_id && { region_id: data.region_id }),
        ...(data.township_id && { township_id: data.township_id }),
        ...(data.description && { description: data.description }),
      };
      const response = await authApi.updateProfile(payload);
      return response;
    },
    onSuccess: (response) => {
      // Update user in auth store
      if (response.data) {
        setUser(response.data);
      }
      
      // Invalidate profile query
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      
      showSuccess(t('profile.updateSuccess') || 'Profile updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('profile.updateError') || 'Failed to update profile';
      showError(errorMessage);
    },
  });
}

