import { useQuery } from '@tanstack/react-query';
import { newsQueries } from '@/services/queries/news';
import type { NewsFilters } from '@/types/news';

export function useNewsAndUpdates(filters: NewsFilters = {}) {
  return useQuery(newsQueries.getNewsAndUpdates(filters));
}

export function useNewsCategories() {
  return useQuery(newsQueries.getNewsCategories());
}

export function useNewsDetail(slug: string) {
  return useQuery(newsQueries.getNewsDetail(slug));
}
