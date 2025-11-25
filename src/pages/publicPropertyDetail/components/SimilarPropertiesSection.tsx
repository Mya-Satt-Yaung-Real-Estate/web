/**
 * Similar Properties Section
 * 
 * Displays similar properties related to the current property.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomePropertyCard } from '@/pages/home/components/cards/HomePropertyCard';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRelatedProperties } from '@/hooks/queries/useRelatedProperties';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { memo, useMemo } from 'react';
import { usePublicProperty } from '@/hooks/queries/usePublicProperties';

interface SimilarPropertiesSectionProps {
  slug: string;
}

export const SimilarPropertiesSection = memo(function SimilarPropertiesSection({ slug }: SimilarPropertiesSectionProps) {
  const { t } = useLanguage();
  const { data, isLoading, error } = useRelatedProperties(slug);
  const { data: propertyData } = usePublicProperty(slug);

  // Get properties from API response (limit to 4)
  const similarProperties = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data.slice(0, 4);
  }, [data]);

  // Build "View All" link with filters
  const viewAllLink = useMemo(() => {
    if (!propertyData?.data?.data) return '/search?type=property';
    
    const property = propertyData.data.data;
    const params = new URLSearchParams();
    params.set('type', 'property');
    
    if (property.property_type?.id) {
      params.set('property_type_id', property.property_type.id.toString());
    }
    if (property.listing_type?.id) {
      params.set('listing_type_id', property.listing_type.id.toString());
    }
    if (property.location?.region?.id) {
      params.set('region_id', property.location.region.id.toString());
    }
    
    return `/search?${params.toString()}`;
  }, [propertyData]);

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
  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="mb-4">
              {t('similarProperties.title') || 'Similar Properties'}
            </h2>
            <p className="text-muted-foreground">
              {t('similarProperties.subtitle') || 'You might also be interested in these'}
            </p>
          </div>
          <Link to={viewAllLink}>
            <Button variant="outline">
              {t('similarProperties.viewAll') || t('featured.viewAll') || t('listings.viewAll') || 'View All'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {similarProperties.map(property => (
            <HomePropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
});

