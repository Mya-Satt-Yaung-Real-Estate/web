import { useHousingEvents } from '@/hooks/queries/useHousingEvents';
import { EventCard } from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HousingEventFilters } from '@/types/housingEvents';

interface EventListProps {
  filters?: HousingEventFilters;
}

export function EventList({ filters }: EventListProps) {
  const { t } = useLanguage();
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useHousingEvents({ ...filters, per_page: 20 });

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
          {t('events.errorLoading') || 'Failed to load events. Please try again later.'}
        </p>
      </Card>
    );
  }

  const events = data?.pages.flatMap(page => page.data?.data || []) || [];

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {t('events.noResultsFound') || 'No events found'}
        </h3>
        <p className="text-muted-foreground">
          {t('events.noResultsMessage') || 'Try adjusting your search criteria.'}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {hasNextPage && (
        <div className="col-span-full flex justify-center mt-4 sm:mt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage 
              ? (t('events.loading') || 'Loading...') 
              : (t('events.loadMore') || 'Load More')}
          </button>
        </div>
      )}
    </div>
  );
}

