import { useNavigate } from 'react-router-dom';
import { Bath, Bed, Calendar, DollarSign, Eye, Heart, MapPin, MessageCircle, Square, ThumbsUp } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { InstallmentBadge } from '@/components/features/properties/InstallmentBadge';
import { PremiumBadge } from '@/components/features/properties/PremiumBadge';
import { TanTanTanBadge } from '@/components/features/properties/TanTanTanBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceLakh } from '@/lib/utils';
import type { Property } from '@/types/properties';
import { useCompanyPropertyActions } from './useCompanyPropertyActions';

interface CompanyPropertyGridCardProps {
  property: Property;
  companySlug: string;
}

export function CompanyPropertyGridCard({ property, companySlug }: CompanyPropertyGridCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { favoriteCount, handleFavorite, handleLike, isFavorite, isLiked, likeCount } = useCompanyPropertyActions(property, companySlug);

  const getPropertyTitle = () => (language === 'mm' ? property.title_mm : property.title_en);
  const getPropertyLocation = () => {
    const region = language === 'mm' ? property.location?.region?.name_mm : property.location?.region?.name_en;
    const township = language === 'mm' ? property.location?.township?.name_mm : property.location?.township?.name_en;
    return region && township ? `${township}, ${region}` : '';
  };
  const getPropertyType = () => (language === 'mm' ? property.property_type?.name_mm : property.property_type?.name_en) || '';
  const getListingType = () => (language === 'mm' ? property.listing_type?.name_mm : property.listing_type?.name_en) || '';
  const formatPropertyExpireDate = () => {
    const expiresAt = property.dates?.company_profile_expires_at;
    if (!expiresAt) return '-';

    return new Date(expiresAt).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const goToDetail = () => navigate(`/properties/${property.slug}`);

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3] cursor-pointer" onClick={goToDetail}>
        <ImageWithFallback
          src={property.primary_image?.url || property.primary_image?.thumbnail_url || ''}
          alt={getPropertyTitle()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.is_trending && <PremiumBadge />}
          {property.tan_tan_tan && <TanTanTanBadge />}
          {property.bank_installment_available && <InstallmentBadge />}
          {property.is_featured && (
            <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 shadow-lg">
              {t('listings.featured') || 'Featured'}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge variant="secondary" className="text-white border-0 shadow-lg bg-gradient-to-r from-primary to-[#4a9b82]">
            {getPropertyType()}
          </Badge>
          <Badge variant="secondary" className="text-white border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
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
            <span>{(property.stats?.view_count ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 pt-4 sm:pt-6 flex-1 flex flex-col">
        <h4 className="mb-2 text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={goToDetail}>
          {getPropertyTitle()}
        </h4>

        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="line-clamp-1">{getPropertyLocation()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>
              {formatPriceLakh(property.price || '0', property.price_lakh, language, property.currency, property.price_amount) || property.formatted_price}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{t('properties.expiresAt')}: {formatPropertyExpireDate()}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{property.bedrooms ?? 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{property.bathrooms ?? 0}</span>
            </div>
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{parseFloat(String(property.area_sqft)).toLocaleString()} sqft</span>
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
            <span className={`text-xs sm:text-sm ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>
              {likeCount.toLocaleString()}
            </span>
          </button>
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground">{(property.stats?.comment_count ?? 0).toLocaleString()}</span>
          </div>
          <button
            onClick={handleFavorite}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            <span className={`text-xs sm:text-sm ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}>
              {favoriteCount.toLocaleString()}
            </span>
          </button>
        </div>

        <Button
          onClick={goToDetail}
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
