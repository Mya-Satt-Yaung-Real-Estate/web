import { memo, useMemo } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HomePropertyCard } from '../cards/HomePropertyCard';
import { useHomeJadeMarketProperties } from '@/hooks/queries/home';
import { useLanguage } from '@/contexts/LanguageContext';

export const HomeJadeMarketPropertiesSection = memo(function HomeJadeMarketPropertiesSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeJadeMarketProperties();

  const properties = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Skeleton className="mb-4 h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="mt-4 h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2>{t('home.jadeMarketplaceTitle')}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <ShoppingCart className="h-3.5 w-3.5" />
                {t('home.jadeMarketplaceBadge')}
              </span>
            </div>
            <p className="text-muted-foreground">
              {t('home.jadeMarketplaceSubtitle')}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/search?type=marketplace">
              {t('home.viewMarketplace')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <HomePropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
});
