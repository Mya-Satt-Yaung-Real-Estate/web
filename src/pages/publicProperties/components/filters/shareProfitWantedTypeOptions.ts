/**
 * Partnership Posts wanted type options (Website UI).
 * API/DB values: buyer | seller | for_rent | renter
 */
import type { ShareProfitWantedType } from '@/types/shareProfitListing';

/** Display order: Buyer, Seller, For Rent, Renter */
export const SHARE_PROFIT_WANTED_TYPES: ShareProfitWantedType[] = [
  'buyer',
  'seller',
  'for_rent',
  'renter',
];

export function getShareProfitWantedTypeLabel(
  type: ShareProfitWantedType,
  t: (key: string) => string,
  language: string
): string {
  switch (type) {
    case 'buyer':
      return t('search.buyer') || 'Buyer';
    case 'seller':
      return t('search.seller') || (language === 'mm' ? 'ရောင်းသူ' : 'Seller');
    case 'for_rent':
      return t('search.partnershipForRent') || (language === 'mm' ? 'ငှားမည့်သူ' : 'For Rent');
    case 'renter':
      return t('search.renter') || 'Renter';
    default:
      return type;
  }
}
