/**
 * Event Gallery Component
 * 
 * Displays event image with badges and actions.
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShareModal } from '@/components/ui/ShareModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  Share2,
  Maximize2,
  X,
} from 'lucide-react';
import type { HousingEventDetail } from '@/types/housingEvents';

interface EventGalleryProps {
  event: HousingEventDetail;
  title: string;
  imageUrl: string;
  shareUrl: string;
  language: 'en' | 'mm';
  t: (key: string) => string | undefined;
}

export function EventGallery({
  event,
  title,
  imageUrl,
  shareUrl,
  language,
  t,
}: EventGalleryProps) {
  const getCategoryName = () => {
    return language === 'mm' ? event.category.name_mm : event.category.name_en;
  };
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!imageUrl) return null;

  return (
    <Card>
      <CardContent className="pt-1 px-0 pb-0">
        {/* Main Image Container */}
        <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '16/9.5' }}>
          <div className="relative w-full bg-black" style={{ aspectRatio: '16/9.5' }}>
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            />
          </div>

          {/* Badges - Top Left */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20 flex flex-wrap gap-1.5 sm:gap-2">
            <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0">
              {getCategoryName()}
            </Badge>
            {event.is_free && (
              <Badge className="bg-yellow-500 text-white border-0">
                {t('events.free') || 'Free'}
              </Badge>
            )}
          </div>

          {/* Actions - Top Right */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-20">
            <ShareModal title={title} url={shareUrl}>
              <button
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                title="Share event"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
            </ShareModal>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              title="View fullscreen"
            >
              <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardContent>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-full object-contain pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Card>
  );
}

