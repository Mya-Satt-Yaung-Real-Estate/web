import { usePublicProperties } from '@/hooks/queries/usePublicProperties';
import { PropertyCard } from '@/components/features/properties/PropertyCard';
import { InfiniteScrollList } from '@/components/features/InfiniteScrollList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import type { PublicPropertyFilters } from '@/types/publicProperties';
import { useLanguage } from '@/contexts/LanguageContext';

interface PropertyListProps {
  filters?: PublicPropertyFilters;
}

export function PropertyList({ filters }: PropertyListProps) {
  const { t } = useLanguage();
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePublicProperties(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          {t('search.errorLoadingProperties') || 'Failed to load properties. Please try again later.'}
        </p>
      </Card>
    );
  }

  const properties = data?.pages.flatMap(page => page.data?.data || []) || [];

  if (properties.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="mb-2">{t('search.noResultsFound') || 'No results found'}</h3>
        <p className="text-muted-foreground">
          {t('search.tryAdjustingFilters') || 'Try adjusting your search or filters'}
        </p>
      </Card>
    );
  }

  const loadingSkeletons = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[...Array(6)].map((_, i) => (
        <Card key={`skeleton-${i}`} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <InfiniteScrollList
      hasNextPage={hasNextPage || false}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      loadingComponent={loadingSkeletons}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </InfiniteScrollList>
  );
}

