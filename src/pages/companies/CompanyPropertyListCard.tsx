import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, Heart, MapPin, MessageCircle, Star, ThumbsUp } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceLakh } from '@/lib/utils';
import type { Property } from '@/types/properties';
import { useCompanyPropertyActions } from './useCompanyPropertyActions';

interface CompanyPropertyListCardProps {
  property: Property;
  companySlug: string;
}

export function CompanyPropertyListCard({ property, companySlug }: CompanyPropertyListCardProps) {
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

  return (
    <Card
      className="group hover:shadow-xl transition-all border-2 border-border/50 backdrop-blur-sm overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
      onClick={() => navigate(`/properties/${property.slug}`)}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
        <div className="flex flex-col w-full sm:w-64 flex-shrink-0 gap-2">
          <div className={`relative w-full h-48 sm:h-40 overflow-hidden rounded-lg ${
            property.primary_image?.url ? '' : 'bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'
          }`}>
            <ImageWithFallback
              src={property.primary_image?.url || '/jade.png'}
              alt={getPropertyTitle()}
              className={`group-hover:scale-105 transition-transform duration-300 ${
                property.primary_image?.url ? 'w-full h-full object-cover' : 'max-w-[80%] max-h-[80%] object-contain'
              }`}
            />

            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {property.is_trending && (
                <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {t('premium.badge')}
                </Badge>
              )}
              {property.tan_tan_tan && (
                <Badge variant="outline" className="bg-primary/90 text-white border-primary/50 backdrop-blur-sm text-xs">
                  {t('categories.tantantan')}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <Badge className="bg-primary text-white border-primary text-sm font-semibold">
              {formatPriceLakh(property.price || '0', property.price_lakh, language, property.currency, property.price_amount) || property.formatted_price}
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {getPropertyTitle()}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getPropertyType()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getListingType()}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>{property.stats?.view_count ?? 0}</span>
                </div>
                <button onClick={handleLike} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  <span className={isLiked ? 'text-primary' : 'text-muted-foreground'}>{likeCount.toLocaleString()}</span>
                </button>
                <button onClick={handleFavorite} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                  <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  <span className={isFavorite ? 'text-red-500' : 'text-muted-foreground'}>{favoriteCount.toLocaleString()}</span>
                </button>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                  <span>{property.stats?.comment_count ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="line-clamp-1">{getPropertyLocation()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{t('properties.expiresAt')}: {formatPropertyExpireDate()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-t border-border/50">
              {property.area_sqft && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t('properties.area')}:</span>
                  <span className="text-sm font-medium">{property.area_sqft} sqft</span>
                </div>
              )}
              {property.bedrooms && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t('properties.bedrooms')}:</span>
                  <span className="text-sm font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t('properties.bathrooms')}:</span>
                  <span className="text-sm font-medium">{property.bathrooms}</span>
                </div>
              )}
              {property.length && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t('properties.length')}:</span>
                  <span className="text-sm font-medium">{property.length} ft</span>
                </div>
              )}
              {property.width && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">{t('properties.width')}:</span>
                  <span className="text-sm font-medium">{property.width} ft</span>
                </div>
              )}
            </div>

            {property.location?.address && (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground block mb-1">{t('properties.address')}:</span>
                    <span className="text-sm">{property.location.address}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
