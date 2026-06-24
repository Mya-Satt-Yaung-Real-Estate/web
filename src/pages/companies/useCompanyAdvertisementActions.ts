import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useLanguage } from '@/contexts/LanguageContext';
import { publicAdvertisementApi } from '@/services/api/publicAdvertisements';
import { companiesKeys } from '@/services/queries/companies';
import { useAuthStore } from '@/stores/authStore';
import type { Advertisement } from '@/types/advertisement';

export function useCompanyAdvertisementActions(advertisement: Advertisement, companySlug: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuthStore();

  const [isLiked, setIsLiked] = useState(advertisement.is_favorite ?? false);
  const [likeCount, setLikeCount] = useState(advertisement.stats?.favorite_count ?? 0);

  useEffect(() => {
    setIsLiked(advertisement.is_favorite ?? false);
    setLikeCount(advertisement.stats?.favorite_count ?? 0);
  }, [advertisement.is_favorite, advertisement.stats?.favorite_count]);

  const invalidateAdvertisementQueries = () => {
    if (companySlug) {
      queryClient.invalidateQueries({ queryKey: companiesKeys.advertisements(companySlug) });
    }
  };

  const toggleLikeMutation = useMutation({
    mutationFn: (id: number) => publicAdvertisementApi.toggleLike(id),
    onSuccess: (response) => {
      const liked = response.data?.data?.is_like ?? false;
      const nextCount = response.data?.data?.like_count;

      setIsLiked(liked);
      setLikeCount(prev => nextCount ?? (liked ? prev + 1 : Math.max(0, prev - 1)));
      invalidateAdvertisementQueries();
      toast.success(
        liked
          ? (t('advertisementDetail.liked') || 'Liked!')
          : (t('advertisementDetail.unliked') || 'Unliked')
      );
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (error as { message?: string })?.message
        || t('advertisementDetail.likeError')
        || 'Failed to update like';
      toast.error(message);
    },
  });

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('advertisementDetail.signInRequired') || 'Please sign in to like');
      navigate('/signin');
      return;
    }

    toggleLikeMutation.mutate(advertisement.id);
  };

  return {
    handleLike,
    isLiked,
    likeCount,
  };
}
