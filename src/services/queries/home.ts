import { homeApi } from '../api/home';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const homeKeys = {
  all: ['home'] as const,
  premiumProperties: () => [...homeKeys.all, 'premium-properties'] as const,
  featuredProperties: () => [...homeKeys.all, 'featured-properties'] as const,
  wantedListings: () => [...homeKeys.all, 'wanted-listings'] as const,
  featuredAdvertisements: () => [...homeKeys.all, 'featured-advertisements'] as const,
  upcomingEvents: () => [...homeKeys.all, 'upcoming-events'] as const,
  legalTeam: () => [...homeKeys.all, 'legal-team'] as const,
  sliderAds: () => [...homeKeys.all, 'slider-ads'] as const,
  homeBlockAds: () => [...homeKeys.all, 'home-block-ads'] as const,
  detailSidebarAds: () => [...homeKeys.all, 'detail-sidebar-ads'] as const,
  homeGridAds: () => [...homeKeys.all, 'home-grid-ads'] as const,
  propertiesMap: () => [...homeKeys.all, 'properties-map'] as const,
  companyLogoLists: () => [...homeKeys.all, 'company-logo-lists'] as const,
  propertyDetailCompanyLogoLists: () => [...homeKeys.all, 'property-detail-company-logo-lists'] as const,
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

  getWantedListings: () => {
    return homeApi.getWantedListings();
  },

  getFeaturedAdvertisements: () => {
    return homeApi.getFeaturedAdvertisements();
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
};

