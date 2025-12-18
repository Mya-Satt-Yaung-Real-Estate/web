/**
 * Home Property Card Component
 * 
 * Property card component specifically for home page.
 * Matches the design from public property list page (100% same design).
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ShareModal } from '@/components/ui/ShareModal';
import { MapPin, Bed, Bath, Square, ThumbsUp, MessageCircle, Heart, Eye, DollarSign, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceLakh } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publicPropertyApi } from '@/services/api/publicProperties';
import { publicPropertyKeys } from '@/services/queries/publicProperties';
import { homeKeys } from '@/services/queries/home';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import type { PublicProperty } from '@/types/publicProperties';

interface HomePropertyCardProps {
  property: PublicProperty;
}

export function HomePropertyCard({ property }: HomePropertyCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [isLiked, setIsLiked] = useState(property.is_liked ?? false);
  const [isFavorite, setIsFavorite] = useState(property.is_favorited ?? false);
  const [likeCount, setLikeCount] = useState(property.like_count);
  const [favoriteCount, setFavoriteCount] = useState(property.favorite_count);

  // Sync state with prop when property data changes (after refetch)
  useEffect(() => {
    setIsLiked(property.is_liked ?? false);
    setIsFavorite(property.is_favorited ?? false);
    setLikeCount(property.like_count);
    setFavoriteCount(property.favorite_count);
  }, [property.is_liked, property.is_favorited, property.like_count, property.favorite_count]);

  const toggleLikeMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleLike(slug),
    onSuccess: (response) => {
      const liked = response.data?.data?.liked ?? false;
      setIsLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : Math.max(0, prev - 1));
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      toast.success(liked 
        ? (t('propertyDetail.liked') || 'Liked!')
        : (t('propertyDetail.unliked') || 'Unliked')
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || t('propertyDetail.likeError') || 'Failed to update like');
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleFavorite(slug),
    onSuccess: (response) => {
      const favorited = response.data?.data?.is_favorited ?? false;
      setIsFavorite(favorited);
      setFavoriteCount(prev => favorited ? prev + 1 : Math.max(0, prev - 1));
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(favorited 
        ? (t('propertyDetail.addedToFavorites') || 'Added to favorites')
        : (t('propertyDetail.removedFromFavorites') || 'Removed from favorites')
      );
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || t('propertyDetail.favoriteError') || 'Failed to update favorite');
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.signInToLike') || 'Please sign in to like');
      navigate('/signin');
      return;
    }
    toggleLikeMutation.mutate(property.slug);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.signInToFavorite') || 'Please sign in to add to favorites');
      navigate('/signin');
      return;
    }
    toggleFavoriteMutation.mutate(property.slug);
  };


  const getTitle = () => {
    return language === 'mm' ? property.title_mm : property.title_en;
  };

  const getLocation = () => {
    const region = language === 'mm' ? property.region.name_mm : property.region.name_en;
    const township = language === 'mm' ? property.township.name_mm : property.township.name_en;
    return `${township}, ${region}`;
  };

  const getPropertyType = () => {
    return language === 'mm' ? property.property_type.name_mm : property.property_type.name_en;
  };

  const getListingType = () => {
    return language === 'mm' ? property.listing_type.name_mm : property.listing_type.name_en;
  };


  const imageUrl = property.primary_image?.url || property.primary_image?.thumbnail_url || '';

  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border border-border/80 hover:border-primary/50 backdrop-blur-sm h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <ImageWithFallback
          src={imageUrl}
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.premium && (
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 shadow-lg">
              <span className="text-xs sm:text-sm">Premium</span>
            </Badge>
          )}
          {property.tan_tan_tan && (
            <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 shadow-lg">
              <span className="text-xs sm:text-sm">{t('search.tanTanTan') || 'Tan Tan Tan'}</span>
            </Badge>
          )}
          {property.bank_installment_available && (
            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <span className="text-xs sm:text-sm">{t('listings.installment') || 'Installment'}</span>
            </Badge>
          )}
          {property.is_featured && (
            <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 shadow-lg">
              {t('listings.featured') || 'Featured'}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge 
            variant="secondary" 
            className="text-white border-0 shadow-lg bg-gradient-to-r from-primary to-[#4a9b82]"
          >
            {getPropertyType()}
          </Badge>
          <Badge 
            variant="secondary" 
            className="text-white border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600"
          >
            {getListingType()}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge className="bg-background/20 backdrop-blur-md border border-white/20 text-white">
            {property.code}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-1 text-white px-3 py-1.5 rounded-lg bg-background/20 backdrop-blur-md border border-white/20">
            <Eye className="h-4 w-4" />
            <span>{property.view_count.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 pt-4 sm:pt-6 flex-1 flex flex-col">
        <h4 className="mb-2 text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
          {getTitle()}
        </h4>
        
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{formatPriceLakh(property.price, property.price_lakh, language)}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{property.bathrooms}</span>
            </div>
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{parseFloat(property.area_sqft).toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/50">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <ThumbsUp className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-xs sm:text-sm ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>{likeCount.toLocaleString()}</span>
          </button>
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground">{property.comment_count.toLocaleString()}</span>
          </div>
          <button
            onClick={handleFavorite}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            <span className={`text-xs sm:text-sm ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}>{favoriteCount.toLocaleString()}</span>
          </button>
          <ShareModal 
            title={getTitle()} 
            url={`${window.location.origin}/properties/${property.slug}`}
          >
            <button
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            </button>
          </ShareModal>
        </div>

        <Button 
          onClick={() => navigate(`/properties/${property.slug}`)}
          variant="outline"
          size="sm"
          className="w-full mt-auto text-xs sm:text-sm group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-[#4a9b82] group-hover:text-white group-hover:border-0 group-hover:shadow-lg hover:bg-gradient-to-r hover:from-primary hover:to-[#4a9b82] hover:text-white hover:border-0 hover:shadow-lg transition-all"
        >
          {t('listings.viewDetails') || 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}

