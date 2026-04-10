/**
 * Company Logo Section
 *
 * Displays company logo/name list as a horizontal slider.
 */

import { memo, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeCompanyLogoLists } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { AnimatePresence, motion } from 'motion/react';
import type { CompanyLogoItem } from '@/types/company';

export const CompanyLogoSection = memo(function CompanyLogoSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeCompanyLogoLists();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);
  const [hoveredCompany, setHoveredCompany] = useState<CompanyLogoItem | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const logos = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data as CompanyLogoItem[];
  }, [data]);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth >= 1280) {
        setCardsPerView(6);
      } else if (window.innerWidth >= 1024) {
        setCardsPerView(4);
      } else if (window.innerWidth >= 768) {
        setCardsPerView(3);
      } else {
        setCardsPerView(2);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);

    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    if (isPaused || logos.length <= cardsPerView) return;

    const interval = setInterval(() => {
      setSlideDirection(1);
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, logos.length, cardsPerView]);

  const visibleLogos = useMemo(() => {
    if (logos.length === 0) return [];
    if (logos.length <= cardsPerView) return logos;

    return Array.from({ length: cardsPerView }, (_, offset) => {
      const index = (currentIndex + offset) % logos.length;
      return logos[index];
    });
  }, [logos, currentIndex, cardsPerView]);

  const nextSlide = () => {
    if (logos.length <= cardsPerView) return;
    setSlideDirection(1);
    setCurrentIndex((prev) => (prev + 1) % logos.length);
  };

  const prevSlide = () => {
    if (logos.length <= cardsPerView) return;
    setSlideDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + logos.length) % logos.length);
  };

  const handleCompanyMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const previewSize = 300;
    const offset = 20;
    const maxX = Math.max(0, window.innerWidth - previewSize - 12);
    const maxY = Math.max(0, window.innerHeight - previewSize - 12);
    const nextX = Math.min(maxX, event.clientX + offset);
    const nextY = Math.min(maxY, event.clientY + offset);
    setPreviewPosition({ x: nextX, y: nextY });
  };

  if (isLoading) {
    return (
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-14 w-14 rounded-full mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || logos.length === 0) {
    return null;
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="mb-2">
            {t('home.ourPartners') || 'Our Partner Companies'} ({logos.length})
          </h3>
          <p className="text-muted-foreground">
            {t('home.ourPartnersSubtitle') || 'Trusted real estate companies working with us'}
          </p>
        </div>

        <div
          className="relative px-10 sm:px-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {logos.length > cardsPerView && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous companies"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border bg-background/90 backdrop-blur flex items-center justify-center shadow hover:bg-background transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next companies"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full border bg-background/90 backdrop-blur flex items-center justify-center shadow hover:bg-background transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentIndex}-${cardsPerView}`}
              initial={{ opacity: 0, x: 28 * slideDirection }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 * slideDirection }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 place-items-center"
            >
              {visibleLogos.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.slug}`}
                  className="group w-[210px] p-3 text-center"
                  onMouseEnter={(event) => {
                    setHoveredCompany(company);
                    handleCompanyMouseMove(event);
                  }}
                  onMouseMove={handleCompanyMouseMove}
                  onMouseLeave={() => setHoveredCompany(null)}
                >
                  <div className="w-28 h-30 mx-auto rounded-full overflow-hidden border bg-background/40 flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105">
                    {company.logo_url ? (
                      <ImageWithFallback
                        src={company.logo_url}
                        alt={company.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {company.name}
                  </p>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {hoveredCompany && (
        <div
          className="hidden lg:flex fixed z-50 w-[300px] h-[300px] rounded-2xl border bg-background shadow-2xl overflow-hidden pointer-events-none"
          style={{ left: `${previewPosition.x}px`, top: `${previewPosition.y}px` }}
        >
          <div className="relative w-full h-full bg-muted/20 flex items-center justify-center">
            {hoveredCompany.logo_url ? (
              <ImageWithFallback
                src={hoveredCompany.logo_url}
                alt={hoveredCompany.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="h-24 w-24 text-muted-foreground" />
            )}

            <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-black/30">
              <p className="text-lg font-semibold text-white text-center truncate w-full">
                {hoveredCompany.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

