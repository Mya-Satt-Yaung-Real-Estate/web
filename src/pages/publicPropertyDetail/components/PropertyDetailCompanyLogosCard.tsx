/**
 * Partner company logos — sidebar on public property detail (2×3 grid, paginated when >6).
 * Shows each approved partner once: 1 centered, 2–6 in grid, 7+ paginated (no duplicate fill).
 */

import { memo, useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { usePropertyDetailCompanyLogoLists } from '@/hooks/queries/home';
import { AnimatePresence, motion } from 'motion/react';
import type { CompanyLogoItem } from '@/types/company';

const LOGOS_PER_PAGE = 6;
const AUTO_PAGE_MS = 8000;

interface PropertyDetailCompanyLogosCardProps {
  t: (key: string) => string | undefined;
}

export const PropertyDetailCompanyLogosCard = memo(function PropertyDetailCompanyLogosCard({
  t,
}: PropertyDetailCompanyLogosCardProps) {
  const { data, isLoading, error } = usePropertyDetailCompanyLogoLists();
  const [pageIndex, setPageIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoveredCompany, setHoveredCompany] = useState<CompanyLogoItem | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });

  const logos = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data as CompanyLogoItem[];
  }, [data]);

  const totalPages = useMemo(() => {
    if (logos.length === 0) return 0;
    return Math.ceil(logos.length / LOGOS_PER_PAGE);
  }, [logos.length]);

  useEffect(() => {
    if (totalPages <= 0) return;
    setPageIndex((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const pageSlots = useMemo((): CompanyLogoItem[] => {
    if (logos.length === 0) return [];
    const start = pageIndex * LOGOS_PER_PAGE;
    return logos.slice(start, start + LOGOS_PER_PAGE);
  }, [logos, pageIndex]);

  useEffect(() => {
    if (paused || logos.length <= LOGOS_PER_PAGE || totalPages <= 1) return;
    const id = setInterval(() => {
      setPageIndex((p) => (p + 1) % totalPages);
    }, AUTO_PAGE_MS);
    return () => clearInterval(id);
  }, [paused, logos.length, totalPages]);

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
      <Card>
        <CardContent className="p-6 pt-7">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 gap-4 place-items-center">
            {Array.from({ length: LOGOS_PER_PAGE }).map((_, i) => (
              <div key={i} className="flex w-full flex-col items-center p-3 text-center">
                <Skeleton className="mb-2 h-28 w-28 shrink-0 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || logos.length === 0) {
    return null;
  }

  /**Used to determine if the company logos should be displayed in a single column or in a grid */
  const isSingleCompany = pageSlots.length === 1;

  return (
    <>
      <Card
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setHoveredCompany(null);
        }}
      >
      <CardContent className="p-6 pt-7">
        <h4 className="mb-4">{t('propertyDetail.partnerCompanies') || 'Partner companies'}</h4>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={
              isSingleCompany
                ? 'flex justify-center'
                : 'grid grid-cols-2 gap-4 place-items-center'
            }
          >
            {pageSlots.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.slug}`}
                  className={`group flex flex-col items-center p-3 text-center${isSingleCompany ? '' : ' w-full'}`}
                  onMouseEnter={(event) => {
                    setHoveredCompany(company);
                    handleCompanyMouseMove(event);
                  }}
                  onMouseMove={handleCompanyMouseMove}
                  onMouseLeave={() => setHoveredCompany(null)}
                >
                  <div className="mx-auto mb-2 flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background/40 transition-transform duration-200 group-hover:scale-105">
                    {company.logo_url ? (
                      <ImageWithFallback
                        src={company.logo_url}
                        alt={company.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                  <p className="w-full truncate text-sm font-medium transition-colors group-hover:text-primary">
                    {company.name}
                  </p>
                </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPageIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === pageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>

      {hoveredCompany && (
        <div
          className="pointer-events-none fixed z-50 hidden h-[300px] w-[300px] overflow-hidden rounded-2xl border bg-background shadow-2xl lg:flex"
          style={{ left: `${previewPosition.x}px`, top: `${previewPosition.y}px` }}
        >
          <div className="relative flex h-full w-full items-center justify-center bg-muted/20">
            {hoveredCompany.logo_url ? (
              <ImageWithFallback
                src={hoveredCompany.logo_url}
                alt={hoveredCompany.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-24 w-24 text-muted-foreground" aria-hidden />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/30 px-4 py-3">
              <p className="w-full truncate text-center text-lg font-semibold text-white">{hoveredCompany.name}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
