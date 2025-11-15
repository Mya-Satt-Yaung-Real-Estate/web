/**
 * Property Filters Component
 * 
 * Basic search filters for Property, Premium, Installment, and TanTanTan tabs.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Home, Tag } from 'lucide-react';
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

        {/* Advanced Search Button */}
        <div className="md:col-span-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 text-sm"
            onClick={() => {
              // TODO: Implement advanced search dropdown
              console.log('Advanced search clicked');
            }}
          >
            {t('search.advancedSearch') || 'Advanced Search'}
          </Button>
        </div>
      </div>
    </div>
  );
}

