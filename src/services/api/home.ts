import { api } from './client';
import type { PublicPropertyListResponse } from '@/types/publicProperties';
import type { PublicAdvertisementListResponse } from '@/types/publicAdvertisements';
import type { WantedListResponse } from '@/types/wantedList';
import type { HousingEventListResponse } from '@/types/housingEvents';
import type { LegacyTeamResponse } from '@/types/legacy';
import type { SliderAdsResponse, DetailPageSidebarsAdsResponse, HomeGridAdsResponse } from '@/types/ads';
import type { MapPropertiesResponse } from '@/types/mapProperties';
import type { CompanyLogoListResponse } from '@/types/company';
import type { YoutubeVideoListResponse } from '@/types/youtubeVideo';
import type { HomeProjectListResponse } from '@/types/projects';
import type { HomeExploreCategoryListResponse } from '@/types/homeExploreCategory';

export type HomeAdvertisementType = 'for_sale' | 'for_rent';

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
   * Get popular properties for home page (4 items, highest view count)
   */
  getPopularProperties: () => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/home/popular-properties');
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
  getFeaturedAdvertisements: (advertisementType?: HomeAdvertisementType) => {
    return api.get<PublicAdvertisementListResponse>('/api/v1/frontend/public/home/featured-advertisements', {
      params: advertisementType ? { advertisement_type: advertisementType } : undefined,
    });
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

  /**
   * Detail page: both sidebar ad strips (sidebar_1 + sidebar_2) in one response.
   */
  getDetailPageSidebarsAds: () => {
    return api.get<DetailPageSidebarsAdsResponse>('/api/v1/frontend/ads/detail-page');
  },

  getHomeGridAds: () => {
    return api.get<HomeGridAdsResponse>('/api/v1/frontend/ads/home-grid');
  },

  /**
   * Get properties for map view on home page
   */
  getPropertiesMap: () => {
    return api.get<MapPropertiesResponse>('/api/v1/frontend/public/home/properties-map');
  },

  /**
   * Get company logo list for home page slider
   */
  getCompanyLogoLists: () => {
    return api.get<CompanyLogoListResponse>('/api/v1/frontend/public/home/companies/logo-name');
  },

  /**
   * Get company logo list for property detail sidebar
   */
  getPropertyDetailCompanyLogoLists: () => {
    return api.get<CompanyLogoListResponse>('/api/v1/frontend/public/home/companies/logo-name/property-detail');
  },

  /**
   * Get YouTube videos for home page (3 items)
   */
  getHomeYoutubeVideos: () => {
    return api.get<YoutubeVideoListResponse>('/api/v1/frontend/public/home/youtube-videos');
  },

  /**
   * Get Jade Market properties for home page (4 items)
   */
  getJadeMarketProperties: () => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/home/jade-market-properties');
  },

  /**
   * Get new projects for home page (3 items)
   */
  getNewProjects: () => {
    return api.get<HomeProjectListResponse>('/api/v1/frontend/public/home/new-projects');
  },

  getExploreCategories: () => {
    return api.get<HomeExploreCategoryListResponse>('/api/v1/frontend/public/home/explore-categories');
  },
};

