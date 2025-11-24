import { api } from './client';
import type { PublicPropertyListResponse } from '@/types/publicProperties';
import type { PublicAdvertisementListResponse } from '@/types/publicAdvertisements';
import type { WantedListResponse } from '@/types/wantedList';
import type { HousingEventListResponse } from '@/types/housingEvents';
import type { LegacyTeamResponse } from '@/types/legacy';
import type { SliderAdsResponse } from '@/types/ads';

/**
 * Home Page API Service
 * 
 * API endpoints for home page sections.
 * These endpoints return fixed number of items (no pagination needed).
 */
export const homeApi = {
  /**
   * Get premium properties for home page (8 items)
   */
  getPremiumProperties: () => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/home/premium-properties');
  },

  /**
   * Get featured properties for home page (4 items)
   */
  getFeaturedProperties: () => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/home/featured-properties');
  },

  /**
   * Get wanted listings for home page (6 items)
   */
  getWantedListings: () => {
    return api.get<WantedListResponse>('/api/v1/frontend/public/home/wanting-lists');
  },

  /**
   * Get featured advertisements for home page (6 items)
   */
  getFeaturedAdvertisements: () => {
    return api.get<PublicAdvertisementListResponse>('/api/v1/frontend/public/home/featured-advertisements');
  },

  /**
   * Get upcoming events for home page (6 items)
   */
  getUpcomingEvents: () => {
    return api.get<HousingEventListResponse>('/api/v1/frontend/public/home/upcoming-events');
  },

  /**
   * Get legal team for home page (3 items)
   */
  getLegalTeam: () => {
    return api.get<LegacyTeamResponse>('/api/v1/frontend/legacy-teams', {
      params: { per_page: 3 },
    });
  },

  /**
   * Get slider ads for home page carousel
   */
  getSliderAds: () => {
    return api.get<SliderAdsResponse>('/api/v1/frontend/ads/slider');
  },

  /**
   * Get home block ads for home page (displayed after events section)
   */
  getHomeBlockAds: () => {
    return api.get<SliderAdsResponse>('/api/v1/frontend/ads/home-block');
  },
};

