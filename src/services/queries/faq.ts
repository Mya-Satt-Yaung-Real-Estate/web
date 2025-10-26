import { queryOptions } from '@tanstack/react-query';
import { faqApi } from '../api/faq';

export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: () => [...faqKeys.lists()] as const,
};

export const faqQueries = {
  getFAQs: () =>
    queryOptions({
      queryKey: faqKeys.list(),
      queryFn: () => faqApi.getFAQs(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
};
