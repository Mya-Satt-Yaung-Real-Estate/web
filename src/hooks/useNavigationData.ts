/**
 * Navigation Data Hook
 *
 * Custom hook for generating navigation data with API integration.
 */

import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompanyTypes } from './queries/useCompanyTypes';
import type { CompanyType } from '../types';
import {
  Search, Grid3x3, Star, Home as HomeIcon, Building, TrendingUp, Calculator,
  Briefcase, Users, Calendar, Megaphone, BookOpen, HelpCircle, Mail, Info,
  Scale, Banknote, Building2
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

  const navigationData = useMemo(() => ({
    navLinks: [
      { name: t('nav.home'), path: '/' },
    ],
    
    propertyCategories: [
      { name: t('categories.searchAllProperty'), path: '/search-all', icon: Search },
      { name: t('categories.tantantan'), path: '/search-all?filter=tantantan', icon: Grid3x3 },
      { name: t('categories.premiumProperties'), path: '/search-all?type=premium', icon: Star },
      { name: t('listings.forSale'), path: '/search-all?filter=sale', icon: HomeIcon },
      { name: t('listings.forRent'), path: '/search-all?filter=rent', icon: Building },
      { name: t('categories.preSale'), path: '/search-all?filter=presale', icon: TrendingUp },
      { name: t('categories.installment'), path: '/search-all?filter=installment', icon: Calculator },
      { name: t('categories.buyerPosts'), path: '/search-all?type=wanted&listingType=buyer', icon: Search },
      { name: t('categories.renterPosts'), path: '/search-all?type=wanted&listingType=renter', icon: Users },
      { name: t('categories.vacanciesJobs'), path: '/search-all?type=job', icon: Briefcase },
      { name: t('services.housingEvent'), path: '/search-all?type=event', icon: Calendar },
    ],
    
    createListingOptions: [
      { name: t('createListing.propertyPost'), path: '/properties', icon: HomeIcon },
      { name: t('createListing.wantedPost'), path: '/my-wanted-listings/list', icon: Search },
      { name: t('createListing.advertisementPost'), path: '/advertisements', icon: Megaphone },
      { name: t('createListing.appointmentRequest'), path: '/appointments', icon: Calendar },
      { name: t('createListing.giveYourReview'), path: '/feedback', icon: Star },
      { name: t('createListing.jobPostCreate'), path: '/jobs', icon: Briefcase },
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
  }), [t, language, companyTypes]);

  return navigationData;
}
