/**
 * Property Filters Component
 *
 * Basic search filters for Property, Premium, Installment, and TanTanTan tabs.
 */

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LocationAutocomplete } from '@/components/ui/LocationAutocomplete';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { AdvancedSearchModal } from './AdvancedSearchModal';

interface PropertyFiltersProps {
  onFilterChange?: (filters: {
    search?: string;
    region_id?: number;
    township_id?: number;
  }) => void;
}

export function PropertyFilters({ onFilterChange }: PropertyFiltersProps) {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  const { data: regionsResp, isLoading: regionsLoading } = useRegions();
  const { data: townshipsResp, isLoading: townshipsLoading } = useTownships();

  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [regionId, setRegionId] = useState<string>(searchParams.get('region_id') || 'all');
  const [townshipId, setTownshipId] = useState<string>(searchParams.get('township_id') || 'all');

  const filteredTownships = useMemo(() => {
    if (regionId === 'all') {
      return [];
    }

    return allTownships.filter((township: { region_id: number }) => String(township.region_id) === regionId);
  }, [regionId, allTownships]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setRegionId(searchParams.get('region_id') || 'all');
    setTownshipId(searchParams.get('township_id') || 'all');
  }, [searchParams]);

  const updateFilters = (updates: {
    search?: string;
    region_id?: string;
    township_id?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.search !== undefined) {
      if (updates.search) {
        newParams.set('search', updates.search);
      } else {
        newParams.delete('search');
      }
    }

    if (updates.region_id !== undefined) {
      if (updates.region_id && updates.region_id !== 'all') {
        newParams.set('region_id', updates.region_id);
      } else {
        newParams.delete('region_id');
      }
    }

    if (updates.township_id !== undefined) {
      if (updates.township_id && updates.township_id !== 'all') {
        newParams.set('township_id', updates.township_id);
      } else {
        newParams.delete('township_id');
      }
    }

    newParams.delete('page');
    setSearchParams(newParams);

    if (onFilterChange) {
      onFilterChange({
        search: updates.search !== undefined ? updates.search : search || undefined,
        region_id:
          updates.region_id && updates.region_id !== 'all'
            ? Number(updates.region_id)
            : undefined,
        township_id:
          updates.township_id && updates.township_id !== 'all'
            ? Number(updates.township_id)
            : undefined,
      });
    }
  };

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

    newParams.delete('page');
    setSearchParams(newParams);
  };

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

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    setTownshipId('all');
    updateFilters({ region_id: value, township_id: 'all' });
  };

  const handleTownshipChange = (value: string) => {
    setTownshipId(value);
    updateFilters({ township_id: value });
  };

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();

    const typeParam = searchParams.get('type');
    if (typeParam) {
      newParams.set('type', typeParam);
    }

    setSearchParams(newParams);
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.searchPlaceholder') || 'Search by title, description, owner name...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

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

        <div className="md:col-span-3">
          <LocationAutocomplete
            value={townshipId}
            onValueChange={handleTownshipChange}
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
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('search.reset') || 'Reset'}
          </Button>
        </div>
      </div>

      <AdvancedSearchModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
        onApply={handleAdvancedFilters}
      />
    </div>
  );
}
