/**
 * Advertisements Section
 * 
 * Lazy-loaded section for advertisements.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AdvertisementCard } from '@/components/features/home/AdvertisementCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Advertisement {
  id: string;
  image: string;
  title: string;
  description: string;
  company: string;
  category: string;
  validUntil: string;
  promoted: boolean;
}

interface AdvertisementsSectionProps {
  advertisements: Advertisement[];
}

export function AdvertisementsSection({ advertisements }: AdvertisementsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('ads.title')}</h2>
            <p className="text-muted-foreground">
              {t('ads.subtitle')}
            </p>
          </div>
          <Link to="/search-all?type=advertisement">
            <Button variant="outline">
              {t('ads.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map(ad => (
            <AdvertisementCard key={ad.id} {...ad} />
          ))}
        </div>
      </div>
    </section>
  );
}
