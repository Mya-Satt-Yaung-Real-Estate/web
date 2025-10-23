// SEO configuration and utilities
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  type?: string;
}

// Default SEO configuration
export const defaultSEO: SEOConfig = {
  title: 'Jade Property - Premium Real Estate Solutions in Myanmar',
  description: 'Find your dream property with Jade Property. Premium real estate solutions, property management, and investment opportunities in Myanmar.',
  keywords: 'real estate, property, Myanmar, Yangon, property management, investment, housing, apartments, houses, land',
  image: '/assets/jade-og-image.jpg',
  url: 'https://jadeproperty.com',
  type: 'website'
};

// Page-specific SEO configurations
export const pageSEO: Record<string, SEOConfig> = {
  home: {
    title: 'Jade Property - Premium Real Estate Solutions in Myanmar',
    description: 'Find your dream property with Jade Property. Premium real estate solutions, property management, and investment opportunities in Myanmar.',
    keywords: 'real estate Myanmar, property Yangon, property management, investment Myanmar, housing Yangon',
    image: '/assets/jade-og-image.jpg',
    url: 'https://jadeproperty.com',
    type: 'website'
  },
  about: {
    title: 'About Jade Property - Leading Property Management Platform',
    description: 'Learn about Jade Property, Myanmar\'s leading property management platform. Our mission, values, and commitment to excellence in real estate.',
    keywords: 'about Jade Property, property management Myanmar, real estate company, property services',
    image: '/assets/jade-about-og.jpg',
    url: 'https://jadeproperty.com/about',
    type: 'website'
  },
  companies: {
    title: 'Real Estate Companies - Verified Property Agencies',
    description: 'Browse verified property companies in Myanmar. Find trusted real estate agencies, developers, and property management companies.',
    keywords: 'real estate companies Myanmar, property agencies, property developers, property management, verified companies',
    image: '/assets/jade-companies-og.jpg',
    url: 'https://jadeproperty.com/companies',
    type: 'website'
  },
  notFound: {
    title: 'Page Not Found - Jade Property',
    description: 'The page you are looking for could not be found. Return to Jade Property homepage to continue browsing our properties.',
    keywords: 'page not found, 404, Jade Property',
    image: '/assets/jade-og-image.jpg',
    url: 'https://jadeproperty.com/404',
    type: 'website'
  }
};

// Generate full title with site name
export const generateTitle = (pageTitle: string, siteName: string = 'Jade Property'): string => {
  return `${pageTitle} | ${siteName}`;
};

// Generate canonical URL
export const generateCanonicalUrl = (path: string, baseUrl: string = 'https://jadeproperty.com'): string => {
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
