import { useShareProfitListings } from '@/hooks/queries/useShareProfitListings';
import { ShareProfitListingCard } from '@/pages/publicShareProfitListings/components/ShareProfitListingCard';
import { InfiniteScrollList } from '@/components/features/InfiniteScrollList';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import type { ShareProfitListFilters } from '@/services/api/shareProfitListing';

interface ShareProfitListProps {
  filters?: ShareProfitListFilters;
}

export function ShareProfitList({ filters }: ShareProfitListProps) {
  const { t, language } = useLanguage();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShareProfitListings({ ...filters, per_page: 30 });

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          {t('search.errorLoading') || 'Error loading listings. Please try again.'}
        </p>
      </Card>
    );
  }

  const listings = data?.pages.flatMap((page) => page.data?.data || []) || [];

  if (listings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="mb-2">
          {language === 'mm' ? 'အကျိုးတူရ စာရင်းမတွေ့ပါ' : 'No partnership posts found'}
        </h3>
        <p className="text-muted-foreground">
          {t('search.tryAdjustingFilters') || 'Try adjusting your search or filters'}
        </p>
      </Card>
    );
  }

  const loadingSkeletons = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {listings.map((listing) => (
          <ShareProfitListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </InfiniteScrollList>
  );
}
