import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/services/api/locations';

// Hook to fetch regions
export const useRegions = () => {
  return useQuery({
    queryKey: ['regions'],
    queryFn: locationApi.getRegions,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch townships
export const useTownships = () => {
  return useQuery({
    queryKey: ['townships'],
    queryFn: locationApi.getTownships,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch wards by township ID
export const useWards = (townshipId: number | null) => {
  return useQuery({
    queryKey: ['wards', townshipId],
    queryFn: () => locationApi.getWards(townshipId!),
    enabled: !!townshipId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch roads by ward ID
export const useRoads = (wardId: number | null) => {
  return useQuery({
    queryKey: ['roads', wardId],
    queryFn: () => locationApi.getRoads(wardId!),
    enabled: !!wardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
