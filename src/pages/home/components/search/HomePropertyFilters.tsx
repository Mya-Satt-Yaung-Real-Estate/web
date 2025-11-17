/**
 * Home Property Filters Component
 * 
 * Basic search filters for home page.
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, Tag, SlidersHorizontal, MapPin, Star, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useListingTypes } from '@/hooks/queries/useProperties';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { HomeAdvancedSearchModal } from './HomeAdvancedSearchModal';
import type { PropertyType } from '@/services/api/propertyTypes';
import type { ListingType } from '@/services/api/listingTypes';

export function HomePropertyFilters() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  
  // Get filter data
  const { data: propertyTypesData } = usePropertyTypes();
  const { data: listingTypesData } = useListingTypes();
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  
  const propertyTypes = propertyTypesData?.data || [];
  const listingTypes = listingTypesData?.data || [];
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];

  // Local state for basic filters
  const [search, setSearch] = useState('');
  const [propertyTypeId, setPropertyTypeId] = useState<string>('all');
  const [listingTypeId, setListingTypeId] = useState<string>('all');
  const [premium, setPremium] = useState<string>('all');
  const [installment, setInstallment] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('all');
  const [townshipId, setTownshipId] = useState<string>('all');
  const [propertyDecoration, setPropertyDecoration] = useState<string>('all');
  const [tanTanTan, setTanTanTan] = useState<string>('all');

  // Filter townships by selected region
  const filteredTownships = useMemo(() => {
    if (regionId === 'all') return allTownships;
    return allTownships.filter((t: any) => String(t.region_id) === regionId);
  }, [regionId, allTownships]);

  // Reset township when region changes
  useEffect(() => {
    if (regionId === 'all') {
      setTownshipId('all');
    } else {
      // Keep township if it's still valid for the new region
      const township = filteredTownships.find((t: any) => String(t.id) === townshipId);
      if (!township) {
        setTownshipId('all');
      }
    }
  }, [regionId, filteredTownships, townshipId]);

  // Advanced filters state (will be set from modal)
  const [advancedFilters, setAdvancedFilters] = useState<{
    tan_tan_tan?: boolean;
    premium?: boolean;
    installment?: boolean;
    price_low_to_high?: boolean;
    property_condition?: 'ready' | 'some' | 'no';
    property_type_id?: number;
    listing_type_id?: number;
    region_id?: number;
    township_id?: number;
    bedrooms?: number;
    bathrooms?: number;
    min_area?: number;
    max_area?: number;
    min_price?: number;
    max_price?: number;
  }>({});

  const handleSearch = (additionalFilters?: typeof advancedFilters) => {
    const params = new URLSearchParams();
    
    // Use provided filters or fall back to state
    const filtersToUse = additionalFilters || advancedFilters;
    
    // Add basic filters
    if (search) {
      params.set('search', search);
    }
    
    // Property Type - check additionalFilters first, then fall back to state
    if (filtersToUse?.property_type_id !== undefined) {
      params.set('property_type_id', String(filtersToUse.property_type_id));
    } else if (propertyTypeId && propertyTypeId !== 'all') {
      params.set('property_type_id', propertyTypeId);
    }
    
    // Listing Type - check additionalFilters first, then fall back to state
    if (filtersToUse?.listing_type_id !== undefined) {
      params.set('listing_type_id', String(filtersToUse.listing_type_id));
    } else if (listingTypeId && listingTypeId !== 'all') {
      params.set('listing_type_id', listingTypeId);
    }
    
    // Premium - check additionalFilters first, then fall back to state
    if (filtersToUse?.premium !== undefined) {
      params.set('premium', String(filtersToUse.premium));
    } else if (premium !== 'all') {
      params.set('premium', premium);
    }
    
    // Installment - check additionalFilters first, then fall back to state
    if (filtersToUse?.installment !== undefined) {
      params.set('installment', String(filtersToUse.installment));
    } else if (installment !== 'all') {
      params.set('installment', installment);
    }
    
    // Region - check additionalFilters first, then fall back to state
    if (filtersToUse?.region_id !== undefined) {
      params.set('region_id', String(filtersToUse.region_id));
    } else if (regionId !== 'all') {
      params.set('region_id', regionId);
    }
    
    // Township - check additionalFilters first, then fall back to state
    if (filtersToUse?.township_id !== undefined) {
      params.set('township_id', String(filtersToUse.township_id));
    } else if (townshipId !== 'all') {
      params.set('township_id', townshipId);
    }
    
    // Property Condition - check additionalFilters first, then fall back to state
    if (filtersToUse?.property_condition !== undefined) {
      params.set('property_condition', filtersToUse.property_condition);
    } else if (propertyDecoration !== 'all') {
      params.set('property_condition', propertyDecoration);
    }
    
    // Tan Tan Tan - check additionalFilters first, then fall back to state
    if (filtersToUse?.tan_tan_tan !== undefined) {
      params.set('tan_tan_tan', String(filtersToUse.tan_tan_tan));
    } else if (tanTanTan !== 'all') {
      params.set('tan_tan_tan', tanTanTan);
    }
    
    // Add advanced filters
    if (filtersToUse?.price_low_to_high !== undefined) {
      params.set('price_low_to_high', String(filtersToUse.price_low_to_high));
    }
    if (filtersToUse?.bedrooms) {
      params.set('bedrooms', String(filtersToUse.bedrooms));
    }
    if (filtersToUse?.bathrooms) {
      params.set('bathrooms', String(filtersToUse.bathrooms));
    }
    if (filtersToUse?.min_area) {
      params.set('min_area', String(filtersToUse.min_area));
    }
    if (filtersToUse?.max_area) {
      params.set('max_area', String(filtersToUse.max_area));
    }
    if (filtersToUse?.min_price) {
      params.set('min_price', String(filtersToUse.min_price));
    }
    if (filtersToUse?.max_price) {
      params.set('max_price', String(filtersToUse.max_price));
    }
    
    // Navigate to search page with filters
    navigate(`/search?${params.toString()}`);
  };

  const handleAdvancedFiltersAndSearch = (filters: typeof advancedFilters) => {
    setAdvancedFilters(filters);
    // Trigger search with the new filters immediately
    handleSearch(filters);
  };


  const getPropertyTypeName = (type: PropertyType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  const getListingTypeName = (type: ListingType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  const getRegionName = (region: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? region.name_mm : region.name_en;
  };

  const getTownshipName = (township: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? township.name_mm : township.name_en;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      {/* First Row: Search Input, Region, Township */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.searchPlaceholder') || 'Search by title, description, owner name...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Region Filter */}
        <div className="md:col-span-3">
          <Select 
            value={regionId} 
            onValueChange={(value) => {
              setRegionId(value);
              setTownshipId('all');
            }}
          >
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('search.region') || 'Region'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.allRegions') || 'All Regions'}</SelectItem>
              {regions.map((region: any) => (
                <SelectItem key={region.id} value={String(region.id)}>
                  {getRegionName(region)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Township Filter */}
        <div className="md:col-span-3">
          <Select
            value={townshipId}
            onValueChange={setTownshipId}
            disabled={regionId === 'all'}
          >
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('search.township') || 'Township'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.allTownships') || 'All Townships'}</SelectItem>
              {filteredTownships.map((township: any) => (
                <SelectItem key={township.id} value={String(township.id)}>
                  {getTownshipName(township)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Second Row: Premium, Installment, Property Type, Listing Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-4 items-end">
        {/* Premium Filter */}
        <div className="lg:col-span-3">
          <Select value={premium} onValueChange={setPremium}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Star className="h-4 w-4 mr-2 text-primary" />
              <SelectValue>
                {premium === 'all' 
                  ? t('search.premium') || 'Premium'
                  : premium === 'true'
                  ? `${t('search.premium') || 'Premium'}: ${t('search.yes') || 'Yes'}`
                  : `${t('search.premium') || 'Premium'}: ${t('search.no') || 'No'}`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
              <SelectItem value="true">{t('search.yes') || 'Yes'}</SelectItem>
              <SelectItem value="false">{t('search.no') || 'No'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Installment Filter */}
        <div className="lg:col-span-3">
          <Select value={installment} onValueChange={setInstallment}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              <SelectValue>
                {installment === 'all'
                  ? t('listings.installment') || 'Installment'
                  : installment === 'true'
                  ? `${t('listings.installment') || 'Installment'}: ${t('search.yes') || 'Yes'}`
                  : `${t('listings.installment') || 'Installment'}: ${t('search.no') || 'No'}`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
              <SelectItem value="true">{t('search.yes') || 'Yes'}</SelectItem>
              <SelectItem value="false">{t('search.no') || 'No'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Select */}
        <div className="lg:col-span-3">
          <Select value={propertyTypeId} onValueChange={setPropertyTypeId}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Home className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('search.propertyType') || 'Property Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.allTypes') || 'All Types'}</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {getPropertyTypeName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Listing Type Select */}
        <div className="lg:col-span-3">
          <Select value={listingTypeId} onValueChange={setListingTypeId}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('search.listingType') || 'Listing Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.allListingTypes') || 'All Listing Types'}</SelectItem>
              {listingTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {getListingTypeName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Third Row: Property Decoration, Tan Tan Tan, Search Button, Filter Button */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-4 items-end">
        {/* Property Decoration Filter */}
        <div className="lg:col-span-3">
          <Select value={propertyDecoration} onValueChange={setPropertyDecoration}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Home className="h-4 w-4 mr-2 text-primary" />
              <SelectValue>
                {propertyDecoration === 'all'
                  ? t('search.propertyCondition') || 'Property Condition'
                  : propertyDecoration === 'ready'
                  ? `${t('search.propertyCondition') || 'Property Condition'}: ${t('search.ready') || 'Ready'}`
                  : propertyDecoration === 'some'
                  ? `${t('search.propertyCondition') || 'Property Condition'}: ${t('search.some') || 'Some'}`
                  : `${t('search.propertyCondition') || 'Property Condition'}: ${t('search.no') || 'No'}`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
              <SelectItem value="ready">{t('search.ready') || 'Ready'}</SelectItem>
              <SelectItem value="some">{t('search.some') || 'Some'}</SelectItem>
              <SelectItem value="no">{t('search.no') || 'No'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tan Tan Tan Filter */}
        <div className="lg:col-span-3">
          <Select value={tanTanTan} onValueChange={setTanTanTan}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <Star className="h-4 w-4 mr-2 text-primary" />
              <SelectValue>
                {tanTanTan === 'all'
                  ? t('search.tanTanTan') || 'Tan Tan Tan'
                  : tanTanTan === 'true'
                  ? `${t('search.tanTanTan') || 'Tan Tan Tan'}: ${t('search.yes') || 'Yes'}`
                  : `${t('search.tanTanTan') || 'Tan Tan Tan'}: ${t('search.no') || 'No'}`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
              <SelectItem value="true">{t('search.yes') || 'Yes'}</SelectItem>
              <SelectItem value="false">{t('search.no') || 'No'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search and Filter Buttons Container */}
        <div className="sm:col-span-2 lg:col-span-6 flex flex-col sm:flex-row gap-4 lg:gap-2 lg:justify-end">
          {/* Search Button */}
          <div className="flex-1 lg:flex-initial">
            <Button
              onClick={() => handleSearch()}
              className="w-full lg:w-36 h-10 px-4 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              <Search className="h-4 w-4 mr-2" />
              {t('search.search') || 'Search'}
            </Button>
          </div>

          {/* Filter Button */}
          <div className="flex-1 lg:flex-initial">
            <Button
              variant="outline"
              size="sm"
              className="w-full lg:w-32 h-10 px-2"
              onClick={() => setIsAdvancedModalOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{t('search.filter') || 'Filter'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <HomeAdvancedSearchModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onApply={handleAdvancedFiltersAndSearch}
        initialFilters={advancedFilters}
      />
    </div>
  );
}

