import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumPropertiesList, PropertyList, TanTanTanPropertiesList, InstallmentPropertiesList, AdvertisementList, EventList, WantedList } from './components';
import { PropertyFilters, AdvertisementFilters, WantedFilters, EventFilters } from './components/filters';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStatisticsCounts } from '@/hooks/queries/useStatisticsCounts';
import type { PublicPropertyFilters } from '@/types/publicProperties';
import type { PublicAdvertisementFilters } from '@/types/publicAdvertisements';
import type { WantedListFilters } from '@/services/api/wantedList';
import type { HousingEventFilters } from '@/types/housingEvents';

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
    
    // Reset all filter parameters when changing tabs
    // Basic search
    newParams.delete('search');
    
    // Property/Premium/Installment/TanTanTan filters
    newParams.delete('property_type_id');
    newParams.delete('listing_type_id');
    newParams.delete('region_id');
    newParams.delete('township_id');
    newParams.delete('min_price');
    newParams.delete('max_price');
    newParams.delete('bedrooms');
    newParams.delete('bathrooms');
    newParams.delete('min_area');
    newParams.delete('max_area');
    newParams.delete('tan_tan_tan');
    newParams.delete('premium');
    newParams.delete('installment');
    newParams.delete('price_low_to_high');
    newParams.delete('property_condition');
    
    // Advertisement filters
    // (region_id and township_id already deleted above)
    
    // Wanted filters
    newParams.delete('wanted_type');
    newParams.delete('prefer_region_id');
    newParams.delete('prefer_township_id');
    newParams.delete('min_budget');
    newParams.delete('max_budget');
    // (min_area and max_area already deleted above)
    
    // Event filters
    newParams.delete('date_from');
    newParams.delete('date_to');
    // (region_id and township_id already deleted above)
    
    // Reset page to 1 when changing tabs
    newParams.delete('page');
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

    const listingTypeId = searchParams.get('listing_type_id');
    if (listingTypeId) filters.listing_type_id = Number(listingTypeId);

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

    const tanTanTan = searchParams.get('tan_tan_tan');
    if (tanTanTan === 'true') filters.tan_tan_tan = true;
    if (tanTanTan === 'false') filters.tan_tan_tan = false;

    const premium = searchParams.get('premium');
    if (premium === 'true') filters.premium = true;
    if (premium === 'false') filters.premium = false;

    const installment = searchParams.get('installment');
    if (installment === 'true') filters.installment = true;
    if (installment === 'false') filters.installment = false;

    const priceLowToHigh = searchParams.get('price_low_to_high');
    if (priceLowToHigh === 'true') filters.price_low_to_high = true;
    if (priceLowToHigh === 'false') filters.price_low_to_high = false;

    const propertyCondition = searchParams.get('property_condition');
    if (propertyCondition && ['ready', 'some', 'no'].includes(propertyCondition)) {
      filters.property_condition = propertyCondition as 'ready' | 'some' | 'no';
    }

    const userId = searchParams.get('user_id');
    if (userId) filters.user_id = Number(userId);

    return filters;
  };

  const getAdvertisementFiltersFromParams = (): PublicAdvertisementFilters => {
    const perPageParam = 20;
    const filters: PublicAdvertisementFilters = {
      per_page: perPageParam,
      page: 1,
    };

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const advertisementType = searchParams.get('advertisement_type');
    if (advertisementType === 'for_rent' || advertisementType === 'for_sale') {
      filters.advertisement_type = advertisementType;
    }

    const regionId = searchParams.get('region_id');
    if (regionId) filters.region_id = Number(regionId);

    const townshipId = searchParams.get('township_id');
    if (townshipId) filters.township_id = Number(townshipId);

    return filters;
  };

  const getWantedFiltersFromParams = (): WantedListFilters => {
    const perPageParam = 30;
    const filters: WantedListFilters = {
      per_page: perPageParam,
      page: 1,
    };

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const propertyTypeId = searchParams.get('property_type_id');
    if (propertyTypeId) filters.property_type_id = Number(propertyTypeId);

    const preferRegionId = searchParams.get('prefer_region_id');
    if (preferRegionId) filters.prefer_region_id = Number(preferRegionId);

    const preferTownshipId = searchParams.get('prefer_township_id');
    if (preferTownshipId) filters.prefer_township_id = Number(preferTownshipId);

    const wantedType = searchParams.get('wanted_type');
    if (wantedType && (wantedType === 'buyer' || wantedType === 'renter')) {
      filters.wanted_type = wantedType as 'buyer' | 'renter';
    }

    const minBudget = searchParams.get('min_budget');
    if (minBudget) filters.min_budget = Number(minBudget);

    const maxBudget = searchParams.get('max_budget');
    if (maxBudget) filters.max_budget = Number(maxBudget);

    const minArea = searchParams.get('min_area');
    if (minArea) filters.min_area = Number(minArea);

    const maxArea = searchParams.get('max_area');
    if (maxArea) filters.max_area = Number(maxArea);

    return filters;
  };

  const getEventFiltersFromParams = (): HousingEventFilters => {
    const perPageParam = 20;
    const filters: HousingEventFilters = {
      per_page: perPageParam,
      page: 1,
    };

    const search = searchParams.get('search');
    if (search) filters.search = search;

    const dateFrom = searchParams.get('date_from');
    if (dateFrom) filters.date_from = dateFrom;

    const dateTo = searchParams.get('date_to');
    if (dateTo) filters.date_to = dateTo;

    const regionId = searchParams.get('region_id');
    if (regionId) filters.region_id = Number(regionId);

    const townshipId = searchParams.get('township_id');
    if (townshipId) filters.township_id = Number(townshipId);

    return filters;
  };

  const filters = useMemo(() => getFiltersFromParams(), [searchParams.toString()]);
  const advertisementFilters = useMemo(() => getAdvertisementFiltersFromParams(), [searchParams.toString()]);
  const wantedFilters = useMemo(() => getWantedFiltersFromParams(), [searchParams.toString()]);
  const eventFilters = useMemo(() => getEventFiltersFromParams(), [searchParams.toString()]);
  
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
              <div className="w-full overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
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
                  value="tantantan"
                  className="data-[state=active]:text-primary whitespace-nowrap flex-shrink-0 sm:flex-shrink text-xs sm:text-sm"
                >
                  {t('search.tanTanTan') || 'Tan Tan Tan'} ({tanTanTanCount})
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
                
                </TabsList>
              </div>

              {/* Property Filters - Show for Property, Premium, Installment, and TanTanTan tabs */}
              {(activeTab === 'property' || activeTab === 'premium' || activeTab === 'installment' || activeTab === 'tantantan') && (
                <PropertyFilters />
              )}

              {/* Advertisement Filters - Show for Advertisements tab */}
              {activeTab === 'advertisements' && (
                <AdvertisementFilters />
              )}

              {/* Wanted Filters - Show for Wanted tab */}
              {activeTab === 'wanted' && (
                <WantedFilters />
              )}

              {/* Event Filters - Show for Events tab */}
              {activeTab === 'events' && (
                <EventFilters />
              )}

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
                  <AdvertisementList filters={advertisementFilters} />
                </TabsContent>
              )}

              {activeTab === 'events' && (
                <TabsContent value="events" className="space-y-4">
                  <EventList filters={eventFilters} />
                </TabsContent>
              )}

              {activeTab === 'tantantan' && (
                <TabsContent value="tantantan" className="space-y-4">
                  <TanTanTanPropertiesList filters={filters} />
                </TabsContent>
              )}

              {activeTab === 'wanted' && (
                <TabsContent value="wanted" className="space-y-4">
                  <WantedList filters={wantedFilters} />
                </TabsContent>
              )}
            </Tabs>
        </div>
      </div>
    </>
  );
}

