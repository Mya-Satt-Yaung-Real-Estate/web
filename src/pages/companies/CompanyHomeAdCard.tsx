import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SliderAd } from '@/types/ads';

interface CompanyHomeAdCardProps {
  ad: SliderAd;
}

export function CompanyHomeAdCard({ ad }: CompanyHomeAdCardProps) {
  const { t, language } = useLanguage();
  const title = language === 'mm' ? ad.title_mm : ad.title_en;
  const description = language === 'mm' ? ad.description_mm : ad.description_en;
  const imageUrl = ad.images && typeof ad.images === 'object' && 'url' in ad.images
    ? ad.images.url || ''
    : '';

  return (
    <Card className="overflow-hidden border-border/60 bg-background/95 shadow-lg">
      <div className="relative h-[220px] w-full">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title || t('companies.homeAd')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        {title ? (
          <div className="absolute left-3 right-3 top-3">
            <p className="inline-block max-w-full rounded-md bg-black/55 px-2 py-1 text-left text-xs font-semibold leading-snug text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
              {title}
            </p>
          </div>
        ) : null}
        {description ? (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="max-w-full rounded-md bg-black/50 px-2 py-1.5 text-sm leading-snug text-white line-clamp-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.85)]">
              {description}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
