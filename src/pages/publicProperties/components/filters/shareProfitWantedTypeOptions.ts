/**
 * Share Profit wanted type options (4 types — not the same as Wanted Listings).
 */
import type { ShareProfitWantedType } from '@/types/shareProfitListing';

export const SHARE_PROFIT_WANTED_TYPES: ShareProfitWantedType[] = [
  'buyer',
  'renter',
  'seller',
  'share_profit',
];

export function getShareProfitWantedTypeLabel(
  type: ShareProfitWantedType,
  t: (key: string) => string,
  language: string
): string {
  switch (type) {
    case 'buyer':
      return t('search.buyer') || 'Buyer';
    case 'renter':
      return t('search.renter') || 'Renter';
    case 'seller':
      return t('search.seller') || (language === 'mm' ? 'ရောင်းသူ' : 'Seller');
    case 'share_profit':
      return t('search.shareProfit') || (language === 'mm' ? 'အကျိုးတူရ' : 'Share Profit');
    default:
      return type;
  }
}
