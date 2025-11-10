import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumPropertiesList, PropertyList, TanTanTanPropertiesList, WantedList } from './components';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePublicProperties } from '@/hooks/queries/usePublicProperties';
import { useWantedLists } from '@/hooks/queries/useWantedLists';
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
    const filters: PublicPropertyFilters = {
      per_page: 20,
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
  const { data: allPropertiesData } = usePublicProperties(filters);
  const allProperties = allPropertiesData?.data?.data || [];
  const premiumCount = allProperties.filter(p => p.premium).length;
  const tanTanTanCount = allProperties.filter(p => p.tan_tan_tan).length;
  const propertyCount = allProperties.length;
  
  const { data: wantedListsData } = useWantedLists({ per_page: 20 });
  const wantedCount = wantedListsData?.data?.data?.length || 0;

  const getResultsText = () => {
    let count = propertyCount;
    if (activeTab === 'premium') {
      count = premiumCount;
    } else if (activeTab === 'tantantan') {
      count = tanTanTanCount;
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
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                  {activeTab === 'premium' 
                    ? t('search.premium') 
                    : activeTab === 'tantantan' 
                    ? t('search.tanTanTan')
                    : activeTab === 'wanted'
                    ? t('search.wanted')
                    : t('search.properties')}
                </h1>
                <p className="text-muted-foreground mt-2">{getResultsText()}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 max-w-5xl">
                <TabsTrigger 
                  value="property"
                  className="data-[state=active]:text-primary"
                >
                  {t('search.properties') || 'Properties'} ({propertyCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="premium"
                  className="data-[state=active]:text-primary"
                >
                  {t('search.premium') || 'Premium'} ({premiumCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="tantantan"
                  className="data-[state=active]:text-primary"
                >
                  {t('search.tanTanTan') || 'Tan Tan Tan'} ({tanTanTanCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="wanted"
                  className="data-[state=active]:text-primary"
                >
                  {t('search.wanted') || 'Wanted'} ({wantedCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="property" className="space-y-4">
                <PropertyList filters={filters} />
              </TabsContent>

              <TabsContent value="premium" className="space-y-4">
                <PremiumPropertiesList filters={filters} />
              </TabsContent>

              <TabsContent value="tantantan" className="space-y-4">
                <TanTanTanPropertiesList filters={filters} />
              </TabsContent>

              <TabsContent value="wanted" className="space-y-4">
                <WantedList />
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </>
  );
}

