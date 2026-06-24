import type { Advertisement } from '@/types/advertisement';

export function getCompanyAdvertisementTitle(advertisement: Advertisement, language: string): string {
  return language === 'mm' ? advertisement.title_mm : advertisement.title_en;
}

export function getCompanyAdvertisementLocation(advertisement: Advertisement, language: string): string {
  const region = language === 'mm' ? advertisement.location?.region?.name_mm : advertisement.location?.region?.name_en;
  const township = language === 'mm' ? advertisement.location?.township?.name_mm : advertisement.location?.township?.name_en;
  return region && township ? `${township}, ${region}` : '';
}

export function formatCompanyAdvertisementCreatedDate(advertisement: Advertisement, language: string): string {
  const createdAt = advertisement.dates?.created_at;
  if (!createdAt) return '-';

  return new Date(createdAt).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCompanyAdvertisementExpireDate(advertisement: Advertisement, language: string): string {
  const expiresAt = advertisement.dates?.expires_at;
  if (!expiresAt) return '-';

  return new Date(expiresAt).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function shouldShowCompanyAdvertisementAddress(advertisement: Advertisement, locationLabel: string): boolean {
  const address = advertisement.location?.address?.trim();
  if (!address) return false;
  return !locationLabel || !address.toLowerCase().includes(locationLabel.toLowerCase().slice(0, 12));
}

export function getCompanyAdvertisementTypeLabel(
  advertisementType: 'for_rent' | 'for_sale' | undefined,
  t: (key: string) => string | undefined
): string {
  return advertisementType === 'for_rent'
    ? (t('advertisements.forRent') || 'For Rent')
    : (t('advertisements.forSale') || 'For Sale');
}

export function getCompanyAdvertisementTypeBadgeClass(
  advertisementType: 'for_rent' | 'for_sale' | undefined
): string {
  return advertisementType === 'for_rent'
    ? 'bg-sky-500/10 text-sky-700 border-sky-500/30'
    : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
}
