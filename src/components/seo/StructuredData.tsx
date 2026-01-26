import { Helmet } from 'react-helmet-async';

// Organization structured data for Google Search Console
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Jade Property",
  "description": "JADE Property မှာ အိမ်ခြံမြေ ဝယ်ယူလိုသူ၊ ရောင်းလိုသူ၊ ငှားလိုသူများနှင့် Property Agent များအားလုံးအတွက် One-Stop Real Estate Solution အဖြစ် ဝန်ဆောင်မှုများကို ပေးဆောင်လျက်ရှိပါသည်။",
  "url": "https://jade-property.com",
  "logo": "https://jade-property.com/assets/jade.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "09 403677666, 09 763335120",
    "contactType": "customer service",
    "areaServed": "MM",
    "availableLanguage": ["English", "Myanmar"]
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Location - PSH-78, Padauk Loop 2, Padauk Garden Housing, Hlaing Tharyar Township, Yangon, Myanmar",
    "addressLocality": "Yangon, Myanmar",
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
  "url": "https://jade-property.com",
  "description": "JADE Property သည် ၂၀၂၆ ခုနှစ်တွင် တရားဝင် Launch ပြုလုပ်ခဲ့သော Digital Real Estate Platform တစ်ခုဖြစ်ပြီး မြန်မာနိုင်ငံအတွင်းရှိ အိမ်ခြံမြေ ရောင်းဝယ်ငှားရမ်းမှုများကို လုံခြုံ၊ မြန်ဆန်ပြီး ယုံကြည်စိတ်ချရသော နည်းပညာဖြင့် ချိတ်ဆက်ပေးနေပါသည်။",
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
  "url": "https://jade-property.com",
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

