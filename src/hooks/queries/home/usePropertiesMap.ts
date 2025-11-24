import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function usePropertiesMap() {
  return useQuery({
    queryKey: homeKeys.propertiesMap(),
    queryFn: homeQueries.getPropertiesMap,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

