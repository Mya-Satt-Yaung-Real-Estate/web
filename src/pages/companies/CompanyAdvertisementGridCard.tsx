import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, MapPin, Star, ThumbsUp } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getCompanyAdvertisementTypeBadgeClass,
  getCompanyAdvertisementTypeLabel,
} from './companyAdvertisementCardUtils';
import { useCompanyAdvertisementActions } from './useCompanyAdvertisementActions';
import type { Advertisement } from '@/types/advertisement';

interface CompanyAdvertisementGridCardProps {
  advertisement: Advertisement;
  companySlug: string;
}

export function CompanyAdvertisementGridCard({ advertisement, companySlug }: CompanyAdvertisementGridCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { handleLike, isLiked, likeCount } = useCompanyAdvertisementActions(advertisement, companySlug);

  const getAdvertisementTitle = () => (language === 'mm' ? advertisement.title_mm : advertisement.title_en);
  const getAdvertisementLocation = () => {
    const region = language === 'mm' ? advertisement.location?.region?.name_mm : advertisement.location?.region?.name_en;
    const township = language === 'mm' ? advertisement.location?.township?.name_mm : advertisement.location?.township?.name_en;
    return region && township ? `${township}, ${region}` : '';
  };

  const advertisementTypeLabel = getCompanyAdvertisementTypeLabel(advertisement.advertisement_type, t);
  const advertisementTypeBadgeClass = getCompanyAdvertisementTypeBadgeClass(advertisement.advertisement_type);
  const viewCount = advertisement.stats?.view_count ?? 0;

  const goToDetail = () => navigate(`/advertisements/${advertisement.id}`);

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-border/50 shadow-lg transition-all hover:border-primary/30 hover:shadow-xl">
      <div
        className={`relative h-48 cursor-pointer overflow-hidden ${
          advertisement.media?.primary_image ? '' : 'flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'
        }`}
        onClick={goToDetail}
      >
        <ImageWithFallback
          src={advertisement.media?.primary_image?.url || '/jade.png'}
          alt={getAdvertisementTitle()}
          className={`transition-transform duration-300 group-hover:scale-105 ${
            advertisement.media?.primary_image ? 'h-full w-full object-cover' : 'max-h-[80%] max-w-[80%] object-contain'
          }`}
        />

        {advertisement.is_featured && (
          <div className="absolute left-3 top-3">
            <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/90 text-xs text-yellow-900 backdrop-blur-sm">
              <Star className="mr-1 h-3 w-3" />
              {t('advertisements.featured')}
            </Badge>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <Badge variant="outline" className={`text-xs backdrop-blur-sm ${advertisementTypeBadgeClass}`}>
            {advertisementTypeLabel}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-3 pb-4">
        <div className="space-y-2">
          <h3
            className="line-clamp-2 cursor-pointer text-lg font-semibold transition-colors group-hover:text-primary"
            onClick={goToDetail}
          >
            {getAdvertisementTitle()}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{advertisement.description}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="line-clamp-1">{getAdvertisementLocation() || t('advertisements.locationNotSpecified')}</span>
        </div>

        <div className="flex items-center justify-between border-t border-border/50 py-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4 text-primary" />
            <span>{viewCount.toLocaleString()}</span>
          </div>
          <button
            onClick={handleLike}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-primary/10"
          >
            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <span className={`text-sm ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>
              {likeCount.toLocaleString()}
            </span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(advertisement.dates?.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        <Button
          onClick={goToDetail}
          variant="outline"
          size="sm"
          className="w-full text-xs transition-all group-hover:border-0 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-[#4a9b82] group-hover:text-white group-hover:shadow-lg hover:border-0 hover:bg-gradient-to-r hover:from-primary hover:to-[#4a9b82] hover:text-white hover:shadow-lg sm:text-sm"
        >
          {t('listings.viewDetails') || 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
