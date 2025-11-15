import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumPropertiesList, PropertyList, TanTanTanPropertiesList, InstallmentPropertiesList, AdvertisementList, EventList, WantedList } from './components';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStatisticsCounts } from '@/hooks/queries/useStatisticsCounts';
import type { PublicPropertyFilters } from '@/types/publicProperties';

export default function PublicProperties() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'property');
  
  const seo = seoUtils.getPageSEO('properties');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setActiveTab(typeParam);
    } else {
      setActiveTab('property');
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    if (value === 'property') {
      newParams.delete('type');
    } else {
      newParams.set('type', value);
    }
    setSearchParams(newParams);
  };

  const getFiltersFromParams = (): PublicPropertyFilters => {
    const perPageParam = 30;
    const filters: PublicPropertyFilters = {
      per_page: perPageParam,
      page: 1,
    };

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const propertyTypeId = searchParams.get('property_type_id');
    if (propertyTypeId) filters.property_type_id = Number(propertyTypeId);

    const regionId = searchParams.get('region_id');
    if (regionId) filters.region_id = Number(regionId);

    const townshipId = searchParams.get('township_id');
    if (townshipId) filters.township_id = Number(townshipId);

    const minPrice = searchParams.get('min_price');
    if (minPrice) filters.min_price = Number(minPrice);

    const maxPrice = searchParams.get('max_price');
    if (maxPrice) filters.max_price = Number(maxPrice);

    const bedrooms = searchParams.get('bedrooms');
    if (bedrooms) filters.bedrooms = Number(bedrooms);

    const bathrooms = searchParams.get('bathrooms');
    if (bathrooms) filters.bathrooms = Number(bathrooms);

    const minArea = searchParams.get('min_area');
    if (minArea) filters.min_area = Number(minArea);

    const maxArea = searchParams.get('max_area');
    if (maxArea) filters.max_area = Number(maxArea);

    return filters;
  };

  const filters = getFiltersFromParams();
  
  // Fetch statistics counts from API
  const { data: countsData } = useStatisticsCounts();
  
  const propertyCount = countsData?.data?.data?.all_properties_count ?? 0;
  const premiumCount = countsData?.data?.data?.premium_properties_count ?? 0;
  const tanTanTanCount = countsData?.data?.data?.tan_tan_tan_properties_count ?? 0;
  const installmentCount = countsData?.data?.data?.installment_properties_count ?? 0;
  const advertisementCount = countsData?.data?.data?.advertisements_count ?? 0;
  const eventCount = countsData?.data?.data?.housing_events_count ?? 0;
  const wantedCount = countsData?.data?.data?.wanted_listings_count ?? 0;

  const getResultsText = () => {
    let count = propertyCount;
    if (activeTab === 'premium') {
      count = premiumCount;
    } else if (activeTab === 'tantantan') {
      count = tanTanTanCount;
    } else if (activeTab === 'installment') {
      count = installmentCount;
    } else if (activeTab === 'advertisements') {
      count = advertisementCount;
    } else if (activeTab === 'events') {
      count = eventCount;
    } else if (activeTab === 'wanted') {
      count = wantedCount;
    }
    
    const isPlural = count !== 1;
    
    if (activeTab === 'premium') {
      const text = isPlural ? t('search.premiumFoundPlural') : t('search.premiumFound');
      return text.replace('{count}', count.toString());
    } else if (activeTab === 'tantantan') {
      const text = isPlural ? t('search.tanTanTanFoundPlural') : t('search.tanTanTanFound');
      return text.replace('{count}', count.toString());
    } else if (activeTab === 'installment') {
      const text = isPlural ? t('search.installmentFoundPlural') : t('search.installmentFound');
      return text.replace('{count}', count.toString());
    } else if (activeTab === 'advertisements') {
      const text = isPlural ? t('publicAdvertisements.foundPlural') : t('publicAdvertisements.found');
      return text.replace('{count}', count.toString());
    } else if (activeTab === 'events') {
      const text = isPlural ? t('events.foundPlural') : t('events.found');
      return text.replace('{count}', count.toString());
    } else if (activeTab === 'wanted') {
      const text = isPlural ? t('search.wantedFoundPlural') : t('search.wantedFound');
      return text.replace('{count}', count.toString());
    } else {
      const text = isPlural ? t('search.propertyFoundPlural') : t('search.propertyFound');
      return text.replace('{count}', count.toString());
    }
  };

  return (
    <>
      <SEOHead seo={seo} path="/search" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                  {activeTab === 'premium' 
                    ? t('search.premium') 
                    : activeTab === 'tantantan' 
                    ? t('search.tanTanTan')
                    : activeTab === 'installment'
                    ? t('listings.installment')
                    : activeTab === 'advertisements'
                    ? t('publicAdvertisements.title') || 'Advertisements'
                    : activeTab === 'events'
                    ? t('events.tabLabel') || 'Events'
                    : activeTab === 'wanted'
                    ? t('search.wanted')
                    : t('search.properties')}
                </h1>
                <p className="text-muted-foreground mt-2">{getResultsText()}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
              <div className="w-full max-w-5xl overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
                <TabsList className="w-full min-w-max sm:min-w-0 sm:grid sm:grid-cols-7 gap-1 sm:gap-0 inline-flex sm:inline-grid">
                
                <TabsTrigger 
                  value="property"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('search.properties') || 'Properties'} ({propertyCount})
                </TabsTrigger>

                <TabsTrigger 
                  value="premium"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('search.premium') || 'Premium'} ({premiumCount})
                </TabsTrigger>

                <TabsTrigger 
                  value="installment"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('listings.installment') || 'Installment'} ({installmentCount})
                </TabsTrigger>

                <TabsTrigger 
                  value="advertisements"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('publicAdvertisements.tabLabel') || 'Ads'} ({advertisementCount})
                </TabsTrigger>

                <TabsTrigger 
                  value="events"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('events.tabLabel') || 'Events'} ({eventCount})
                </TabsTrigger>

                <TabsTrigger 
                  value="wanted"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('search.wanted') || 'Wanted'} ({wantedCount})
                </TabsTrigger>

                <TabsTrigger 
                  value="tantantan"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('search.tanTanTan') || 'Tan Tan Tan'} ({tanTanTanCount})
                </TabsTrigger>
                
                </TabsList>
              </div>

              {activeTab === 'property' && (
                <TabsContent value="property" className="space-y-4">
                  <PropertyList filters={filters} />
                </TabsContent>
              )}

              {activeTab === 'premium' && (
                <TabsContent value="premium" className="space-y-4">
                  <PremiumPropertiesList filters={filters} />
                </TabsContent>
              )}

              {activeTab === 'installment' && (
                <TabsContent value="installment" className="space-y-4">
                  <InstallmentPropertiesList filters={filters} />
                </TabsContent>
              )}

              {activeTab === 'advertisements' && (
                <TabsContent value="advertisements" className="space-y-4">
                  <AdvertisementList />
                </TabsContent>
              )}

              {activeTab === 'events' && (
                <TabsContent value="events" className="space-y-4">
                  <EventList />
                </TabsContent>
              )}

              {activeTab === 'tantantan' && (
                <TabsContent value="tantantan" className="space-y-4">
                  <TanTanTanPropertiesList filters={filters} />
                </TabsContent>
              )}

              {activeTab === 'wanted' && (
                <TabsContent value="wanted" className="space-y-4">
                  <WantedList />
                </TabsContent>
              )}
            </Tabs>
        </div>
      </div>
    </>
  );
}

