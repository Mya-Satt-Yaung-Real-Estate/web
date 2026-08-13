/**
 * Company Property Grid Card
 *
 * Cloned from HomePropertyCard (Premium Properties section on home page).
 * Scoped to company detail page only — home page card is unchanged.
 */

import { MapPin, Bed, Bath, Square, ThumbsUp, MessageCircle, Heart, Eye, DollarSign, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ShareModal } from '@/components/ui/ShareModal';
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
  const { favoriteCount, handleFavorite, handleLike, isFavorite, isLiked, likeCount } = useCompanyPropertyActions(
    property,
    companySlug
  );

  const getTitle = () => (language === 'mm' ? property.title_mm : property.title_en);

  const getLocation = () => {
    const region = language === 'mm' ? property.location?.region?.name_mm : property.location?.region?.name_en;
    const township = language === 'mm' ? property.location?.township?.name_mm : property.location?.township?.name_en;
    return region && township ? `${township}, ${region}` : '';
  };

  const getPropertyType = () =>
    (language === 'mm' ? property.property_type?.name_mm : property.property_type?.name_en) || '';

  const getListingType = () =>
    (language === 'mm' ? property.listing_type?.name_mm : property.listing_type?.name_en) || '';

  const imageUrl = property.primary_image?.url || property.primary_image?.thumbnail_url || '';
  const viewCount = property.stats?.view_count ?? 0;
  const commentCount = property.stats?.comment_count ?? 0;

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-border/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={getTitle()}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {property.is_trending && (
            <Badge className="border-0 bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg">
              <span className="text-xs sm:text-sm">Premium</span>
            </Badge>
          )}
          {property.tan_tan_tan && (
            <Badge className="border-0 bg-gradient-to-r from-primary to-[#4a9b82] text-white shadow-lg">
              <span className="text-xs sm:text-sm">{t('search.tanTanTan') || 'Tan Tan Tan'}</span>
            </Badge>
          )}
          {property.bank_installment_available && (
            <Badge className="border-0 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              <span className="text-xs sm:text-sm">{t('listings.installment') || 'Installment'}</span>
            </Badge>
          )}
          {property.is_direct_owner && (
            <Badge className="border-0 bg-gradient-to-r from-sky-500 to-blue-600 text-xs text-white shadow-lg">
              {t('search.directOwner') || 'Direct Owner Post'}
            </Badge>
          )}
          {property.is_featured && (
            <Badge className="border-0 bg-gradient-to-r from-primary to-[#4a9b82] text-white shadow-lg">
              {t('listings.featured') || 'Featured'}
            </Badge>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <Badge variant="secondary" className="border-0 bg-gradient-to-r from-primary to-[#4a9b82] text-white shadow-lg">
            {getPropertyType()}
          </Badge>
          <Badge variant="secondary" className="border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
            {getListingType()}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge className="border border-white/20 bg-background/20 text-white backdrop-blur-md">
            {property.code}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-background/20 px-3 py-1.5 text-white backdrop-blur-md">
            <Eye className="h-4 w-4" />
            <span>{viewCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-3 pt-4 sm:p-4 sm:pt-6">
        <h4 className="mb-2 line-clamp-1 text-sm transition-colors group-hover:text-primary sm:text-base">
          {getTitle()}
        </h4>

        <div className="mb-3 space-y-1.5 sm:mb-4 sm:space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
            <DollarSign className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
            <span>
              {formatPriceLakh(
                property.price || '0',
                property.price_lakh,
                language,
                property.currency,
                property.price_amount
              ) || property.formatted_price}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
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

        <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-3 sm:mb-4 sm:pb-4">
          <button
            onClick={handleLike}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-primary/10 sm:gap-1.5 sm:px-3 sm:py-1.5"
          >
            <ThumbsUp
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
            />
            <span className={`text-xs sm:text-sm ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>
              {likeCount.toLocaleString()}
            </span>
          </button>
          <div className="flex items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-primary/10 sm:gap-1.5 sm:px-3 sm:py-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            <span className="text-xs text-muted-foreground sm:text-sm">{commentCount.toLocaleString()}</span>
          </div>
          <button
            onClick={handleFavorite}
            className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-primary/10 sm:gap-1.5 sm:px-3 sm:py-1.5"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
            <span className={`text-xs sm:text-sm ${isFavorite ? 'text-red-500' : 'text-muted-foreground'}`}>
              {favoriteCount.toLocaleString()}
            </span>
          </button>
          <ShareModal title={getTitle()} url={`${window.location.origin}/properties/${property.slug}`}>
            <button className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:bg-primary/10 sm:gap-1.5 sm:px-3 sm:py-1.5">
              <Share2 className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </button>
          </ShareModal>
        </div>

        <Button
          onClick={() => navigate(`/properties/${property.slug}`)}
          variant="outline"
          size="sm"
          className="mt-auto w-full text-xs transition-all group-hover:border-0 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-[#4a9b82] group-hover:text-white group-hover:shadow-lg hover:border-0 hover:bg-gradient-to-r hover:from-primary hover:to-[#4a9b82] hover:text-white hover:shadow-lg sm:text-sm"
        >
          {t('listings.viewDetails') || 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
