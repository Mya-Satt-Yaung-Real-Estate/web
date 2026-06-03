/**
 * Advertisement Filters Component
 * 
 * Basic search filters for Advertisement tab (search, region, township).
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, RotateCcw } from 'lucide-react';
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
import { useRegions, useTownships } from '@/hooks/queries/useLocations';

export function AdvertisementFilters() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get location data
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];

  // Local state for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [regionId, setRegionId] = useState<string>(
    searchParams.get('region_id') || 'all'
  );
  const [townshipId, setTownshipId] = useState<string>(
    searchParams.get('township_id') || 'all'
  );
  const [advertisementType, setAdvertisementType] = useState<string>(
    searchParams.get('advertisement_type') || 'all'
  );

  // Filter townships by selected region
  const filteredTownships = useMemo(() => {
    if (regionId === 'all') return allTownships;
    return allTownships.filter((t: any) => String(t.region_id) === regionId);
  }, [regionId, allTownships]);

  // Sync with URL params
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const regionParam = searchParams.get('region_id') || 'all';
    const townshipParam = searchParams.get('township_id') || 'all';
    const advertisementTypeParam = searchParams.get('advertisement_type') || 'all';
    
    setSearch(searchParam);
    setRegionId(regionParam);
    setTownshipId(townshipParam);
    setAdvertisementType(advertisementTypeParam);
  }, [searchParams]);

  // Update URL params when filters change
  const updateFilters = (updates: {
    search?: string;
    advertisement_type?: string;
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

    if (updates.advertisement_type !== undefined) {
      if (updates.advertisement_type && updates.advertisement_type !== 'all') {
        newParams.set('advertisement_type', updates.advertisement_type);
      } else {
        newParams.delete('advertisement_type');
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

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    setTownshipId('all');
    updateFilters({ region_id: value, township_id: 'all' });
  };

  const handleAdvertisementTypeChange = (value: string) => {
    setAdvertisementType(value);
    updateFilters({ advertisement_type: value });
  };

  const handleTownshipChange = (value: string) => {
    setTownshipId(value);
    updateFilters({ township_id: value });
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

  const getRegionName = (region: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? region.name_mm : region.name_en;
  };

  const getTownshipName = (township: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? township.name_mm : township.name_en;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.searchPlaceholder') || 'Search by title, description, owner name...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Advertisement Type Select */}
        <div className="md:col-span-2">
          <Select value={advertisementType} onValueChange={handleAdvertisementTypeChange}>
            <SelectTrigger className="h-10 bg-background/50 border-border/50">
              <SelectValue placeholder={t('advertisements.type') || 'Type'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('advertisements.allTypes') || 'All Types'}</SelectItem>
              <SelectItem value="for_sale">{t('advertisements.forSale') || 'For Sale'}</SelectItem>
              <SelectItem value="for_rent">{t('advertisements.forRent') || 'For Rent'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Region Select */}
        <div className="md:col-span-3">
          <Select value={regionId} onValueChange={handleRegionChange}>
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

        {/* Township Select */}
        <div className="md:col-span-3">
          <Select
            value={townshipId}
            onValueChange={handleTownshipChange}
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

        {/* Reset Button */}
        <div className="md:col-span-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-10 text-sm"
            onClick={handleResetFilters}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('search.reset') || 'Reset'}
          </Button>
        </div>
      </div>
    </div>
  );
}

