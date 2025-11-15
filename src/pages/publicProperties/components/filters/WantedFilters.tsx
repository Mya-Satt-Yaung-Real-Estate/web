/**
 * Wanted Filters Component
 * 
 * Basic search filters for Wanted List tab.
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Home, User, SlidersHorizontal, RotateCcw } from 'lucide-react';
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
import { AdvancedWantedSearchModal } from './AdvancedWantedSearchModal';
import type { PropertyType } from '@/services/api/propertyTypes';

export function WantedFilters() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
  
  // Get filter data
  const { data: propertyTypesData } = usePropertyTypes();
  const propertyTypes = propertyTypesData?.data || [];

  // Local state for basic filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [propertyTypeId, setPropertyTypeId] = useState<string>(
    searchParams.get('property_type_id') || 'all'
  );
  const [wantedType, setWantedType] = useState<string>(
    searchParams.get('wanted_type') || 'all'
  );

  // Sync with URL params
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const propertyTypeParam = searchParams.get('property_type_id') || 'all';
    const wantedTypeParam = searchParams.get('wanted_type') || 'all';
    
    setSearch(searchParam);
    setPropertyTypeId(propertyTypeParam);
    setWantedType(wantedTypeParam);
  }, [searchParams]);

  // Update URL params when filters change
  const updateFilters = (updates: {
    search?: string;
    property_type_id?: string;
    wanted_type?: string;
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
    
    if (updates.wanted_type !== undefined) {
      if (updates.wanted_type && updates.wanted_type !== 'all') {
        newParams.set('wanted_type', updates.wanted_type);
      } else {
        newParams.delete('wanted_type');
      }
    }
    
    // Reset to page 1 when filters change
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Handle advanced filter changes
  const handleAdvancedFilters = (filters: {
    property_type_id?: number;
    wanted_type?: 'buyer' | 'renter';
    prefer_region_id?: number;
    prefer_township_id?: number;
    min_budget?: number;
    max_budget?: number;
    min_area?: number;
    max_area?: number;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (filters.property_type_id) {
      newParams.set('property_type_id', String(filters.property_type_id));
    } else {
      newParams.delete('property_type_id');
    }

    if (filters.wanted_type) {
      newParams.set('wanted_type', filters.wanted_type);
    } else {
      newParams.delete('wanted_type');
    }

    if (filters.prefer_region_id) {
      newParams.set('prefer_region_id', String(filters.prefer_region_id));
    } else {
      newParams.delete('prefer_region_id');
    }

    if (filters.prefer_township_id) {
      newParams.set('prefer_township_id', String(filters.prefer_township_id));
    } else {
      newParams.delete('prefer_township_id');
    }

    if (filters.min_budget) {
      newParams.set('min_budget', String(filters.min_budget));
    } else {
      newParams.delete('min_budget');
    }

    if (filters.max_budget) {
      newParams.set('max_budget', String(filters.max_budget));
    } else {
      newParams.delete('max_budget');
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

    // Reset to page 1 when filters change
    newParams.delete('page');
    setSearchParams(newParams);
  };

  // Debounce search input
  useEffect(() => {
    const currentSearchParam = searchParams.get('search') || '';
    
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

  const handleWantedTypeChange = (value: string) => {
    setWantedType(value);
    updateFilters({ wanted_type: value });
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

  const getPropertyTypeName = (type: PropertyType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.searchPlaceholder') || 'Search by title, description...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Property Type Select */}
        <div className="md:col-span-3">
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

        {/* Wanted Type Select */}
        <div className="md:col-span-2">
          <Select value={wantedType} onValueChange={handleWantedTypeChange}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <User className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder={t('search.wantedType') || 'Wanted Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
              <SelectItem value="buyer">{t('search.buyer') || 'Buyer'}</SelectItem>
              <SelectItem value="renter">{t('search.renter') || 'Renter'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Search and Reset Buttons */}
        <div className="md:col-span-2 flex gap-2">
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
            title={t('search.reset') || 'Reset Filters'}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedWantedSearchModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onApply={handleAdvancedFilters}
      />
    </div>
  );
}

