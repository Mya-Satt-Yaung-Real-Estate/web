/**
 * Property Listings Section
 * 
 * Section for featured property listings using real API data.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomePropertyCard } from '../cards/HomePropertyCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeFeaturedProperties } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';

export const PropertyListingsSection = memo(function PropertyListingsSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeFeaturedProperties();

  // Get properties from API response
  const featuredProperties = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{t('search.errorLoadingProperties') || 'Failed to load properties. Please try again later.'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (featuredProperties.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="mb-4">{t('listings.title')}</h2>
              <p className="text-muted-foreground">
                {t('listings.subtitle')}
              </p>
            </div>
            <Link to="/search?type=property">
              <Button variant="outline">
                {t('listings.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <p>{t('search.noResultsFound') || 'No properties found'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">{t('listings.title')}</h2>
            <p className="text-muted-foreground">
              {t('listings.subtitle')}
            </p>
          </div>
          <Link to="/search?type=property">
            <Button variant="outline">
              {t('listings.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProperties.map(property => (
            <HomePropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
});

