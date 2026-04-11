/**
 * Detail Sidebar Ads Carousel Component
 * 
 * Displays slider ads in the property detail page sidebar (under map location).
 * Fixed strip height (px), full bleed inside card; image uses object-cover (fills frame, no letterboxing).
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import type { SliderAd } from '@/types/ads';
import { useDetailSidebarAds, type DetailSidebarAdsSlot } from '@/hooks/queries/home';

const STRIP_HEIGHT_PX = 180;

interface DetailSidebarAdsCarouselProps {
  sidebarSlot?: DetailSidebarAdsSlot;
}

export function DetailSidebarAdsCarousel({ sidebarSlot = 1 }: DetailSidebarAdsCarouselProps) {
  const { language } = useLanguage();
  const { data, isLoading, error } = useDetailSidebarAds(sidebarSlot);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const adsList = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  useEffect(() => {
    if (!isPaused && adsList.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % adsList.length);
      }, 4000); // Auto-slide every 4 seconds
      return () => clearInterval(interval);
    }
  }, [isPaused, adsList.length]);

  useEffect(() => {
    if (adsList.length > 0 && currentIndex >= adsList.length) {
      setCurrentIndex(0);
    }
  }, [adsList.length, currentIndex]);

  const handleLinkClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const goToPrevious = () => {
    setIsPaused(true);
    if (adsList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + adsList.length) % adsList.length);
  };

  const goToNext = () => {
    setIsPaused(true);
    if (adsList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % adsList.length);
  };

  const goToSlide = (index: number) => {
    setIsPaused(true);
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div
        className="w-full min-w-0 overflow-hidden"
        style={{ height: STRIP_HEIGHT_PX }}
      >
        <Skeleton className="h-full w-full rounded-none" />
      </div>
    );
  }

  if (error || adsList.length === 0) {
    return null;
  }

  const currentAd = adsList[currentIndex] as SliderAd;
  const title = language === 'mm' ? currentAd.title_mm : currentAd.title_en;
  const description = language === 'mm' ? currentAd.description_mm : currentAd.description_en;
  const isButtonLink = currentAd.link_type === 'button_link' && currentAd.link && currentAd.link_text;
  const isTextLink = currentAd.link_type === 'text_link' && currentAd.link && currentAd.link_text;
  const isImageLink = currentAd.link_type === 'image_link' && currentAd.link;
  const imageUrl = currentAd.images?.url || '';
  const textColor = currentAd.text_color_code || '#FFFFFF';

  return (
    <div className="w-full min-w-0">
      <div
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative w-full min-w-0 overflow-hidden"
          style={{ height: STRIP_HEIGHT_PX }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 min-h-0 min-w-0">
                <ImageWithFallback
                  src={imageUrl}
                  alt={title || `Ad ${currentIndex + 1}`}
                  className="block h-full w-full min-h-0 min-w-0 object-cover object-center"
                />
                {(title || description || isButtonLink || isTextLink) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                )}
              </div>

              {(title || description || isButtonLink || isTextLink) && (
                <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
                  <div className="w-full text-center">
                    {title && (
                      <motion.h4
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-1.5 text-base sm:text-lg font-semibold"
                        style={{ color: textColor }}
                      >
                        {title}
                      </motion.h4>
                    )}

                    {description && (
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-3 text-xs sm:text-sm"
                        style={{ color: textColor }}
                      >
                        {description}
                      </motion.p>
                    )}

                    {isButtonLink && currentAd.link && currentAd.link_text && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center"
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLinkClick(currentAd.link!);
                          }}
                          size="sm"
                          variant="secondary"
                          className="shadow-lg hover:scale-105 transition-transform hover:opacity-90 cursor-pointer"
                          style={{ color: textColor, borderColor: textColor }}
                        >
                          <span style={{ color: textColor }}>{currentAd.link_text}</span>
                        </Button>
                      </motion.div>
                    )}

                    {isTextLink && currentAd.link && currentAd.link_text && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center"
                      >
                        <a
                          href={currentAd.link}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLinkClick(currentAd.link!);
                          }}
                          className="text-xs sm:text-sm underline hover:opacity-90 transition-colors inline-block cursor-pointer"
                          style={{ color: textColor }}
                        >
                          {currentAd.link_text}
                        </a>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {isImageLink && currentAd.link && (
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => handleLinkClick(currentAd.link!)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {adsList.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {adsList.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {adsList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {!isPaused && adsList.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
              <motion.div
                key={currentIndex}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

