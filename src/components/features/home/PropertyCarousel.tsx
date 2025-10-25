import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobileOrTablet } from '@/hooks/useMediaQuery';
import { MobilePropertyCarousel } from './mobile';

const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop',
    titleKey: 'carousel.villa',
    descriptionKey: 'carousel.villaDesc',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&auto=format&fit=crop',
    titleKey: 'carousel.apartment',
    descriptionKey: 'carousel.apartmentDesc',
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop',
    titleKey: 'carousel.office',
    descriptionKey: 'carousel.officeDesc',
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&auto=format&fit=crop',
    titleKey: 'carousel.estate',
    descriptionKey: 'carousel.estateDesc',
  },
  {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&auto=format&fit=crop',
    titleKey: 'carousel.condo',
    descriptionKey: 'carousel.condoDesc',
  },
];

export function PropertyCarousel() {
  const { t } = useLanguage();
  const isMobileOrTablet = useIsMobileOrTablet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  // Use mobile component for mobile/tablet
  if (isMobileOrTablet) {
    return <MobilePropertyCarousel />;
  }

  // Desktop version (100% Figma match)
  return (
    <div className="relative w-full h-[60vh] md:h-[65vh] overflow-hidden group">
      {/* Images */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ImageWithFallback
              src={image.url}
              alt={t(image.titleKey)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="mb-4 text-white animate-fade-in text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  {t(image.titleKey)}
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in text-base sm:text-lg md:text-xl">
                  {t(image.descriptionKey)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 w-12 h-12"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 w-12 h-12"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-12'
                : 'bg-white/50 hover:bg-white/75 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <button
          onClick={scrollToContent}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors group/scroll"
        >
          <span className="text-sm">{t('carousel.scrollDown')}</span>
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}