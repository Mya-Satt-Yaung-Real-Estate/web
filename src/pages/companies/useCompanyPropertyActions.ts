import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useLanguage } from '@/contexts/LanguageContext';
import { publicPropertyApi } from '@/services/api/publicProperties';
import { companiesKeys } from '@/services/queries/companies';
import { homeKeys } from '@/services/queries/home';
import { publicPropertyKeys } from '@/services/queries/publicProperties';
import { useAuthStore } from '@/stores/authStore';
import type { Property } from '@/types/properties';

export function useCompanyPropertyActions(property: Property, companySlug: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuthStore();

  const [isLiked, setIsLiked] = useState(property.is_liked ?? false);
  const [isFavorite, setIsFavorite] = useState(property.is_favorited ?? false);
  const [likeCount, setLikeCount] = useState(property.stats?.like_count ?? 0);
  const [favoriteCount, setFavoriteCount] = useState(property.stats?.favorite_count ?? 0);

  useEffect(() => {
    setIsLiked(property.is_liked ?? false);
    setIsFavorite(property.is_favorited ?? false);
    setLikeCount(property.stats?.like_count ?? 0);
    setFavoriteCount(property.stats?.favorite_count ?? 0);
  }, [property.is_liked, property.is_favorited, property.stats?.like_count, property.stats?.favorite_count]);

  const invalidatePropertyQueries = () => {
    queryClient.invalidateQueries({ queryKey: publicPropertyKeys.all });
    queryClient.invalidateQueries({ queryKey: homeKeys.all });
    if (companySlug) {
      queryClient.invalidateQueries({ queryKey: companiesKeys.properties(companySlug) });
    }
  };

  const toggleLikeMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleLike(slug),
    onSuccess: (response) => {
      const liked = response.data?.data?.liked ?? false;
      const nextCount = response.data?.data?.like_count;

      setIsLiked(liked);
      setLikeCount(prev => nextCount ?? (liked ? prev + 1 : Math.max(0, prev - 1)));
      invalidatePropertyQueries();
      toast.success(liked ? (t('propertyDetail.liked') || 'Liked!') : (t('propertyDetail.unliked') || 'Unliked'));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || t('propertyDetail.likeError') || 'Failed to update like');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleFavorite(slug),
    onSuccess: (response) => {
      const favorited = response.data?.data?.is_favorited ?? false;
      const nextCount = response.data?.data?.favorite_count;

      setIsFavorite(favorited);
      setFavoriteCount(prev => nextCount ?? (favorited ? prev + 1 : Math.max(0, prev - 1)));
      invalidatePropertyQueries();
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(
        favorited
          ? (t('propertyDetail.addedToFavorites') || 'Added to favorites')
          : (t('propertyDetail.removedFromFavorites') || 'Removed from favorites')
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || t('propertyDetail.favoriteError') || 'Failed to update favorite');
    },
  });

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.signInToLike') || 'Please sign in to like');
      navigate('/signin');
      return;
    }

    toggleLikeMutation.mutate(property.slug);
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.signInToFavorite') || 'Please sign in to add to favorites');
      navigate('/signin');
      return;
    }

    toggleFavoriteMutation.mutate(property.slug);
  };

  return {
    favoriteCount,
    handleFavorite,
    handleLike,
    isFavorite,
    isLiked,
    likeCount,
  };
}
