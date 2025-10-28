/**
 * Property Types Query Hooks
 * 
 * TanStack Query hooks for property type operations.
 */

import { useQuery } from '@tanstack/react-query';
import { propertyTypeApi } from '@/services/api/propertyTypes';

// Hook to fetch property types
export const usePropertyTypes = () => {
  return useQuery({
    queryKey: ['property-types'],
    queryFn: propertyTypeApi.getPropertyTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

