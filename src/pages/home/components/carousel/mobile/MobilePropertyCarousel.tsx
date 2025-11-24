import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeSliderAds } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import type { SliderAd } from '@/types/ads';

export function MobilePropertyCarousel() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useHomeSliderAds();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Transform API data
  const sliderAds = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || sliderAds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderAds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderAds.length]);

  // Reset index when ads change
  useEffect(() => {
    if (sliderAds.length > 0 && currentIndex >= sliderAds.length) {
      setCurrentIndex(0);
    }
  }, [sliderAds.length, currentIndex]);

  const handleLinkClick = (link: string) => {
    // Always open in new tab (API provides full URLs)
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    if (sliderAds.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + sliderAds.length) % sliderAds.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    if (sliderAds.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % sliderAds.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // Error or empty state
  if (error || sliderAds.length === 0) {
    return null; // Hide carousel if no ads
  }

  return (
    <div className="relative w-full h-[60vh] overflow-hidden group">
      {/* Images */}
      <div className="relative w-full h-full">
        {sliderAds.map((ad: SliderAd, index: number) => {
          const title = language === 'mm' ? ad.title_mm : ad.title_en;
          const description = language === 'mm' ? ad.description_mm : ad.description_en;
          const isButtonLink = ad.link_type === 'button_link' && ad.link && ad.link_text;
          const isTextLink = ad.link_type === 'text_link' && ad.link && ad.link_text;
          const isImageLink = ad.link_type === 'image_link' && ad.link;
          const imageUrl = ad.images?.url || '';
          const textColor = ad.text_color_code || '#FFFFFF'; // Default to white if not provided

          return (
            <div
              key={ad.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } ${isImageLink ? 'cursor-pointer' : ''}`}
              onClick={isImageLink && ad.link && index === currentIndex ? () => handleLinkClick(ad.link!) : undefined}
            >
              <ImageWithFallback
                src={imageUrl}
                alt={title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {(title || description || isButtonLink || isTextLink) && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
              )}
              
              {/* Text Overlay - Mobile Optimized */}
              {(title || description || isButtonLink || isTextLink) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <div className="max-w-4xl mx-auto">
                    {title && (
                      <h2 
                        className="mb-2 animate-fade-in text-xl font-bold"
                        style={{ color: textColor }}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p 
                        className="max-w-2xl mx-auto mb-4 animate-fade-in text-sm"
                        style={{ color: textColor }}
                      >
                        {description}
                      </p>
                    )}
                    {isButtonLink && ad.link && ad.link_text && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(ad.link!);
                        }}
                        size="lg"
                        variant="secondary"
                        className="shadow-2xl hover:scale-105 transition-transform hover:opacity-90 cursor-pointer"
                        style={{ color: textColor, borderColor: textColor }}
                      >
                        <span style={{ color: textColor }}>{ad.link_text}</span>
                      </Button>
                    )}
                    {isTextLink && ad.link && ad.link_text && (
                      <a
                        href={ad.link}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLinkClick(ad.link!);
                        }}
                        className="text-base underline hover:opacity-90 transition-colors inline-block"
                        style={{ color: textColor }}
                      >
                        {ad.link_text}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Mobile Optimized */}
      {sliderAds.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-100 transition-opacity bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 w-10 h-10 touch-manipulation"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 transition-opacity bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 w-10 h-10 touch-manipulation"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Dots Indicator - Mobile Optimized */}
      {sliderAds.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderAds.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all touch-manipulation ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

