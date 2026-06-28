import { memo, useEffect, useMemo, useState } from 'react';
import { useHomeGridAds } from '@/hooks/queries/home';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'motion/react';
import type { HomeGridAdsData, SliderAd } from '@/types/ads';

/**
 * API `grid_index` 1–4 maps row-major (LTR):
 * - md+: 2×2   [1][2] / [3][4]
 * - below md: single column (full width per slot — no half-width grid on phones)
 */
const SLOT_KEYS = ['1', '2', '3', '4'] as const;

/** Same tile height as desktop web cells; mobile uses full row width so images aren’t halved. */
const SLOT_HEIGHT_CLASSES = 'h-[220px]';

const GRID_LAYOUT_CLASSES = 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:gap-6';

/** Must match progress bar animation duration (HomeBlockAdsSection). */
const AUTO_ADVANCE_MS = 6000;

const DEFAULT_GRID_AD_IMAGE_URL =
  'https://media.jadeproperty.com.mm/default/ads/grid_ads_default.png';

const DefaultGridSlot = memo(function DefaultGridSlot() {
  return (
    <div
      className={`relative w-full ${SLOT_HEIGHT_CLASSES} overflow-hidden rounded-lg border border-border/50 shadow-md`}
    >
      <ImageWithFallback
        src={DEFAULT_GRID_AD_IMAGE_URL}
        alt="Contact us to advertise on Jade Property"
        className="h-full w-full object-cover"
      />
    </div>
  );
});

function SlotCarousel({ slides }: { slides: SliderAd[] }) {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => {
    if (slides.length > 0 && index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  if (slides.length === 0) return null;

  const ad = slides[index];
  const title = language === 'mm' ? ad.title_mm : ad.title_en;
  const description = language === 'mm' ? ad.description_mm : ad.description_en;
  const imageUrl = ad.images && typeof ad.images === 'object' && 'url' in ad.images ? (ad.images as { url?: string }).url || '' : '';
  const adLink = ad.link?.trim();
  const companySlug = ad.user?.company?.slug;
  const href = adLink || (companySlug ? `/companies/${companySlug}` : '#');
  const opensInNewTab = Boolean(adLink);
  const linkLabel =
    ([title, description].filter(Boolean).join('. ').slice(0, 120) || 'Advertisement') +
    (opensInNewTab ? ' (opens in new tab)' : '');

  const shellClass =
    `relative w-full ${SLOT_HEIGHT_CLASSES} rounded-lg overflow-hidden shadow-md border border-border/50` +
    (href !== '#' ? ' cursor-pointer transition-shadow hover:shadow-lg hover:ring-2 hover:ring-primary/30' : '');

  return (
    <div className={shellClass} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <a
        href={href}
        target={opensInNewTab ? '_blank' : undefined}
        rel={opensInNewTab ? 'noopener noreferrer' : undefined}
        className="absolute inset-0 z-0 rounded-lg"
        aria-label={linkLabel}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
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
          {!paused && (
            <div className="absolute bottom-0 left-0 right-0 z-[11] h-0.5 bg-white/20 rounded-b-lg">
              <motion.div
                key={index}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
              />
            </div>
          )}
          <div className="absolute bottom-2.5 left-1/2 z-[12] flex -translate-x-1/2 gap-1">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const HomeGridAdsSection = memo(function HomeGridAdsSection() {
  const { data, isLoading, error } = useHomeGridAds();

  const grid = useMemo(() => {
    const payload = data?.data?.data;
    if (!payload || typeof payload !== 'object') return null;
    return payload as HomeGridAdsData;
  }, [data]);

  if (isLoading) {
    return (
      <section className="pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-muted/30" aria-busy="true">
        <div className={`max-w-7xl mx-auto ${GRID_LAYOUT_CLASSES}`}>
          {SLOT_KEYS.map((key) => (
            <Skeleton key={key} className={`${SLOT_HEIGHT_CLASSES} w-full rounded-lg min-w-0`} />
          ))}
        </div>
      </section>
    );
  }

  /** When the request fails or payload is missing, treat every slot as empty (show default tile each). */
  const safeGrid = !error && grid ? grid : null;

  return (
    <section className="pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className={`max-w-7xl mx-auto ${GRID_LAYOUT_CLASSES}`}>
        {SLOT_KEYS.map((key) => {
          const slides = safeGrid?.[key] ?? [];
          if (slides.length === 0) {
            return (
              <div key={key} className="min-w-0 w-full">
                <DefaultGridSlot />
              </div>
            );
          }
          return (
            <div key={key} className="min-w-0 w-full">
              <SlotCarousel slides={slides} />
            </div>
          );
        })}
      </div>
    </section>
  );
});
