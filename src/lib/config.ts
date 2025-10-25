/**
 * Application Configuration
 * 
 * Essential configuration for the application.
 */

import { APP_CONFIG, BREAKPOINTS, ROUTES, STORAGE_KEYS } from './constants';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export const ENV = {
  NODE_ENV: import.meta.env.MODE || 'development',
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.jadeproperty.com',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Jade Property',
} as const;

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP = {
  name: ENV.VITE_APP_NAME || APP_CONFIG.name,
  version: APP_CONFIG.version,
  description: APP_CONFIG.description,
  isDevelopment: ENV.NODE_ENV === 'development',
  isProduction: ENV.NODE_ENV === 'production',
} as const;

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API = {
  baseUrl: ENV.VITE_API_BASE_URL,
  timeout: 10000,
  retryAttempts: 3,
} as const;

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const THEME = {
  defaultMode: 'light' as const,
  defaultLanguage: 'en' as const,
  breakpoints: BREAKPOINTS,
  storageKey: STORAGE_KEYS.theme,
  languageKey: STORAGE_KEYS.language,
} as const;

// ============================================================================
// ROUTING CONFIGURATION
// ============================================================================

export const ROUTING = {
  routes: ROUTES,
  defaultRoute: ROUTES.HOME,
  notFoundRoute: ROUTES.NOT_FOUND,
} as const;

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export const CONFIG = {
  app: APP,
  api: API,
  theme: THEME,
  routing: ROUTING,
} as const;

export default CONFIG;