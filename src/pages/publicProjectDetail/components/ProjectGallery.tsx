/**
 * Project Gallery Component
 *
 * Standalone clone of the property detail gallery UI — kept separate so
 * property detail media can evolve independently.
 */

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShareModal } from '@/components/ui/ShareModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Play,
  Share2,
  Star,
  X,
} from 'lucide-react';

export type ProjectGalleryImage = {
  id: number;
  filename?: string;
  url: string;
  thumbnail_url?: string;
  type?: string;
};

interface ProjectGalleryProps {
  galleryImages: ProjectGalleryImage[];
  title: string;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number | ((prev: number) => number)) => void;
  shareUrl: string;
  viewCount: number;
  isFeatured: boolean;
  featuredLabel: string;
}

export function ProjectGallery({
  galleryImages,
  title,
  currentImageIndex,
  setCurrentImageIndex,
  shareUrl,
  viewCount,
  isFeatured,
  featuredLabel,
}: ProjectGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (galleryImages.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(currentImageIndex, galleryImages.length - 1));
  const currentItem = galleryImages[safeIndex];
  const isVideo = currentItem?.type === 'video';
  const videoUrl = isVideo ? currentItem.url : null;

  return (
    <Card className="rounded-2xl border-primary/10 shadow-lg">
      <CardContent className="px-0 pb-0 pt-1">
        <div className="relative overflow-hidden bg-black" style={{ aspectRatio: '16/9.5' }}>
          {isVideo ? (
            <div className="relative h-full w-full bg-black">
              {videoUrl ? (
                renderVideoPlayer(videoUrl, title)
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  <p className="text-white">Video not available</p>
                </div>
              )}

              {galleryImages.length > 1 && (
                <div className="pointer-events-none absolute inset-0 z-10">
                  <GalleryNavButtons
                    onPrevious={() =>
                      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                    }
                    onNext={() =>
                      setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                    }
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 text-xs text-foreground backdrop-blur-sm sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm">
                    {safeIndex + 1} / {galleryImages.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-full w-full bg-black" style={{ aspectRatio: '16/9.5' }}>
              {currentItem && (
                <ImageWithFallback
                  key={`project-main-image-${safeIndex}-${currentItem.id}`}
                  src={currentItem.url}
                  alt={title}
                  className="h-full w-full cursor-pointer object-cover"
                  onClick={() => setIsLightboxOpen(true)}
                />
              )}

              {galleryImages.length > 1 && (
                <>
                  <GalleryNavButtons
                    onPrevious={() =>
                      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
                    }
                    onNext={() =>
                      setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
                    }
                  />
                  <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 text-xs text-foreground backdrop-blur-sm sm:bottom-4 sm:px-4 sm:py-2 sm:text-sm">
                    {safeIndex + 1} / {galleryImages.length}
                  </div>
                </>
              )}
            </div>
          )}

          {isFeatured && (
            <div
              className={`absolute left-2 top-2 z-20 flex flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2 ${isVideo ? 'pointer-events-none' : ''}`}
            >
              <Badge className="border-0 bg-gradient-to-r from-primary to-[#4a9b82] text-white">
                <Star className="mr-1 h-3 w-3 fill-white" />
                {featuredLabel}
              </Badge>
            </div>
          )}

          {!isVideo && (
            <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5 sm:right-4 sm:top-4 sm:gap-2">
              <ShareModal title={title} url={shareUrl}>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-colors hover:bg-background sm:h-10 sm:w-10"
                  title="Share project"
                >
                  <Share2 className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
                </button>
              </ShareModal>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm transition-colors hover:bg-background sm:h-10 sm:w-10"
                title="View fullscreen"
              >
                <Maximize2 className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5" />
              </button>
            </div>
          )}

          {!isVideo && (
            <div className="absolute bottom-2 left-2 z-10 sm:bottom-4 sm:left-4">
              <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-background/20 px-2 py-1 text-white backdrop-blur-md sm:px-3 sm:py-1.5">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{viewCount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {galleryImages.length > 1 && (
          <div className="w-full border-t border-border bg-background p-2 sm:p-0">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {galleryImages.map((item, idx) => {
                const isVideoItem = item.type === 'video';
                const thumbnailSrc = item.thumbnail_url || item.url;

                return (
                  <button
                    key={`project-thumb-${item.id}-${idx}`}
                    type="button"
                    className={`relative aspect-video cursor-pointer overflow-hidden rounded border-2 transition-all ${
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
                      className="block h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {isVideoItem && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm sm:h-10 sm:w-10">
                          <Play className="h-4 w-4 fill-black text-black sm:h-5 sm:w-5" />
                        </div>
                      </div>
                    )}
                    {safeIndex === idx && (
                      <div className="pointer-events-none absolute inset-0 z-20 border-2 border-primary bg-primary/10" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>

      {isLightboxOpen && (
        <ProjectImageLightbox
          images={galleryImages}
          initialIndex={safeIndex}
          onClose={() => setIsLightboxOpen(false)}
          onIndexChange={setCurrentImageIndex}
        />
      )}
    </Card>
  );
}

function GalleryNavButtons({ onPrevious, onNext }: { onPrevious: () => void; onNext: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrevious();
        }}
        className="pointer-events-auto absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm transition-colors hover:bg-background sm:left-4 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
        className="pointer-events-auto absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm transition-colors hover:bg-background sm:right-4 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>
    </>
  );
}

function renderVideoPlayer(videoUrl: string, title: string) {
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  if (isYouTube) {
    let videoId = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
      videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    }

    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  if (isVimeo) {
    const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0] || '';

    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://player.vimeo.com/video/${videoId}`}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  return (
    <video
      controls
      playsInline
      {...({ webkitPlaysInline: true } as React.VideoHTMLAttributes<HTMLVideoElement>)}
      className="h-full w-full object-contain"
      src={videoUrl}
      title={title}
    >
      Your browser does not support the video tag.
    </video>
  );
}

interface ProjectImageLightboxProps {
  images: ProjectGalleryImage[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

function ProjectImageLightbox({ images, initialIndex, onClose, onIndexChange }: ProjectImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        setCurrentIndex(newIndex);
        onIndexChange(newIndex);
      } else if (e.key === 'ArrowRight') {
        const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        setCurrentIndex(newIndex);
        onIndexChange(newIndex);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, images.length, onClose, onIndexChange]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onIndexChange(newIndex);
  };

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95" onClick={onClose}>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex justify-end p-4">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 bg-white/95 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
          title="Close (Esc)"
        >
          <X className="h-6 w-6 text-black" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4">
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="pointer-events-auto fixed left-4 top-1/2 z-20 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/50 bg-white/95 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              title="Previous"
            >
              <ChevronLeft className="h-8 w-8 text-black" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="pointer-events-auto fixed right-4 top-1/2 z-20 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/50 bg-white/95 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              title="Next"
            >
              <ChevronRight className="h-8 w-8 text-black" />
            </button>
          </>
        )}

        <img
          src={currentImage.url}
          alt={currentImage.filename || 'Project image'}
          className="pointer-events-auto max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {images.length > 1 && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-white/50 bg-white/95 px-6 py-3 text-base font-semibold text-black shadow-lg backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {images.length > 1 && (
        <div className="pointer-events-auto fixed bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-black/80 px-3 py-1.5 backdrop-blur-md">
          <div className="flex max-w-full justify-center gap-1.5 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={`project-lightbox-thumb-${img.id}-${idx}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  onIndexChange(idx);
                }}
                className={`h-[35px] w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-white shadow-lg ring-2 ring-white/50'
                    : 'border-white/30 opacity-70 hover:border-white/60 hover:opacity-100'
                }`}
              >
                <img
                  src={img.thumbnail_url || img.url}
                  alt={img.filename || `Thumbnail ${idx + 1}`}
                  className="block h-[35px] w-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
