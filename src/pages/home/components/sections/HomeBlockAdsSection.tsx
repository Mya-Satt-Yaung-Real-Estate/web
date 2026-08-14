import { memo, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeBlockAds } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'motion/react';
import type { HomeBlockAdsData, SliderAd } from '@/types/ads';
import { HomeAdTargetLink } from '@/lib/homeAdNavigation';

/** API `grid_index` 1–2: left (1) and right (2) horizontal block slots. */
const SLOT_KEYS = ['1', '2'] as const;

const SLOT_HEIGHT_CLASSES = 'h-[220px]';
const GRID_LAYOUT_CLASSES = 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:gap-6';
const AUTO_ADVANCE_MS = 4000;

const DEFAULT_BLOCK_AD_IMAGE_URL =
  'https://media.jadeproperty.com.mm/default/ads/grid_ads_default.png';

const DefaultBlockSlot = memo(function DefaultBlockSlot() {
  return (
    <div
      className={`relative w-full ${SLOT_HEIGHT_CLASSES} overflow-hidden rounded-lg border border-border/50 shadow-md`}
    >
      <ImageWithFallback
        src={DEFAULT_BLOCK_AD_IMAGE_URL}
        alt="Contact us to advertise on Jade Property"
        className="h-full w-full object-cover"
      />
    </div>
  );
});

function BlockSlotCarousel({ slides }: { slides: SliderAd[] }) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slides.length),
      AUTO_ADVANCE_MS
    );
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  useEffect(() => {
    if (slides.length > 0 && currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  if (slides.length === 0) return null;

  const currentAd = slides[currentIndex];
  const title = language === 'mm' ? currentAd.title_mm : currentAd.title_en;
  const description = language === 'mm' ? currentAd.description_mm : currentAd.description_en;
  const imageUrl =
    currentAd.images && typeof currentAd.images === 'object' && 'url' in currentAd.images
      ? (currentAd.images as { url?: string }).url || ''
      : '';
  const adLink = currentAd.link?.trim();
  const companySlug = currentAd.user?.company?.slug;
  const href = adLink || (companySlug ? `/companies/${companySlug}` : '#');
  const opensInNewTab = Boolean(adLink);
  const isClickable = href !== '#';
  const linkLabel =
    ([title, description].filter(Boolean).join('. ').slice(0, 120) || 'Advertisement') +
    (opensInNewTab ? ' (opens in new tab)' : '');

  const shellClass =
    `relative w-full ${SLOT_HEIGHT_CLASSES} rounded-lg overflow-hidden shadow-md border border-border/50` +
    (isClickable
      ? ' cursor-pointer transition-shadow hover:shadow-lg hover:ring-2 hover:ring-primary/30'
      : '');

  return (
    <div
      className="relative group min-w-0 w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={shellClass}>
        {isClickable && (
          <HomeAdTargetLink
            ad={currentAd}
            className="absolute inset-0 z-0 rounded-lg"
            ariaLabel={linkLabel}
          />
        )}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              {imageUrl ? (
                <ImageWithFallback src={imageUrl} alt={title || 'Ad'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
              {title ? (
                <div className="absolute left-2 right-2 top-2 z-[2] text-left">
                  <p className="inline-block max-w-full rounded-md bg-black/55 px-2 py-1 text-left text-xs font-semibold leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
                    {title}
                  </p>
                </div>
              ) : null}
              {description ? (
                <div className="pointer-events-none absolute bottom-9 left-2 right-2 top-14 z-[2] flex items-center justify-center">
                  <p className="max-w-full rounded-md bg-black/50 px-2 py-1.5 text-center text-xs leading-snug text-white line-clamp-4 [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
                    {description}
                  </p>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
              }}
              className="absolute left-2 top-1/2 z-[12] -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % slides.length);
              }}
              className="absolute right-2 top-1/2 z-[12] -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            {!isPaused && (
              <div className="absolute bottom-0 left-0 right-0 z-[11] h-0.5 bg-white/20 rounded-b-lg pointer-events-none">
                <motion.div
                  key={currentIndex}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                />
              </div>
            )}
            <div className="absolute bottom-2.5 left-1/2 z-[12] flex -translate-x-1/2 gap-1 pointer-events-auto">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const HomeBlockAdsSection = memo(function HomeBlockAdsSection() {
  const { data, isLoading, error } = useHomeBlockAds();

  const block = useMemo(() => {
    const payload = data?.data?.data;
    if (!payload || typeof payload !== 'object') return null;
    return payload as HomeBlockAdsData;
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-busy="true">
        <div className={`max-w-7xl mx-auto ${GRID_LAYOUT_CLASSES}`}>
          {SLOT_KEYS.map((key) => (
            <Skeleton key={key} className={`${SLOT_HEIGHT_CLASSES} w-full rounded-lg min-w-0`} />
          ))}
        </div>
      </section>
    );
  }

  const safeBlock = !error && block ? block : null;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-7xl mx-auto ${GRID_LAYOUT_CLASSES}`}>
        {SLOT_KEYS.map((key) => {
          const slides = safeBlock?.[key] ?? [];
          if (slides.length === 0) {
            return (
              <div key={key} className="min-w-0 w-full">
                <DefaultBlockSlot />
              </div>
            );
          }
          return (
            <div key={key} className="min-w-0 w-full">
              <BlockSlotCarousel slides={slides} />
            </div>
          );
        })}
      </div>
    </section>
  );
});
