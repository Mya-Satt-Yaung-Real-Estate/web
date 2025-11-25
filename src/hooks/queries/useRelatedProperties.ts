/**
 * useRelatedProperties Hook
 * 
 * React Query hook for fetching related properties for a property.
 */

import { useQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';

export function useRelatedProperties(slug: string) {
  return useQuery({
    queryKey: publicPropertyKeys.relatedProperties(slug),
    queryFn: () => publicPropertyQueries.getRelatedProperties(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

