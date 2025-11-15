/**
 * Event Filters Component
 * 
 * Basic search filters for Event tab (search, date_from, date_to, region, township).
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, RotateCcw } from 'lucide-react';
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

export function EventFilters() {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get location data
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];

  // Local state for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('date_from') || '');
  const [dateTo, setDateTo] = useState(searchParams.get('date_to') || '');
  const [regionId, setRegionId] = useState<string>(
    searchParams.get('region_id') || 'all'
  );
  const [townshipId, setTownshipId] = useState<string>(
    searchParams.get('township_id') || 'all'
  );

  // Filter townships by selected region
  const filteredTownships = useMemo(() => {
    if (regionId === 'all') return allTownships;
    return allTownships.filter((t: any) => String(t.region_id) === regionId);
  }, [regionId, allTownships]);

  // Sync with URL params
  useEffect(() => {
    const searchParam = searchParams.get('search') || '';
    const dateFromParam = searchParams.get('date_from') || '';
    const dateToParam = searchParams.get('date_to') || '';
    const regionParam = searchParams.get('region_id') || 'all';
    const townshipParam = searchParams.get('township_id') || 'all';
    
    setSearch(searchParam);
    setDateFrom(dateFromParam);
    setDateTo(dateToParam);
    setRegionId(regionParam);
    setTownshipId(townshipParam);
  }, [searchParams]);

  // Update URL params when filters change
  const updateFilters = (updates: {
    search?: string;
    date_from?: string;
    date_to?: string;
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
    
    if (updates.date_from !== undefined) {
      if (updates.date_from) {
        newParams.set('date_from', updates.date_from);
      } else {
        newParams.delete('date_from');
      }
    }
    
    if (updates.date_to !== undefined) {
      if (updates.date_to) {
        newParams.set('date_to', updates.date_to);
      } else {
        newParams.delete('date_to');
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

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateFrom(value);
    updateFilters({ date_from: value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateTo(value);
    updateFilters({ date_to: value });
  };

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    setTownshipId('all');
    updateFilters({ region_id: value });
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

        {/* Date From */}
        <div className="md:col-span-2 relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            value={dateFrom}
            onChange={handleDateFromChange}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Date To */}
        <div className="md:col-span-2 relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            value={dateTo}
            onChange={handleDateToChange}
            className="pl-10 h-10 bg-background/50 border-border/50 focus:border-primary/50"
            min={dateFrom || undefined}
          />
        </div>

        {/* Region Select */}
        <div className="md:col-span-2">
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
        <div className="md:col-span-2">
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

