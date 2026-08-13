import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShareModal } from '@/components/ui/ShareModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ChevronLeft, ChevronRight, Maximize2, Share2, X } from 'lucide-react';

interface GalleryImage {
  id: number;
  filename: string;
  url: string;
  thumbnail_url?: string;
}

interface ActivityGalleryProps {
  title: string;
  galleryImages: GalleryImage[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number | ((prev: number) => number)) => void;
  shareUrl: string;
  badgeLabel?: string;
}

export function ActivityGallery({
  title,
  galleryImages,
  currentImageIndex,
  setCurrentImageIndex,
  shareUrl,
  badgeLabel,
}: ActivityGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (galleryImages.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(currentImageIndex, galleryImages.length - 1));
  const currentItem = galleryImages[safeIndex];

  return (
    <Card>
      <CardContent className="pt-1 px-0 pb-0">
        <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '16/9.5' }}>
          <div className="relative w-full bg-black" style={{ aspectRatio: '16/9.5' }}>
            {currentItem && (
              <ImageWithFallback
                key={`main-image-${safeIndex}-${currentItem.id}`}
                src={currentItem.url}
                alt={title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
            )}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                >
                  <ChevronRight className="h-6 w-6 text-foreground" />
                </button>
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-foreground">
                  {safeIndex + 1} / {galleryImages.length}
                </div>
              </>
            )}
          </div>

          {badgeLabel && (
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-20">
              <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-foreground border-border">
                {badgeLabel}
              </Badge>
            </div>
          )}

          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-20">
            <ShareModal title={title} url={shareUrl}>
              <button
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                title="Share activity"
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

        {galleryImages.length > 1 && (
          <div className="w-full bg-background border-t border-border p-2 sm:p-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {galleryImages.map((item, idx) => {
                const thumbnailSrc = item.thumbnail_url || item.url;
                return (
                  <div
                    key={`thumb-${item.id}-${idx}`}
                    className={`relative aspect-video rounded overflow-hidden border-2 transition-all cursor-pointer ${
                      safeIndex === idx
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-transparent hover:border-border'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (idx >= 0 && idx < galleryImages.length) {
                        setCurrentImageIndex(idx);
                      }
                    }}
                  >
                    <img
                      src={thumbnailSrc}
                      alt={item.filename || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {safeIndex === idx && (
                      <div className="absolute inset-0 bg-primary/10 border-2 border-primary pointer-events-none z-20" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

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
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          {currentItem && (
            <img
              src={currentItem.url}
              alt={title}
              className="max-w-full max-h-full object-contain pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </Card>
  );
}
