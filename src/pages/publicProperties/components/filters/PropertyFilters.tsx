/**
 * Property Filters Component
 * 
 * Basic search filters for Property, Premium, Installment, and TanTanTan tabs.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Home, Tag, SlidersHorizontal, RotateCcw } from 'lucide-react';
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
import { AdvancedSearchModal } from './AdvancedSearchModal';
import type { PropertyType } from '@/services/api/propertyTypes';
import type { ListingType } from '@/services/api/listingTypes';

interface PropertyFiltersProps {
  onFilterChange?: (filters: {
    search?: string;
    property_type_id?: number;
    listing_type_id?: number;
  }) => void;
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  
  // Get filter data
  const { data: propertyTypesData } = usePropertyTypes();
  const { data: listingTypesData } = useListingTypes();
  
  const propertyTypes = propertyTypesData?.data || [];
  const listingTypes = listingTypesData?.data || [];

  // Local state for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [propertyTypeId, setPropertyTypeId] = useState<string>(
    searchParams.get('property_type_id') || 'all'
  );
  const [listingTypeId, setListingTypeId] = useState<string>(
    searchParams.get('listing_type_id') || 'all'
  );

  // Sync with URL params
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const propertyTypeParam = searchParams.get('property_type_id') || 'all';
    const listingTypeParam = searchParams.get('listing_type_id') || 'all';
    
    setSearch(searchParam);
    setPropertyTypeId(propertyTypeParam);
    setListingTypeId(listingTypeParam);
  }, [searchParams]);

  // Update URL params when filters change
  const updateFilters = (updates: {
    search?: string;
    property_type_id?: string;
    listing_type_id?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (updates.search !== undefined) {
      if (updates.search) {
        newParams.set('search', updates.search);
      } else {
        newParams.delete('search');
      }
    }
    
    if (updates.property_type_id !== undefined) {
      if (updates.property_type_id && updates.property_type_id !== 'all') {
        newParams.set('property_type_id', updates.property_type_id);
      } else {
        newParams.delete('property_type_id');
      }
    }
    
    if (updates.listing_type_id !== undefined) {
      if (updates.listing_type_id && updates.listing_type_id !== 'all') {
        newParams.set('listing_type_id', updates.listing_type_id);
      } else {
        newParams.delete('listing_type_id');
      }
    }
    
    // Reset to page 1 when filters change
    newParams.delete('page');
    
    setSearchParams(newParams);
    
    // Notify parent component
    if (onFilterChange) {
      onFilterChange({
        search: updates.search !== undefined ? updates.search : search || undefined,
        property_type_id: updates.property_type_id && updates.property_type_id !== 'all' 
          ? Number(updates.property_type_id) 
          : undefined,
        listing_type_id: updates.listing_type_id && updates.listing_type_id !== 'all'
          ? Number(updates.listing_type_id)
          : undefined,
      });
    }
  };

  // Handle advanced filter changes
  const handleAdvancedFilters = (filters: {
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
  }) => {
    const newParams = new URLSearchParams(searchParams);

    // Update advanced filter params
    if (filters.tan_tan_tan !== undefined) {
      newParams.set('tan_tan_tan', String(filters.tan_tan_tan));
    } else {
      newParams.delete('tan_tan_tan');
    }

    if (filters.premium !== undefined) {
      newParams.set('premium', String(filters.premium));
    } else {
      newParams.delete('premium');
    }

    if (filters.installment !== undefined) {
      newParams.set('installment', String(filters.installment));
    } else {
      newParams.delete('installment');
    }

    if (filters.property_type_id) {
      newParams.set('property_type_id', String(filters.property_type_id));
    } else {
      newParams.delete('property_type_id');
    }

    if (filters.listing_type_id) {
      newParams.set('listing_type_id', String(filters.listing_type_id));
    } else {
      newParams.delete('listing_type_id');
    }

    if (filters.price_low_to_high !== undefined) {
      newParams.set('price_low_to_high', String(filters.price_low_to_high));
    } else {
      newParams.delete('price_low_to_high');
    }

    if (filters.property_condition) {
      newParams.set('property_condition', filters.property_condition);
    } else {
      newParams.delete('property_condition');
    }

    if (filters.region_id) {
      newParams.set('region_id', String(filters.region_id));
    } else {
      newParams.delete('region_id');
    }

    if (filters.township_id) {
      newParams.set('township_id', String(filters.township_id));
    } else {
      newParams.delete('township_id');
    }

    if (filters.bedrooms) {
      newParams.set('bedrooms', String(filters.bedrooms));
    } else {
      newParams.delete('bedrooms');
    }

    if (filters.bathrooms) {
      newParams.set('bathrooms', String(filters.bathrooms));
    } else {
      newParams.delete('bathrooms');
    }

    if (filters.min_area) {
      newParams.set('min_area', String(filters.min_area));
    } else {
      newParams.delete('min_area');
    }

    if (filters.max_area) {
      newParams.set('max_area', String(filters.max_area));
    } else {
      newParams.delete('max_area');
    }

    if (filters.min_price) {
      newParams.set('min_price', String(filters.min_price));
    } else {
      newParams.delete('min_price');
    }

    if (filters.max_price) {
      newParams.set('max_price', String(filters.max_price));
    } else {
      newParams.delete('max_price');
    }

    // Reset to page 1 when filters change
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Debounce search input
  useEffect(() => {
    const currentSearchParam = searchParams.get('search') || '';
    
    // Only update if search value is different from URL param
    if (search === currentSearchParam) {
      return;
    }

    const timeoutId = setTimeout(() => {
      updateFilters({ search });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePropertyTypeChange = (value: string) => {
    setPropertyTypeId(value);
    updateFilters({ property_type_id: value });
  };

  const handleListingTypeChange = (value: string) => {
    setListingTypeId(value);
    updateFilters({ listing_type_id: value });
  };

  const getPropertyTypeName = (type: PropertyType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  const getListingTypeName = (type: ListingType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();
    
    // Keep only the type parameter if it exists
    const typeParam = searchParams.get('type');
    if (typeParam) {
      newParams.set('type', typeParam);
    }
    
    setSearchParams(newParams);
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.searchPlaceholder') || 'Search by title, description, owner name...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Property Type Select */}
        <div className="md:col-span-2">
          <Select value={propertyTypeId} onValueChange={handlePropertyTypeChange}>
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
        <div className="md:col-span-2">
          <Select value={listingTypeId} onValueChange={handleListingTypeChange}>
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

        {/* Advanced Search and Reset Buttons */}
        <div className="md:col-span-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 text-sm"
            onClick={() => setIsAdvancedModalOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {t('search.advancedSearch') || 'Advanced Search'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 text-sm"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onApply={handleAdvancedFilters}
      />
    </div>
  );
}

