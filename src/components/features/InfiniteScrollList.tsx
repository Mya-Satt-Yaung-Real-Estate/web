import { ReactNode } from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface InfiniteScrollListProps {
  children: ReactNode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  loadingComponent?: ReactNode;
}

/**
 * Reusable infinite scroll list wrapper component
 * Handles scroll detection and loading states
 */
export function InfiniteScrollList({
  children,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  loadingComponent,
}: InfiniteScrollListProps) {
  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <>
      {children}
      
      {isFetchingNextPage && loadingComponent}
      
      <div ref={loadMoreRef} className="h-10" />
    </>
  );
}


