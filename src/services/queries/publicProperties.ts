import { publicPropertyApi } from '../api/publicProperties';
import type { PublicPropertyFilters } from '@/types/publicProperties';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const publicPropertyKeys = {
  all: ['public-properties'] as const,
  lists: () => [...publicPropertyKeys.all, 'list'] as const,
  list: (filters?: PublicPropertyFilters) => [...publicPropertyKeys.lists(), filters] as const,
  premium: () => [...publicPropertyKeys.all, 'premium'] as const,
  premiumList: (filters?: Omit<PublicPropertyFilters, 'premium'>) => 
    [...publicPropertyKeys.premium(), filters] as const,
  tanTanTan: () => [...publicPropertyKeys.all, 'tan-tan-tan'] as const,
  tanTanTanList: (filters?: Omit<PublicPropertyFilters, 'tan_tan_tan'>) => 
    [...publicPropertyKeys.tanTanTan(), filters] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const publicPropertyQueries = {

  getPublicProperties: (filters?: PublicPropertyFilters) => {
    return publicPropertyApi.getPublicProperties(filters);
  },

  getPremiumProperties: (filters?: Omit<PublicPropertyFilters, 'premium'>) => {
    return publicPropertyApi.getPremiumProperties(filters);
  },

  getTanTanTanProperties: (filters?: Omit<PublicPropertyFilters, 'tan_tan_tan'>) => {
    return publicPropertyApi.getTanTanTanProperties(filters);
  },
};

