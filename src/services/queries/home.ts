import { homeApi, type HomeAdvertisementType } from '../api/home';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const homeKeys = {
  all: ['home'] as const,
  premiumProperties: () => [...homeKeys.all, 'premium-properties'] as const,
  featuredProperties: () => [...homeKeys.all, 'featured-properties'] as const,
  popularProperties: () => [...homeKeys.all, 'popular-properties'] as const,
  wantedListings: () => [...homeKeys.all, 'wanted-listings'] as const,
  featuredAdvertisements: (advertisementType?: HomeAdvertisementType) => [...homeKeys.all, 'featured-advertisements', advertisementType ?? 'all'] as const,
  upcomingEvents: () => [...homeKeys.all, 'upcoming-events'] as const,
  legalTeam: () => [...homeKeys.all, 'legal-team'] as const,
  sliderAds: () => [...homeKeys.all, 'slider-ads'] as const,
  homeBlockAds: () => [...homeKeys.all, 'home-block-ads'] as const,
  detailSidebarAds: () => [...homeKeys.all, 'detail-sidebar-ads'] as const,
  homeGridAds: () => [...homeKeys.all, 'home-grid-ads'] as const,
  propertiesMap: () => [...homeKeys.all, 'properties-map'] as const,
  companyLogoLists: () => [...homeKeys.all, 'company-logo-lists'] as const,
  propertyDetailCompanyLogoLists: () => [...homeKeys.all, 'property-detail-company-logo-lists'] as const,
  youtubeVideos: () => [...homeKeys.all, 'youtube-videos'] as const,
  jadeMarketProperties: () => [...homeKeys.all, 'jade-market-properties'] as const,
  newProjects: () => [...homeKeys.all, 'new-projects'] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const homeQueries = {
  getPremiumProperties: () => {
    return homeApi.getPremiumProperties();
  },

  getFeaturedProperties: () => {
    return homeApi.getFeaturedProperties();
  },

  getPopularProperties: () => {
    return homeApi.getPopularProperties();
  },

  getWantedListings: () => {
    return homeApi.getWantedListings();
  },

  getFeaturedAdvertisements: (advertisementType?: HomeAdvertisementType) => {
    return homeApi.getFeaturedAdvertisements(advertisementType);
  },

  getUpcomingEvents: () => {
    return homeApi.getUpcomingEvents();
  },

  getLegalTeam: () => {
    return homeApi.getLegalTeam();
  },

  getSliderAds: () => {
    return homeApi.getSliderAds();
  },

  getHomeBlockAds: () => {
    return homeApi.getHomeBlockAds();
  },

  getDetailPageSidebarsAds: () => {
    return homeApi.getDetailPageSidebarsAds();
  },

  getHomeGridAds: () => {
    return homeApi.getHomeGridAds();
  },

  getPropertiesMap: () => {
    return homeApi.getPropertiesMap();
  },

  getCompanyLogoLists: () => {
    return homeApi.getCompanyLogoLists();
  },

  getPropertyDetailCompanyLogoLists: () => {
    return homeApi.getPropertyDetailCompanyLogoLists();
  },

  getHomeYoutubeVideos: () => {
    return homeApi.getHomeYoutubeVideos();
  },

  getJadeMarketProperties: () => {
    return homeApi.getJadeMarketProperties();
  },

  getNewProjects: () => {
    return homeApi.getNewProjects();
  },
};

