import { useWantedLists } from '@/hooks/queries/useWantedLists';
import { WantedListingCard } from './WantedListingCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export function WantedList() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useWantedLists({ per_page: 20 });

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
          {t('search.errorLoading') || 'Error loading wanted listings. Please try again.'}
        </p>
      </Card>
    );
  }

  const wantedLists = data?.data?.data || [];

  if (wantedLists.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="mb-2">{t('search.noWantedListings') || 'No wanted listings found'}</h3>
        <p className="text-muted-foreground">
          {t('search.tryAdjustingFilters') || 'Try adjusting your search or filters'}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wantedLists.map((wanted) => (
        <WantedListingCard key={wanted.id} wanted={wanted} />
      ))}
    </div>
  );
}

