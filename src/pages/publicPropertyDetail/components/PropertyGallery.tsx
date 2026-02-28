/**
 * Property Gallery Component
 * 
 * Displays image/video gallery with navigation, badges, and actions.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShareModal } from '@/components/ui/ShareModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { TanTanTanBadge } from '@/components/features/properties/TanTanTanBadge';
import { PremiumBadge } from '@/components/features/properties/PremiumBadge';
import {
  Heart,
  Share2,
  Eye,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Maximize2,
  Play,
  ThumbsUp,
} from 'lucide-react';
import type { PublicPropertyDetail } from '@/types/publicProperties';

interface PropertyGalleryProps {
  property: PublicPropertyDetail;
  title: string;
  galleryImages: Array<{
    id: number;
    filename: string;
    url: string;
    thumbnail_url?: string;
    type?: string;
  }>;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number | ((prev: number) => number)) => void;
  isFavorite: boolean;
  onFavorite: () => void;
  shareUrl: string;
  t: (key: string) => string | undefined;
}

export function PropertyGallery({
  property,
  title,
  galleryImages,
  currentImageIndex,
  setCurrentImageIndex,
  isFavorite,
  onFavorite,
  shareUrl,
  t,
}: PropertyGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (galleryImages.length === 0) return null;

  // Ensure currentImageIndex is within bounds
  const safeIndex = Math.max(0, Math.min(currentImageIndex, galleryImages.length - 1));
  const currentItem = galleryImages[safeIndex];
  const isVideo = currentItem?.type === 'video';
  const videoUrl = isVideo ? currentItem.url : null;

  // Debug: Log gallery images
  console.log('PropertyGallery - galleryImages:', galleryImages.length, galleryImages);

  return (
    <Card>
      <CardContent className="pt-1 px-0 pb-0">
        {/* Main Image Container */}
        <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '16/9.5' }}>
          {isVideo ? (
            /* Video Player */
            <div className="relative w-full h-full bg-black">
              {videoUrl ? (
                (() => {
                  // Check if it's a YouTube or Vimeo URL
                  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
                  const isVimeo = videoUrl.includes('vimeo.com');
                  
                  if (isYouTube) {
                    // Extract YouTube video ID
                    let videoId = '';
                    if (videoUrl.includes('youtube.com/watch?v=')) {
                      videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
                    } else if (videoUrl.includes('youtu.be/')) {
                      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
                    }
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    
                    return (
                      <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    );
                  } else if (isVimeo) {
                    // Extract Vimeo video ID
                    const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0] || '';
                    const embedUrl = `https://player.vimeo.com/video/${videoId}`;
                    
                    return (
                      <iframe
                        width="100%"
                        height="100%"
                        src={embedUrl}
                        title={title}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    );
                  } else {
                    // Direct video file (MP4, WebM, etc.)
                    return (
                      <video
                        controls
                        playsInline
                        {...({ webkitPlaysInline: true } as React.VideoHTMLAttributes<HTMLVideoElement>)}
                        className="w-full h-full object-contain"
                        src={videoUrl}
                        title={title}
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                })()
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <p className="text-white">{t('propertyDetail.videoNotAvailable') || 'Video not available'}</p>
                </div>
              )}
              
              {/* Navigation Arrows for Video — pointer-events-none so clicks reach the <video> controls */}
              {galleryImages.length > 1 && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => {
                        const newIndex = prev > 0 ? prev - 1 : galleryImages.length - 1;
                        return newIndex;
                      });
                    }}
                    className="pointer-events-auto absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => {
                        const newIndex = prev < galleryImages.length - 1 ? prev + 1 : 0;
                        return newIndex;
                      });
                    }}
                    className="pointer-events-auto absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6 text-foreground" />
                  </button>
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-foreground">
                    {safeIndex + 1} / {galleryImages.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Image Gallery - Custom implementation */
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
                      setCurrentImageIndex((prev) => {
                        const newIndex = prev > 0 ? prev - 1 : galleryImages.length - 1;
                        return newIndex;
                      });
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
                      setCurrentImageIndex((prev) => {
                        const newIndex = prev < galleryImages.length - 1 ? prev + 1 : 0;
                        return newIndex;
                      });
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
          )}

          {/* Badges - Top Left — pointer-events-none when video so taps reach controls */}
          {property && (
            <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 z-20 ${isVideo ? 'pointer-events-none' : ''}`}>
              {/* Status Badge - Sold/Rented (Red) */}
              {(property.status === 'sold' || property.status === 'rented') && (
                <Badge className="bg-red-600 text-white border-0 font-semibold">
                  {property.status === 'sold' 
                    ? (t('editProperty.sold') || 'Sold')
                    : (t('editProperty.rented') || 'Rented')}
                </Badge>
              )}
              {property.tan_tan_tan && <TanTanTanBadge />}
              {(property.premium || property.is_trending) && <PremiumBadge />}
              {property.is_featured && (
                <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  {t('listings.featured') || 'Featured'}
                </Badge>
              )}
            </div>
          )}

          {/* Actions - Top Right (grouped together) */}
          {!isVideo && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-20">
              <button
                onClick={onFavorite}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                  }`}
                />
              </button>
              <ShareModal title={title} url={shareUrl}>
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  title="Share property"
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
          )}

          {/* Property Code - Left Bottom */}
          {!isVideo && property && property.code && (
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-10">
              <div className="bg-background/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20">
                <span className="text-white text-xs sm:text-sm font-medium">{property.code}</span>
              </div>
            </div>
          )}

          {/* Stats */}
          {!isVideo && property && (
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 md:gap-3 z-10">
              <div className="flex items-center gap-1 text-white bg-background/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">{(property.stats?.view_count || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-white bg-background/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20">
                <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">{property.stats?.like_count || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-white bg-background/20 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-xs sm:text-sm">
                  {(() => {
                    // Calculate total comments including replies
                    if (!property.comments || !Array.isArray(property.comments)) {
                      return property.stats?.comment_count || 0;
                    }
                    const totalComments = property.comments.length;
                    const totalReplies = property.comments.reduce((sum: number, comment: any) => {
                      return sum + (comment.replies?.length || comment.reply_count || 0);
                    }, 0);
                    return totalComments + totalReplies;
                  })()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation - OUTSIDE the main image container - Only show if more than 1 item */}
        {galleryImages.length > 1 && (
          <div className="w-full bg-background border-t border-border p-2 sm:p-0">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {galleryImages.map((item, idx) => {
                const isVideoItem = item.type === 'video';
                const thumbnailSrc = item.thumbnail_url || item.url;
                console.log('Rendering thumbnail', idx, thumbnailSrc, 'safeIndex:', safeIndex, 'isVideo:', isVideoItem);
                return (
                  <div
                    key={`thumb-${item.id}-${idx}`}
                    className={`relative aspect-video rounded overflow-hidden border-2 transition-all cursor-pointer ${
                      safeIndex === idx 
                        ? 'border-primary ring-2 ring-primary/30' 
                        : 'border-transparent hover:border-border'
                    }`}
                    style={{ 
                      width: '100%', 
                      display: 'block',
                      position: 'relative',
                      backgroundColor: '#f3f4f6'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Thumbnail clicked:', idx);
                      if (idx >= 0 && idx < galleryImages.length) {
                        setCurrentImageIndex(idx);
                      }
                    }}
                  >
                    <img
                      src={thumbnailSrc}
                      alt={item.filename || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      onError={(e) => {
                        console.error('Thumbnail image failed to load:', thumbnailSrc);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {isVideoItem && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-4 w-4 sm:h-5 sm:w-5 text-black fill-black" />
                        </div>
                      </div>
                    )}
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

      {/* Full Screen Lightbox/Modal */}
      {isLightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          initialIndex={safeIndex}
          onClose={() => setIsLightboxOpen(false)}
          onIndexChange={setCurrentImageIndex}
        />
      )}
    </Card>
  );
}

// Full Screen Image Lightbox Component
interface ImageLightboxProps {
  images: Array<{
    id: number;
    filename: string;
    url: string;
    thumbnail_url?: string;
    type?: string;
  }>;
  initialIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

function ImageLightbox({ images, initialIndex, onClose, onIndexChange }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync with parent when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation
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
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Header with Close Button - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 z-20 flex justify-end p-4 pointer-events-none">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg border-2 border-white/50 pointer-events-auto"
          title="Close (Esc)"
        >
          <X className="h-6 w-6 text-black" />
        </button>
      </div>

      {/* Main Image Container - Centered */}
      <div className="flex-1 flex items-center justify-center p-4 relative min-h-0">
        {/* Navigation Arrows - Fixed to Viewport Center */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg border-2 border-white/50 hover:scale-110 pointer-events-auto"
              title="Previous (←)"
            >
              <ChevronLeft className="h-8 w-8 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg border-2 border-white/50 hover:scale-110 pointer-events-auto"
              title="Next (→)"
            >
              <ChevronRight className="h-8 w-8 text-black" />
            </button>
          </>
        )}

        {/* Main Image */}
        <img
          src={currentImage.url}
          alt={currentImage.filename || 'Property image'}
          className="max-w-full max-h-full object-contain pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Page Indicator - Fixed Position */}
      {images.length > 1 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full text-base font-semibold text-black shadow-lg border-2 border-white/50 pointer-events-none">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail Navigation - Fixed Position */}
      {images.length > 1 && (
        <>
          <style>{`
            .lightbox-thumbnail-btn {
              width: 80px !important;
              height: 35px !important;
              min-height: 35px !important;
              max-height: 35px !important;
              flex-shrink: 0 !important;
            }
            .lightbox-thumbnail-img {
              width: 80px !important;
              height: 35px !important;
              object-fit: cover !important;
              display: block !important;
            }
          `}</style>
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-md border-t border-white/20 py-1.5 px-3 pointer-events-auto">
            <div className="flex justify-center gap-1.5 overflow-x-auto max-w-full">
              {images.map((img, idx) => (
                <button
                  key={`lightbox-thumb-${img.id}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    onIndexChange(idx);
                  }}
                  className={`lightbox-thumbnail-btn rounded overflow-hidden border-2 transition-all ${
                    currentIndex === idx
                      ? 'border-white ring-2 ring-white/50 shadow-lg'
                      : 'border-white/30 hover:border-white/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.thumbnail_url || img.url}
                    alt={img.filename || `Thumbnail ${idx + 1}`}
                    className="lightbox-thumbnail-img"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

