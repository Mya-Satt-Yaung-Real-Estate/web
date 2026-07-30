import { api } from './client';
import type {
  ShareProfitCreateData,
  ShareProfitDetailResponse,
  ShareProfitListResponse,
  ShareProfitOwnerFilters,
  ShareProfitStatisticsResponse,
  ShareProfitUpdateData,
  ShareProfitWantedType,
} from '@/types/shareProfitListing';

export interface ShareProfitListFilters {
  search?: string;
  property_type_id?: number;
  prefer_region_id?: number;
  prefer_township_id?: number;
  wanted_type?: ShareProfitWantedType;
  min_budget?: number;
  max_budget?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export const shareProfitListingApi = {
  getPublicListings: (filters: ShareProfitListFilters = {}) => {
    return api.get<ShareProfitListResponse>('/api/v2/frontend/public/share-profit-listings', {
      params: filters,
    });
  },

  getPublicDetail: (slug: string) => {
    return api.get<ShareProfitDetailResponse>(`/api/v2/frontend/public/share-profit-listings/${slug}`);
  },

  getPublicStatistics: () => {
    return api.get<ShareProfitStatisticsResponse>('/api/v2/frontend/public/share-profit-listings/statistics');
  },

  /** Owner (auth) CRUD — Website V2 */
  getOwnerListings: (filters: ShareProfitOwnerFilters = {}) => {
    return api.get<ShareProfitListResponse>('/api/v2/frontend/share-profit-listings', {
      params: filters,
    });
  },

  getOwnerDetail: (slug: string) => {
    return api.get<ShareProfitDetailResponse>(`/api/v2/frontend/share-profit-listings/${slug}`);
  },

  create: (data: ShareProfitCreateData) => {
    return api.post<ShareProfitDetailResponse>('/api/v2/frontend/share-profit-listings', data);
  },

  update: (slug: string, data: ShareProfitUpdateData) => {
    return api.put<ShareProfitDetailResponse>(`/api/v2/frontend/share-profit-listings/${slug}`, data);
  },

  remove: (slug: string) => {
    return api.delete<ShareProfitDetailResponse>(`/api/v2/frontend/share-profit-listings/${slug}`);
  },

  toggleStatus: (slug: string) => {
    return api.patch<ShareProfitDetailResponse>(`/api/v2/frontend/share-profit-listings/${slug}/toggle-status`);
  },

  getOwnerStatistics: () => {
    return api.get<ShareProfitStatisticsResponse>('/api/v2/frontend/share-profit-listings/statistics');
  },
};
