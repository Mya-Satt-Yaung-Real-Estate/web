/**
 * Featured Advertisements Section
 * 
 * Displays featured advertisements from the API.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeAdvertisementCard } from '../cards';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeFeaturedAdvertisements } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';

export const FeaturedAdvertisementsSection = memo(function FeaturedAdvertisementsSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeFeaturedAdvertisements();

  // Get advertisements from API response
  const advertisements = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{t('search.errorLoadingAds') || 'Failed to load advertisements. Please try again later.'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (advertisements.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="mb-4">{t('ads.title')}</h2>
              <p className="text-muted-foreground">
                {t('ads.subtitle')}
              </p>
            </div>
            <Link to="/search?type=advertisement">
              <Button variant="outline">
                {t('ads.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <p>{t('search.noAdsFound') || 'No advertisements found'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('ads.title')}</h2>
            <p className="text-muted-foreground">
              {t('ads.subtitle')}
            </p>
          </div>
          <Link to="/search?type=advertisement">
            <Button variant="outline">
              {t('ads.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {advertisements.map(advertisement => (
            <HomeAdvertisementCard key={advertisement.id} advertisement={advertisement} />
          ))}
        </div>
      </div>
    </section>
  );
});

