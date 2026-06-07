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
  jadeMarketplace: () => [...publicPropertyKeys.all, 'jade-marketplace'] as const,
  jadeMarketplaceList: (filters?: Omit<PublicPropertyFilters, 'jade_market'>) =>
    [...publicPropertyKeys.jadeMarketplace(), filters] as const,
  tanTanTan: () => [...publicPropertyKeys.all, 'tan-tan-tan'] as const,
  tanTanTanList: (filters?: Omit<PublicPropertyFilters, 'tan_tan_tan'>) => 
    [...publicPropertyKeys.tanTanTan(), filters] as const,
  installment: () => [...publicPropertyKeys.all, 'installment'] as const,
  installmentList: (filters?: Omit<PublicPropertyFilters, 'installment'>) => 
    [...publicPropertyKeys.installment(), filters] as const,
  details: () => [...publicPropertyKeys.all, 'detail'] as const,
  detail: (slug: string) => [...publicPropertyKeys.details(), slug] as const,
  related: () => [...publicPropertyKeys.all, 'related'] as const,
  relatedProperties: (slug: string) => [...publicPropertyKeys.related(), slug] as const,
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

  getJadeMarketplaceProperties: (filters?: Omit<PublicPropertyFilters, 'jade_market'>) => {
    return publicPropertyApi.getJadeMarketplaceProperties(filters);
  },

  getTanTanTanProperties: (filters?: Omit<PublicPropertyFilters, 'tan_tan_tan'>) => {
    return publicPropertyApi.getTanTanTanProperties(filters);
  },

  getInstallmentProperties: (filters?: Omit<PublicPropertyFilters, 'installment'>) => {
    return publicPropertyApi.getInstallmentProperties(filters);
  },

  getPublicPropertyBySlug: (slug: string) => {
    return publicPropertyApi.getPublicPropertyBySlug(slug);
  },

  getRelatedProperties: (slug: string) => {
    return publicPropertyApi.getRelatedProperties(slug);
  },
};


