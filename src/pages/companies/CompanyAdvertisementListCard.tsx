import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, ImageOff, MapPin, Star, ThumbsUp } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  formatCompanyAdvertisementCreatedDate,
  formatCompanyAdvertisementExpireDate,
  getCompanyAdvertisementLocation,
  getCompanyAdvertisementTitle,
  getCompanyAdvertisementTypeLabel,
  shouldShowCompanyAdvertisementAddress,
} from './companyAdvertisementCardUtils';
import { useCompanyAdvertisementActions } from './useCompanyAdvertisementActions';
import type { Advertisement } from '@/types/advertisement';

interface CompanyAdvertisementListCardProps {
  advertisement: Advertisement;
  companySlug: string;
}

export function CompanyAdvertisementListCard({ advertisement, companySlug }: CompanyAdvertisementListCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { handleLike, isLiked, likeCount } = useCompanyAdvertisementActions(advertisement, companySlug);

  const title = getCompanyAdvertisementTitle(advertisement, language);
  const location = getCompanyAdvertisementLocation(advertisement, language);
  const advertisementTypeLabel = getCompanyAdvertisementTypeLabel(advertisement.advertisement_type, t);
  const viewCount = advertisement.stats?.view_count ?? 0;
  const showAddress = shouldShowCompanyAdvertisementAddress(advertisement, location);

  const imageUrl = advertisement.media?.primary_image?.url;
  const hasImage = Boolean(imageUrl);

  const goToDetail = () => navigate(`/advertisements/${advertisement.id}`);

  return (
    <Card className="group overflow-hidden border border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        <div
          className={`relative h-52 w-full shrink-0 cursor-pointer self-start overflow-hidden rounded-lg sm:h-60 sm:w-64 md:h-64 md:w-72 ${
            hasImage ? '' : 'flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'
          }`}
          onClick={goToDetail}
        >
          {hasImage ? (
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
              <ImageOff className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">{t('advertisements.noResults')}</p>
              <p className="text-xs text-muted-foreground">{t('advertisements.noResultsDesc')}</p>
            </div>
          )}

          {advertisement.is_featured && hasImage && (
            <div className="absolute left-2 top-2">
              <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/90 text-xs text-yellow-900 backdrop-blur-sm">
                <Star className="mr-1 h-3 w-3" />
                {t('advertisements.featured')}
              </Badge>
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
                  {advertisement.is_featured && (
                    <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/10 text-xs text-yellow-800">
                      {t('advertisements.featured')}
                    </Badge>
                  )}
                </div>
              </div>
              <p
                className={`shrink-0 text-right text-base font-bold sm:text-lg ${
                  advertisement.advertisement_type === 'for_rent' ? 'text-sky-600' : 'text-emerald-600'
                }`}
              >
                {advertisementTypeLabel}
              </p>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="line-clamp-1">{location || t('advertisements.locationNotSpecified')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>
                  {t('advertisements.created')} {formatCompanyAdvertisementCreatedDate(advertisement, language)}
                </span>
              </span>
              {advertisement.dates?.expires_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>
                    {t('properties.expiresAt')}: {formatCompanyAdvertisementExpireDate(advertisement, language)}
                  </span>
                </span>
              )}
            </div>

            {advertisement.description && (
              <div className="mb-2 rounded-md bg-muted/40 px-3 py-2 text-sm">
                <span className="line-clamp-2 font-medium text-foreground">{advertisement.description}</span>
              </div>
            )}

            {showAddress && (
              <p className="line-clamp-2 text-sm text-muted-foreground">{advertisement.location?.address}</p>
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
