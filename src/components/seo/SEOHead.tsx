import { Helmet } from 'react-helmet-async';
import { type SEOConfig, generateTitle, generateCanonicalUrl } from '@/lib/seo';

interface SEOHeadProps {
  seo: SEOConfig;
  path?: string;
}

export function SEOHead({ seo, path = '/' }: SEOHeadProps) {
  const canonicalUrl = generateCanonicalUrl(path);
  const fullTitle = generateTitle(seo.title);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content="Jade Property" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags for Facebook and Telegram */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={seo.type || 'website'} />
      <meta property="og:site_name" content="Jade Property" />
      <meta property="og:locale" content="en_US" />

      {/* Additional Open Graph Tags */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Jade Property - Premium Real Estate Solutions" />

      {/* Twitter Card Tags (for better social sharing) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#36846E" />
      <meta name="msapplication-TileColor" content="#36846E" />
      
      {/* Language and Region */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="MM" />
      <meta name="geo.country" content="Myanmar" />
      
      {/* Mobile App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Jade Property" />
    </Helmet>
  );
}
