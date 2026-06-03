/**
 * Advertisement Details Card Component
 * 
 * Displays advertisement details with description.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  ThumbsUp,
  Eye,
  Calendar,
  Share2,
} from 'lucide-react';
import { ShareModal } from '@/components/ui/ShareModal';
import type { PublicAdvertisementDetail } from '@/types/publicAdvertisements';

interface AdvertisementDetailsCardProps {
  advertisement: PublicAdvertisementDetail;
  title: string;
  description: string;
  locationString: string;
  isLiked: boolean;
  onLike: () => void;
  formatTimestamp: (dateString: string) => string;
  t: (key: string) => string | undefined;
}

export function AdvertisementDetailsCard({
  advertisement,
  title,
  description,
  locationString,
  isLiked,
  onLike,
  formatTimestamp,
  t,
}: AdvertisementDetailsCardProps) {
  const advertisementTypeLabel = advertisement.advertisement_type === 'for_rent'
    ? (t('advertisements.forRent') || 'For Rent')
    : (t('advertisements.forSale') || 'For Sale');
  const advertisementTypeBadgeClass = advertisement.advertisement_type === 'for_rent'
    ? 'bg-sky-500/10 text-sky-700 border-sky-500/30'
    : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 sm:space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
            <div className="flex-1">
              <Badge variant="outline" className={`mb-2 ${advertisementTypeBadgeClass}`}>
                {advertisementTypeLabel}
              </Badge>
              <h1 className="mb-2 text-lg sm:text-xl lg:text-2xl">{title}</h1>
              {advertisement.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{locationString}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Stats */}
        <div className="flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm">{advertisement.stats?.favorite_count || 0}</span>
            <span className="hidden sm:inline text-sm">{t('advertisementDetail.likes') || 'Likes'}</span>
          </button>
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">{(advertisement.stats?.view_count || 0).toLocaleString()}</span>
            <span className="hidden sm:inline text-sm">{t('advertisementDetail.views') || 'Views'}</span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t('advertisementDetail.description') || 'Description'}</h3>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {description || t('advertisementDetail.noDescription') || 'No description provided.'}
          </p>
        </div>

        <Separator />

        {/* Posted Date and Share */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {t('advertisementDetail.publishedOn') || 'Published on'}: {formatTimestamp(advertisement.dates.created_at)}
            </span>
          </div>
          <ShareModal title={title} url={window.location.href}>
            <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/20">
              <Share2 className="h-4 w-4 mr-2" />
              {t('advertisementDetail.share') || 'Share'}
            </Button>
          </ShareModal>
        </div>
      </CardContent>
    </Card>
  );
}

