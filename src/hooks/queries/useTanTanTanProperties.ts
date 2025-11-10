import { useQuery } from '@tanstack/react-query';
import { publicPropertyKeys, publicPropertyQueries } from '@/services/queries/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

export function useTanTanTanProperties(filters?: Omit<PublicPropertyFilters, 'tan_tan_tan'>) {
  return useQuery({
    queryKey: publicPropertyKeys.tanTanTanList(filters),
    queryFn: () => publicPropertyQueries.getTanTanTanProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


