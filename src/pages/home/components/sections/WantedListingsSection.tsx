/**
 * Wanted Listings Section
 * 
 * Displays wanted property listings from the API.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeWantedCard } from '../cards';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeWantedListings } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';

export const WantedListingsSection = memo(function WantedListingsSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeWantedListings();

  // Get wanted listings from API response
  const wantedListings = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{t('search.errorLoadingWanted') || 'Failed to load wanted listings. Please try again later.'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (wantedListings.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="mb-4">{t('wanted.title') || 'Wanted Listings'}</h2>
              <p className="text-muted-foreground">
                {t('wanted.subtitle') || 'Browse active property requests from buyers and renters'}
              </p>
            </div>
            <Link to="/search?type=wanted">
              <Button variant="outline">
                {t('wanted.viewAll') || 'View All Requests'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <p>{t('search.noWantedFound') || 'No wanted listings found'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('wanted.title') || 'Wanted Listings'}</h2>
            <p className="text-muted-foreground">
              {t('wanted.subtitle') || 'Browse active property requests from buyers and renters'}
            </p>
          </div>
          <Link to="/search?type=wanted">
            <Button variant="outline">
              {t('wanted.viewAll') || 'View All Requests'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {wantedListings.map(wanted => (
            <HomeWantedCard key={wanted.id} wanted={wanted} />
          ))}
        </div>
      </div>
    </section>
  );
});

