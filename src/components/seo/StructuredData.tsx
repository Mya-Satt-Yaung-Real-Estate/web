import { Helmet } from 'react-helmet-async';

// Organization structured data for Google Search Console
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Jade Property",
  "description": "Premium real estate solutions and property management in Myanmar",
  "url": "https://jadeproperty.com",
  "logo": "https://jadeproperty.com/assets/jade-logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+95-1-234-5678",
    "contactType": "customer service",
    "areaServed": "MM",
    "availableLanguage": ["English", "Myanmar"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "Yangon",
    "addressCountry": "MM"
  },
  "sameAs": [
    "https://www.facebook.com/jadeproperty",
    "https://t.me/jadeproperty"
  ]
};

// Website structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Jade Property",
  "url": "https://jadeproperty.com",
  "description": "Premium real estate solutions and property management in Myanmar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://jadeproperty.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Local business structured data
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Jade Property",
  "description": "Premium real estate solutions and property management in Myanmar",
  "url": "https://jadeproperty.com",
  "telephone": "+95-1-234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Business Street",
    "addressLocality": "Yangon",
    "addressCountry": "MM"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "16.8661",
    "longitude": "96.1951"
  },
  "openingHours": "Mo-Fr 09:00-18:00",
  "priceRange": "$$"
};

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'localBusiness' | 'all';
}

export function StructuredData({ type = 'all' }: StructuredDataProps) {
  const getSchemaData = () => {
    switch (type) {
      case 'organization':
        return organizationSchema;
      case 'website':
        return websiteSchema;
      case 'localBusiness':
        return localBusinessSchema;
      case 'all':
      default:
        return [organizationSchema, websiteSchema, localBusinessSchema];
    }
  };

  const schemaData = getSchemaData();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
