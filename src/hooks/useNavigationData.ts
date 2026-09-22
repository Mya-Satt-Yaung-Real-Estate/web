/**
 * Navigation Data Hook
 *
 * Custom hook for generating navigation data with API integration.
 */

import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyTypes } from './queries/useCompanyTypes';
import { useAuthStore } from '../stores/authStore';
import type { CompanyType } from '../types';
import {
  Search, Grid3x3, Star, Home as HomeIcon, Calculator,
  Calendar, Megaphone, BookOpen, HelpCircle, Mail, Info,
  Scale, Banknote, Building2, FileText, Building, Briefcase, TrendingUp, Users,
  ShoppingCart, Eye, Handshake, User, Images, StickyNote, ClipboardList,
} from 'lucide-react';

// Icon mapping for company types
const getCompanyTypeIcon = (nameEn: string) => {
  const name = nameEn.toLowerCase();
  if (name.includes('agency')) return HomeIcon;
  if (name.includes('construction')) return Building;
  if (name.includes('management')) return Briefcase;
  if (name.includes('developer')) return TrendingUp;
  if (name.includes('consultant')) return Users;
  return Building2; // Default icon
};

export function useNavigationData() {
  const { t, language } = useLanguage();
  const { data: companyTypesResponse } = useCompanyTypes();
  const companyTypes = companyTypesResponse?.data?.data || [];
  const isApprover = Boolean(useAuthStore((s) => s.user)?.is_property_note_approver);

  const navigationData = useMemo(() => ({
    navLinks: [
      { name: t('nav.home'), path: '/' },
    ],
    
    propertyCategories: [
      { name: t('categories.searchAllProperty'), path: '/search', icon: HomeIcon },
      { name: language === 'mm' ? 'ပရီမီယံအိမ်ခြံမြေ' : 'Premium Property', path: '/search?type=premium', icon: Star },
      { name: t('nav.marketplace'), path: '/search?type=marketplace', icon: ShoppingCart },
      { name: t('nav.projects'), path: '/search?type=projects', icon: Building2 },
      { name: t('nav.popular'), path: '/search?type=property&popular=true', icon: Eye },
      { name: t('listings.installment'), path: '/search?type=installment', icon: Calculator },
      { name: t('publicAdvertisements.tabLabel'), path: '/search?type=advertisements', icon: Megaphone },
      { name: t('services.housingEvent'), path: '/search?type=events', icon: Calendar },
      { name: language === 'mm' ? 'လိုချင်သောစာရင်း' : 'Wanted List', path: '/search?type=wanted', icon: FileText },
      { name: language === 'mm' ? 'အကျိုးတူရ' : 'Partnership Posts', path: '/search?type=share-profit', icon: Handshake },
      { name: t('search.directOwner') || (language === 'mm' ? 'ပိုင်ရှင်တိုက်ရိုက်' : 'Direct Owner Post'), path: '/search?type=direct-owner', icon: User },
      { name: language === 'mm' ? 'တန်တန်တန်အိမ်ခြံမြေ' : 'TanTanTan Property', path: '/search?type=tantantan', icon: Grid3x3 },
    ],
    
    createListingOptions: [
      { name: t('createListing.propertyPost'), path: '/my-properties', icon: HomeIcon },
      { name: t('createListing.projectListing'), path: '/my-projects', icon: Building2 },
      { name: t('createListing.wantedPost'), path: '/my-wanted-listings/list', icon: Search },
      { name: language === 'mm' ? 'အကျိုးတူရ' : 'Partnership Posts', path: '/my-share-profit-listings/list', icon: Handshake },
      {
        name: language === 'mm' ? 'ပိုင်ဆိုင်မှု မှတ်စု' : 'Property Notes',
        path: '/my-property-notes',
        icon: StickyNote,
      },
      ...(isApprover
        ? [
            {
              name: language === 'mm' ? 'PN Unlock တောင်းဆိုမှုများ' : 'PN Unlock Requests',
              path: '/my-property-notes/approvals',
              icon: ClipboardList,
            },
          ]
        : []),
      { name: t('createListing.activityPost') || (language === 'mm' ? 'လုပ်ဆောင်မှု မှတ်တမ်းများ' : 'Activities'), path: '/my-activities/list', icon: Images },
      { name: t('createListing.advertisementPost'), path: '/advertisements', icon: Megaphone },
      { name: t('createListing.appointmentRequest'), path: '/appointments', icon: Calendar },
      { name: t('createListing.giveYourReview'), path: '/reviews', icon: Star },
      { name: t('services.homeLoanRequest'), path: '/loan-request', icon: Banknote },
    ],
    
    calculatorOptions: [
      { name: t('calculators.loanCalculator'), path: '/loan-calculator', icon: Banknote },
      { name: t('calculators.yarPyatTaxCalculator'), path: '/yarpyat-taxes-calculator', icon: Calculator },
    ],
    
    knowledgeCategories: [
      { name: t('services.knowledgeHub'), path: '/knowledge-hub', icon: BookOpen },
      { name: t('services.newsUpdates'), path: '/news-and-updates', icon: Info },
      { name: t('services.faq'), path: '/faq', icon: HelpCircle },
      { name: t('services.aboutUs'), path: '/about', icon: Info },
      { name: t('services.contactUs'), path: '/contact', icon: Mail },
      { name: t('services.legalTeam'), path: '/legacy', icon: Scale },
    ],
    
    // Dynamic company categories from API with "All Categories" option
    companyCategories: [
      {
        name: language === 'mm' ? 'အမျိုးအစားအားလုံး' : 'All Companies',
        path: '/companies',
        icon: Building2,
      },
      ...companyTypes.map((type: CompanyType) => ({
        name: language === 'mm' ? type.name_mm : type.name_en,
        path: `/companies?typeId=${type.id}`,
        icon: getCompanyTypeIcon(type.name_en),
      })),
    ],
  }), [t, language, companyTypes, isApprover]);

  return navigationData;
}
