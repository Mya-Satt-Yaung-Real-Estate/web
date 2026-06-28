import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeBlockAds } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'motion/react';
import type { HomeBlockAdsData, SliderAd } from '@/types/ads';

function flattenHomeBlockAds(payload: HomeBlockAdsData): SliderAd[] {
  return [...(payload['1'] ?? []), ...(payload['2'] ?? [])];
}

export function HomeBlockAdsCarousel() {
  const { language } = useLanguage();
  const { data, isLoading, error } = useHomeBlockAds();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Transform grouped API data into a flat list for this carousel
  const sliderAds = useMemo((): SliderAd[] => {
    const payload = data?.data?.data;
    if (!payload || typeof payload !== 'object') return [];
    return flattenHomeBlockAds(payload as HomeBlockAdsData);
  }, [data]);

  // Auto-play effect
  useEffect(() => {
    if (isPaused || sliderAds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderAds.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, sliderAds.length]);

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliderAds.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sliderAds.length) % sliderAds.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="w-full h-[160px] rounded-xl" />
        </div>
      </section>
    );
  }

  // Error or empty state
  if (error || sliderAds.length === 0) {
    return null; // Hide carousel if no ads
  }

  const currentAd = sliderAds[currentIndex] as SliderAd;
  const title = language === 'mm' ? currentAd.title_mm : currentAd.title_en;
  const description = language === 'mm' ? currentAd.description_mm : currentAd.description_en;
  const isButtonLink = currentAd.link_type === 'button_link' && currentAd.link && currentAd.link_text;
  const isTextLink = currentAd.link_type === 'text_link' && currentAd.link && currentAd.link_text;
  const isImageLink = currentAd.link_type === 'image_link' && currentAd.link;
  const imageUrl = currentAd.images?.url || '';
  const textColor = currentAd.text_color_code || '#FFFFFF'; // Default to white if not provided

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Poster Display */}
          <div className="relative h-[160px] rounded-xl overflow-hidden shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={imageUrl}
                    alt={title || `Slide ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center px-4 sm:px-6">
                  <div className="w-full grid grid-cols-4 gap-4">
                    {/* First column - empty */}
                    <div className="col-span-1"></div>
                    
                    {/* Second column - Title and Description */}
                    <div className="col-span-1">
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

                      {/* Link Elements */}
                      {isButtonLink && currentAd.link && currentAd.link_text && (
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
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
                        <motion.a
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
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
                        </motion.a>
                      )}
                    </div>
                    
                    {/* Third and Fourth columns - empty */}
                    <div className="col-span-2"></div>
                  </div>
                </div>

                {/* Image Link - Make entire slide clickable */}
                {isImageLink && currentAd.link && (
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => handleLinkClick(currentAd.link!)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {sliderAds.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            {/* Dots Indicator */}
            {sliderAds.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {sliderAds.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {!isPaused && sliderAds.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-b-xl">
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
    </section>
  );
}

