import { formatPriceLakh } from '@/lib/utils';
import type { Property } from '@/types/properties';

type AppLanguage = 'en' | 'mm';

const NON_RESIDENTIAL_TYPE_SLUGS = new Set([
  'land',
  'warehouse',
  'commercial',
  'shop',
  'factory',
  'industrial',
  'plot',
  'office',
]);

export function isResidentialProperty(property: Property): boolean {
  const slug = property.property_type?.slug?.toLowerCase();
  if (!slug) return true;
  return !NON_RESIDENTIAL_TYPE_SLUGS.has(slug);
}

export function getCompanyPropertyTitle(property: Property, language: AppLanguage): string {
  return language === 'mm' ? property.title_mm : property.title_en;
}

export function getCompanyPropertyLocation(property: Property, language: AppLanguage): string {
  const region = language === 'mm' ? property.location?.region?.name_mm : property.location?.region?.name_en;
  const township = language === 'mm' ? property.location?.township?.name_mm : property.location?.township?.name_en;
  return region && township ? `${township}, ${region}` : '';
}

export function getCompanyPropertyType(property: Property, language: AppLanguage): string {
  return (language === 'mm' ? property.property_type?.name_mm : property.property_type?.name_en) || '';
}

export function getCompanyListingType(property: Property, language: AppLanguage): string {
  return (language === 'mm' ? property.listing_type?.name_mm : property.listing_type?.name_en) || '';
}

export function formatCompanyPropertyPrice(property: Property, language: AppLanguage): string {
  return (
    formatPriceLakh(
      property.price || '0',
      property.price_lakh,
      language,
      property.currency,
      property.price_amount
    ) || property.formatted_price || ''
  );
}

export function formatCompanyPropertyExpireDate(property: Property, language: AppLanguage): string {
  const expiresAt = property.dates?.company_profile_expires_at;
  if (!expiresAt) return '-';

  return new Date(expiresAt).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function buildCompanyPropertySpecLine(property: Property, isResidential: boolean): string[] {
  const parts: string[] = [];

  if (property.area_sqft) {
    parts.push(`${parseFloat(String(property.area_sqft)).toLocaleString()} sqft`);
  }

  if (isResidential) {
    if (property.bedrooms != null && property.bedrooms > 0) {
      parts.push(`${property.bedrooms} bed`);
    }
    if (property.bathrooms != null && property.bathrooms > 0) {
      parts.push(`${property.bathrooms} bath`);
    }
  } else if (property.length && property.width) {
    parts.push(`${property.length} × ${property.width} ft`);
  } else {
    if (property.length) parts.push(`${property.length} ft L`);
    if (property.width) parts.push(`${property.width} ft W`);
  }

  return parts;
}

export function shouldShowCompanyPropertyAddress(property: Property, locationLabel: string): boolean {
  const address = property.location?.address?.trim();
  if (!address) return false;
  return !locationLabel || !address.toLowerCase().includes(locationLabel.toLowerCase().slice(0, 12));
}
