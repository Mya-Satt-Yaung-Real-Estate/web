/**
 * Premium Posts Section
 * 
 * Section for premium property posts using real API data.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HomePropertyCard } from '../cards/HomePropertyCard';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomePremiumProperties } from '@/hooks/queries/home';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';

export const PremiumPostsSection = memo(function PremiumPostsSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomePremiumProperties();

  // Get properties from API response
  const premiumProperties = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">
            <p>{t('search.errorLoadingPremium') || 'Failed to load premium properties. Please try again later.'}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (premiumProperties.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2>{t('premium.title')}</h2>
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Premium
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {t('premium.subtitle')}
              </p>
            </div>
            <Link to="/search?type=premium">
              <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                {t('premium.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="text-center text-muted-foreground py-12">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t('search.noPremiumFound') || 'No premium properties found'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2>{t('premium.title')}</h2>
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Premium
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {t('premium.subtitle')}
            </p>
          </div>
          <Link to="/search?type=premium">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
              {t('premium.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {premiumProperties.map(property => (
            <HomePropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
});

