// App constants and configurations
export const APP_CONFIG = {
  name: 'Jade Property',
  version: '1.0.0',
  description: 'Property management platform',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  properties: {
    list: '/properties',
    create: '/properties',
    update: '/properties/:id',
    delete: '/properties/:id',
  },
} as const;

export const ROUTES = {
  home: '/',
  about: '/about',
  companies: '/companies',
  appointments: '/appointments',
  createListing: '/post-property',
} as const;

export const LANGUAGES = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  my: { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
} as const;
