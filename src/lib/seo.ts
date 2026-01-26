// SEO configuration and utilities
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string; // 'index, follow' | 'noindex, nofollow' | 'noindex, follow' etc.
}

// Default SEO configuration
export const defaultSEO: SEOConfig = {
  title: 'Jade Property - Premium Real Estate Solutions in Myanmar',
  description: 'Find your dream property with Jade Property. Premium real estate solutions, property management, and investment opportunities in Myanmar.',
  keywords: 'real estate, property, Myanmar, Yangon, property management, investment, housing, apartments, houses, land',
  image: '/assets/jade.png',
  url: 'https://jade-property.com',
  type: 'website'
};

// Page-specific SEO configurations
export const pageSEO: Record<string, SEOConfig> = {
  // === PUBLIC PAGES ===
  home: {
    title: 'Jade Property - Premium Real Estate Solutions in Myanmar',
    description: 'Find your dream property with Jade Property. Premium real estate solutions, property management, and investment opportunities in Myanmar.',
    keywords: 'real estate Myanmar, property Yangon, property management, investment Myanmar, housing Yangon',
    image: '/assets/jade.png',
    url: 'https://jade-property.com',
    type: 'website'
  },
  about: {
    title: 'About Jade Property - Leading Property Management Platform',
    description: 'Learn about Jade Property, Myanmar\'s leading property management platform. Our mission, values, and commitment to excellence in real estate.',
    keywords: 'about Jade Property, property management Myanmar, real estate company, property services',
    image: '/assets/jade.png',
    url: 'https://jade-property.com/about',
    type: 'website'
  },
  companies: {
    title: 'Real Estate Companies - Verified Property Agencies',
    description: 'Browse verified property companies in Myanmar. Find trusted real estate agencies, developers, and property management companies.',
    keywords: 'real estate companies Myanmar, property agencies, property developers, property management, verified companies',
    image: '/assets/jade.png',
    url: 'https://jade-property.com/companies',
    type: 'website'
  },
  publicWantedList: {
    title: 'Wanted Listings - Jade Property',
    description: 'Browse property requirements and wanted listings from buyers and renters. Find potential customers for your properties.',
    keywords: 'wanted listings, property requirements, buyers, renters, Myanmar property, property search',
    image: '/assets/jade.png',
    url: 'https://jade-property.com/public-wanted-list',
    type: 'website'
  },
  loanCalculator: {
    title: 'Loan Calculator - Calculate Monthly Payments | Jade Property',
    description: 'Calculate your monthly loan payments, total costs, and affordability for property loans. Free loan calculator with EMI schedule and payment breakdown.',
    keywords: 'loan calculator, mortgage calculator, EMI calculator, property loan, home loan calculator, Myanmar property loan',
    image: '/assets/jade.png',
    url: 'https://jade-property.com/loan-calculator',
    type: 'website'
  },
  notFound: {
    title: 'Page Not Found - Jade Property',
    description: 'The page you are looking for could not be found. Return to Jade Property homepage to continue browsing our properties.',
    keywords: 'page not found, 404, Jade Property',
    image: '/assets/jade.png',
    url: 'https://jade-property.com/404',
    type: 'website',
    robots: 'noindex, follow'
  },

  // === PRIVATE PAGES (noindex) ===
  signin: {
    title: 'Sign In - Jade Property',
    description: 'Sign in to your Jade Property account.',
    keywords: 'sign in, login, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  signup: {
    title: 'Sign Up - Jade Property',
    description: 'Create your Jade Property account.',
    keywords: 'sign up, register, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  profile: {
    title: 'My Profile - Jade Property',
    description: 'View and manage your Jade Property profile.',
    keywords: 'profile, account, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  settings: {
    title: 'Settings - Jade Property',
    description: 'Manage your Jade Property account settings.',
    keywords: 'settings, account settings, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  favorites: {
    title: 'My Favorites - Jade Property',
    description: 'View your favorite properties.',
    keywords: 'favorites, saved properties, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  recentViews: {
    title: 'Recent Views - Jade Property',
    description: 'View your recently viewed properties.',
    keywords: 'recent views, viewed properties, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  myWantedList: {
    title: 'My Wanted Listings - Jade Property',
    description: 'Manage your wanted listings and property requirements.',
    keywords: 'my wanted listings, property requirements, manage listings',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  createWantedList: {
    title: 'Create Wanted Listing - Jade Property',
    description: 'Create a new wanted listing.',
    keywords: 'create wanted listing, property requirements',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  myProperties: {
    title: 'My Properties - Jade Property',
    description: 'Manage your property listings.',
    keywords: 'my properties, manage listings, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  myAdvertisements: {
    title: 'My Advertisements - Jade Property',
    description: 'Manage your advertisements.',
    keywords: 'my advertisements, manage ads, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  appointments: {
    title: 'My Appointments - Jade Property',
    description: 'Manage your property viewing appointments.',
    keywords: 'appointments, property viewing, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  pointManagement: {
    title: 'Point Management - Jade Property',
    description: 'Manage your Jade Property points.',
    keywords: 'points, point management, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  },
  loanRequest: {
    title: 'Loan Request - Jade Property',
    description: 'Submit a loan request.',
    keywords: 'loan request, property loan, Jade Property',
    image: '/assets/jade.png',
    robots: 'noindex, nofollow'
  }
};

// Generate full title with site name
export const generateTitle = (pageTitle: string, siteName: string = 'Jade Property'): string => {
  return `${pageTitle} | ${siteName}`;
};

// Generate canonical URL
export const generateCanonicalUrl = (path: string, baseUrl: string = 'https://jade-property.com'): string => {
  return `${baseUrl}${path}`;
};

// SEO utility functions
export const seoUtils = {
  generateTitle,
  generateCanonicalUrl,
  getPageSEO: (page: string): SEOConfig => {
    return pageSEO[page] || defaultSEO;
  }
};
