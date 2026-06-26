/**
 * Home Property Filters Component
 * 
 * Basic search filters for home page.
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LocationAutocomplete } from '@/components/ui/LocationAutocomplete';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { HomeAdvancedSearchModal } from './HomeAdvancedSearchModal';
import type { PropertyType } from '@/services/api/propertyTypes';

export function HomePropertyFilters() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  
  // Get filter data
  const { data: propertyTypesData } = usePropertyTypes();
  const { data: regionsResp, isLoading: regionsLoading } = useRegions();
  const { data: townshipsResp, isLoading: townshipsLoading } = useTownships();
  
  const propertyTypes = propertyTypesData?.data || [];
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];

  // Local state for basic filters
  const [search, setSearch] = useState('');
  const [regionId, setRegionId] = useState<string>('all');
  const [townshipId, setTownshipId] = useState<string>('all');

  const filteredTownships = useMemo(() => {
    if (regionId === 'all') {
      return [];
    }

    return allTownships.filter((township: { region_id: number }) => String(township.region_id) === regionId);
  }, [regionId, allTownships]);

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
    const usingAdvanced = additionalFilters !== undefined;
    
    // Add basic filters
    if (search) {
      params.set('search', search);
    }
    
    // Property Type - from advanced filters only
    if (usingAdvanced && additionalFilters?.property_type_id !== undefined) {
      params.set('property_type_id', String(additionalFilters.property_type_id));
    }
    
    // Region - basic filters take priority unless advanced search was applied
    if (usingAdvanced && additionalFilters?.region_id !== undefined) {
      params.set('region_id', String(additionalFilters.region_id));
    } else if (regionId !== 'all') {
      params.set('region_id', regionId);
    }
    
    // Listing Type - from advanced filters only
    if (usingAdvanced && additionalFilters?.listing_type_id !== undefined) {
      params.set('listing_type_id', String(additionalFilters.listing_type_id));
    }
    
    // Premium - from advanced filters only
    if (usingAdvanced && additionalFilters?.premium !== undefined) {
      params.set('premium', String(additionalFilters.premium));
    }
    
    // Installment - from advanced filters only
    if (usingAdvanced && additionalFilters?.installment !== undefined) {
      params.set('installment', String(additionalFilters.installment));
    }
    
    // Township - basic filters take priority unless advanced search was applied
    if (usingAdvanced && additionalFilters?.township_id !== undefined) {
      params.set('township_id', String(additionalFilters.township_id));
    } else if (townshipId !== 'all') {
      params.set('township_id', townshipId);
    }
    
    // Property Condition - from advanced filters only
    if (usingAdvanced && additionalFilters?.property_condition !== undefined) {
      params.set('property_condition', additionalFilters.property_condition);
    }
    
    // Tan Tan Tan - from advanced filters only
    if (usingAdvanced && additionalFilters?.tan_tan_tan !== undefined) {
      params.set('tan_tan_tan', String(additionalFilters.tan_tan_tan));
    }
    
    // Add advanced filters
    if (usingAdvanced && additionalFilters?.price_low_to_high !== undefined) {
      params.set('price_low_to_high', String(additionalFilters.price_low_to_high));
    }
    if (usingAdvanced && additionalFilters?.bedrooms) {
      params.set('bedrooms', String(additionalFilters.bedrooms));
    }
    if (usingAdvanced && additionalFilters?.bathrooms) {
      params.set('bathrooms', String(additionalFilters.bathrooms));
    }
    if (usingAdvanced && additionalFilters?.min_area) {
      params.set('min_area', String(additionalFilters.min_area));
    }
    if (usingAdvanced && additionalFilters?.max_area) {
      params.set('max_area', String(additionalFilters.max_area));
    }
    if (usingAdvanced && additionalFilters?.min_price) {
      params.set('min_price', String(additionalFilters.min_price));
    }
    if (usingAdvanced && additionalFilters?.max_price) {
      params.set('max_price', String(additionalFilters.max_price));
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

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    setTownshipId('all');
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

      {/* Single Row: Search Input, Region, Township, Search Button, Filter Button */}
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

        {/* Region Filter */}
        <div className="md:col-span-2">
          <LocationAutocomplete
            value={regionId}
            onValueChange={handleRegionChange}
            options={regions}
            language={language}
            placeholder={t('search.selectRegion') || 'Select Region'}
            allLabel={t('search.allRegions') || 'All Regions'}
            emptyText={t('search.noResults') || 'No results found'}
            loading={regionsLoading}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        {/* Township Filter */}
        <div className="md:col-span-3">
          <LocationAutocomplete
            value={townshipId}
            onValueChange={setTownshipId}
            options={filteredTownships}
            language={language}
            placeholder={t('search.selectTownship') || 'Select Township'}
            allLabel={t('search.allTownships') || 'All Townships'}
            emptyText={t('search.noResults') || 'No results found'}
            disabled={regionId === 'all'}
            loading={townshipsLoading}
            icon={<MapPin className="h-4 w-4" />}
          />
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

