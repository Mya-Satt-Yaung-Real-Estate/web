/**
 * Review List Component
 * 
 * Displays a list of reviews with infinite scroll.
 */

import { usePublicReviews } from '@/hooks/queries/useReviews';
import { ReviewCard } from './ReviewCard';
import { InfiniteScrollList } from '@/components/features/InfiniteScrollList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReviewFilters } from '@/types/reviews';

interface ReviewListProps {
  filters?: ReviewFilters;
}

export function ReviewList({ filters }: ReviewListProps) {
  const { t } = useLanguage();
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = usePublicReviews(filters);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-6 pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-20 w-full" />
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
          {t('reviews.errorLoadingReviews') || 'Failed to load reviews. Please try again later.'}
        </p>
      </Card>
    );
  }

  const reviews = data?.pages.flatMap(page => page.data?.data || []) || [];

  if (reviews.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="mb-2">{t('reviews.noReviewsFound') || 'No reviews found'}</h3>
        <p className="text-muted-foreground">
          {t('reviews.noReviewsDescription') || 'There are no reviews available at the moment.'}
        </p>
      </Card>
    );
  }

  const loadingSkeletons = (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {[...Array(6)].map((_, i) => (
        <Card key={`skeleton-${i}`} className="overflow-hidden">
          <div className="p-6 pt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-20 w-full" />
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
      <div className="space-y-4 sm:space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </InfiniteScrollList>
  );
}

