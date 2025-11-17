/**
 * Home Property Filters Component
 * 
 * Basic search filters for home page.
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, SlidersHorizontal, MapPin, Zap } from 'lucide-react';
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
import { useRegions } from '@/hooks/queries/useLocations';
import { HomeAdvancedSearchModal } from './HomeAdvancedSearchModal';
import type { PropertyType } from '@/services/api/propertyTypes';

export function HomePropertyFilters() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  
  // Get filter data
  const { data: propertyTypesData } = usePropertyTypes();
  const { data: regionsResp } = useRegions();
  
  const propertyTypes = propertyTypesData?.data || [];
  const regions = regionsResp?.data || [];

  // Local state for basic filters
  const [search, setSearch] = useState('');
  const [propertyTypeId, setPropertyTypeId] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('all');

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
    
    // Region - check additionalFilters first, then fall back to state
    if (filtersToUse?.region_id !== undefined) {
      params.set('region_id', String(filtersToUse.region_id));
    } else if (regionId !== 'all') {
      params.set('region_id', regionId);
    }
    
    // Listing Type - from advanced filters only
    if (filtersToUse?.listing_type_id !== undefined) {
      params.set('listing_type_id', String(filtersToUse.listing_type_id));
    }
    
    // Premium - from advanced filters only
    if (filtersToUse?.premium !== undefined) {
      params.set('premium', String(filtersToUse.premium));
    }
    
    // Installment - from advanced filters only
    if (filtersToUse?.installment !== undefined) {
      params.set('installment', String(filtersToUse.installment));
    }
    
    // Township - from advanced filters only
    if (filtersToUse?.township_id !== undefined) {
      params.set('township_id', String(filtersToUse.township_id));
    }
    
    // Property Condition - from advanced filters only
    if (filtersToUse?.property_condition !== undefined) {
      params.set('property_condition', filtersToUse.property_condition);
    }
    
    // Tan Tan Tan - from advanced filters only
    if (filtersToUse?.tan_tan_tan !== undefined) {
      params.set('tan_tan_tan', String(filtersToUse.tan_tan_tan));
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

  const getRegionName = (region: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? region.name_mm : region.name_en;
  };

  const handlePropertyTypeClick = (propertyTypeId: number) => {
    navigate(`/search?property_type_id=${propertyTypeId}`);
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6 shadow-lg shadow-primary/30">
      {/* Recommended Property Types */}
      {propertyTypes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg">
              {t('search.recommendedPropertyTypes') || 'Recommended Property Types'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handlePropertyTypeClick(type.id)}
                className="px-4 py-2 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {getPropertyTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Single Row: Search Input, Property Type, Region, Search Button, Filter Button */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
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

        {/* Property Type Select */}
        <div className="md:col-span-3">
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

        {/* Region Filter */}
        <div className="md:col-span-2">
          <Select 
            value={regionId} 
            onValueChange={setRegionId}
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

        {/* Search and Filter Buttons Container */}
        <div className="md:col-span-3 flex flex-col sm:flex-row gap-2">
          {/* Search Button */}
          <div className="flex-1">
            <Button
              onClick={() => handleSearch()}
              className="w-full h-10 px-4 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              <Search className="h-4 w-4 mr-2" />
              {t('search.search') || 'Search'}
            </Button>
          </div>

          {/* Filter Button */}
          <div className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-10 px-2"
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

