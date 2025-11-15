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
};

