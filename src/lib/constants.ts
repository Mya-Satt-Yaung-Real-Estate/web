/**
 * Application Constants
 * 
 * Essential constants for the application.
 */

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  name: 'Jade Property',
  description: 'Find your dream property in Myanmar',
  version: '1.0.0',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  COMPANIES: '/companies',
  KNOWLEDGE_HUB: '/knowledge-hub',
  NOT_FOUND: '/404',
} as const;

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  theme: 'jade-property-theme',
  language: 'jade-property-language',
  user: 'jade-property-user',
} as const;