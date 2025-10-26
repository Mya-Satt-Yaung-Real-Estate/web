import { useQuery } from '@tanstack/react-query';
import { faqQueries } from '@/services/queries/faq';

export const useFAQs = () => {
  return useQuery(faqQueries.getFAQs());
};



