import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, Heart, MapPin, ThumbsUp } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { InstallmentBadge } from '@/components/features/properties/InstallmentBadge';
import { PremiumBadge } from '@/components/features/properties/PremiumBadge';
import { TanTanTanBadge } from '@/components/features/properties/TanTanTanBadge';
import { DirectOwnerBadge } from '@/components/features/properties/DirectOwnerBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  buildCompanyPropertySpecLine,
  formatCompanyPropertyExpireDate,
  formatCompanyPropertyPrice,
  getCompanyListingType,
  getCompanyPropertyLocation,
  getCompanyPropertyTitle,
  getCompanyPropertyType,
  isResidentialProperty,
  shouldShowCompanyPropertyAddress,
} from './companyPropertyCardUtils';
import { useCompanyPropertyActions } from './useCompanyPropertyActions';
import type { Property } from '@/types/properties';

interface CompanyPropertyListCardProps {
  property: Property;
  companySlug: string;
}

export function CompanyPropertyListCard({ property, companySlug }: CompanyPropertyListCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { favoriteCount, handleFavorite, handleLike, isFavorite, isLiked, likeCount } = useCompanyPropertyActions(
    property,
    companySlug
  );

  const title = getCompanyPropertyTitle(property, language);
  const location = getCompanyPropertyLocation(property, language);
  const propertyType = getCompanyPropertyType(property, language);
  const listingType = getCompanyListingType(property, language);
  const price = formatCompanyPropertyPrice(property, language);
  const isResidential = isResidentialProperty(property);
  const specParts = buildCompanyPropertySpecLine(property, isResidential);
  const viewCount = property.stats?.view_count ?? 0;
  const showAddress = shouldShowCompanyPropertyAddress(property, location);

  const featureBadges = [
    property.is_trending ? 'premium' : null,
    property.tan_tan_tan ? 'tantan' : null,
    property.bank_installment_available ? 'installment' : null,
    property.is_direct_owner ? 'direct_owner' : null,
  ].filter(Boolean).slice(0, 3);

  const goToDetail = () => navigate(`/properties/${property.slug}`);

  return (
    <Card className="group overflow-hidden border border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        <div
          className="relative h-52 w-full shrink-0 cursor-pointer self-start overflow-hidden rounded-lg sm:h-60 sm:w-64 md:h-64 md:w-72"
          onClick={goToDetail}
        >
          <ImageWithFallback
            src={property.primary_image?.url || property.primary_image?.thumbnail_url || '/jade.png'}
            alt={title}
            className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
              property.primary_image?.url ? 'object-cover' : 'bg-gradient-to-br from-primary/10 to-primary/5 object-contain p-6'
            }`}
          />

          {featureBadges.length > 0 && (
            <div className="absolute left-2 top-2 flex flex-col gap-1.5">
              {featureBadges.includes('premium') && <PremiumBadge />}
              {featureBadges.includes('tantan') && <TanTanTanBadge />}
              {featureBadges.includes('installment') && <InstallmentBadge />}
              {featureBadges.includes('direct_owner') && <DirectOwnerBadge />}
            </div>
          )}
        </div>

        <div className="flex min-h-52 min-w-0 flex-1 flex-col sm:min-h-60 md:min-h-64">
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
              <h3
                className="mb-1.5 line-clamp-2 cursor-pointer text-lg font-semibold transition-colors group-hover:text-primary sm:text-xl"
                onClick={goToDetail}
              >
                {title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {propertyType && (
                  <Badge variant="outline" className="text-xs">
                    {propertyType}
                  </Badge>
                )}
                {listingType && (
                  <Badge variant="outline" className="border-primary/30 text-xs text-primary">
                    {listingType}
                  </Badge>
                )}
              </div>
            </div>
            {price && (
              <p className="shrink-0 text-right text-base font-bold text-primary sm:text-lg">{price}</p>
            )}
            </div>

          <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {location && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="line-clamp-1">{location}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{t('properties.expiresAt')}: {formatCompanyPropertyExpireDate(property, language)}</span>
            </span>
          </div>

          {specParts.length > 0 && (
            <div className="mb-2 rounded-md bg-muted/40 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{specParts.join(' · ')}</span>
            </div>
          )}

          {showAddress && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {property.location?.address}
            </p>
          )}
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground sm:text-sm">
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
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
            </div>
            <Button
              onClick={goToDetail}
              variant="outline"
              size="sm"
              className="text-xs transition-all group-hover:border-0 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-[#4a9b82] group-hover:text-white group-hover:shadow-lg hover:border-0 hover:bg-gradient-to-r hover:from-primary hover:to-[#4a9b82] hover:text-white hover:shadow-lg sm:text-sm"
            >
              {t('listings.viewDetails') || 'View Details'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
