import { api } from './client';
import type { PublicPropertyListResponse, PublicPropertyFilters } from '@/types/publicProperties';

export const publicPropertyApi = {

  getPublicProperties: (filters: PublicPropertyFilters = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: filters,
    });
  },

  getPremiumProperties: (filters: Omit<PublicPropertyFilters, 'premium'> = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        premium: true,
      },
    });
  },

  getTanTanTanProperties: (filters: Omit<PublicPropertyFilters, 'tan_tan_tan'> = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        tan_tan_tan: true,
      },
    });
  },

  getPropertiesByListingType: (
    listingTypeId: number,
    filters: Omit<PublicPropertyFilters, 'listing_type_id'> = {}
  ) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        listing_type_id: listingTypeId,
      },
    });
  },
};

