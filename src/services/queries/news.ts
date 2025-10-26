import { queryOptions } from '@tanstack/react-query';
import { newsApi } from '../api/news';
import type { NewsFilters } from '@/types/news';

export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (filters: NewsFilters) => [...newsKeys.lists(), filters] as const,
  categories: () => [...newsKeys.all, 'categories'] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...newsKeys.details(), slug] as const,
};

export const newsQueries = {
  getNewsAndUpdates: (filters: NewsFilters = {}) =>
    queryOptions({
      queryKey: newsKeys.list(filters),
      queryFn: () => newsApi.getNewsAndUpdates(filters),
    }),

  getNewsCategories: () =>
    queryOptions({
      queryKey: newsKeys.categories(),
      queryFn: () => newsApi.getNewsCategories(),
    }),

  getNewsDetail: (slug: string) =>
    queryOptions({
      queryKey: newsKeys.detail(slug),
      queryFn: () => newsApi.getNewsDetail(slug),
    }),
};
