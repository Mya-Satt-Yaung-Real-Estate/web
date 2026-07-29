/**
 * Advanced Share Profit Search Modal
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import type { PropertyType } from '@/services/api/propertyTypes';
import type { ShareProfitWantedType } from '@/types/shareProfitListing';
import { DollarSign, Ruler } from 'lucide-react';
import { SHARE_PROFIT_WANTED_TYPES, getShareProfitWantedTypeLabel } from './shareProfitWantedTypeOptions';

interface AdvancedShareProfitSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    property_type_id?: number;
    wanted_type?: ShareProfitWantedType;
    prefer_region_id?: number;
    prefer_township_id?: number;
    min_budget?: number;
    max_budget?: number;
    min_area?: number;
    max_area?: number;
  }) => void;
}

export function AdvancedShareProfitSearchModal({
  isOpen,
  onClose,
  onApply,
}: AdvancedShareProfitSearchModalProps) {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const { data: propertyTypesData } = usePropertyTypes();
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const [propertyTypeId, setPropertyTypeId] = useState<string>('all');
  const [wantedType, setWantedType] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('all');
  const [townshipId, setTownshipId] = useState<string>('all');
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');

  const filteredTownships = useMemo(() => {
    if (regionId === 'all') return allTownships;
    return allTownships.filter((township) => String(township.region_id) === regionId);
  }, [regionId, allTownships]);

  useEffect(() => {
    if (isOpen) {
      setPropertyTypeId(searchParams.get('property_type_id') || 'all');
      setWantedType(searchParams.get('wanted_type') || 'all');
      setRegionId(searchParams.get('prefer_region_id') || 'all');
      setTownshipId(searchParams.get('prefer_township_id') || 'all');
      setMinBudget(searchParams.get('min_budget') || '');
      setMaxBudget(searchParams.get('max_budget') || '');
      setMinArea(searchParams.get('min_area') || '');
      setMaxArea(searchParams.get('max_area') || '');
    }
  }, [isOpen, searchParams]);

  useEffect(() => {
    if (regionId === 'all') {
      setTownshipId('all');
    } else {
      const township = filteredTownships.find((item) => String(item.id) === townshipId);
      if (!township) {
        setTownshipId('all');
      }
    }
  }, [regionId, filteredTownships, townshipId]);

  const handleApply = () => {
    const filters: {
      property_type_id?: number;
      wanted_type?: ShareProfitWantedType;
      prefer_region_id?: number;
      prefer_township_id?: number;
      min_budget?: number;
      max_budget?: number;
      min_area?: number;
      max_area?: number;
    } = {};

    if (propertyTypeId !== 'all') filters.property_type_id = Number(propertyTypeId);
    if (wantedType !== 'all') filters.wanted_type = wantedType as ShareProfitWantedType;
    if (regionId !== 'all') filters.prefer_region_id = Number(regionId);
    if (townshipId !== 'all') filters.prefer_township_id = Number(townshipId);
    if (minBudget) filters.min_budget = Number(minBudget);
    if (maxBudget) filters.max_budget = Number(maxBudget);
    if (minArea) filters.min_area = Number(minArea);
    if (maxArea) filters.max_area = Number(maxArea);

    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setPropertyTypeId('all');
    setWantedType('all');
    setRegionId('all');
    setTownshipId('all');
    setMinBudget('');
    setMaxBudget('');
    setMinArea('');
    setMaxArea('');
  };

  const getRegionName = (region: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? region.name_mm : region.name_en;
  };

  const getTownshipName = (township: { name_en: string; name_mm: string }) => {
    return language === 'mm' ? township.name_mm : township.name_en;
  };

  const getPropertyTypeName = (type: PropertyType): string => {
    return language === 'mm' ? type.name_mm : type.name_en;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="2xl" className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('search.advancedSearch') || 'Advanced Search'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t('search.propertyType') || 'Property Type'}</Label>
              <Select value={propertyTypeId} onValueChange={setPropertyTypeId}>
                <SelectTrigger>
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

            <div>
              <Label>{t('search.wantedType') || 'Wanted Type'}</Label>
              <Select value={wantedType} onValueChange={setWantedType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search.wantedType') || 'Wanted Type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
                  {SHARE_PROFIT_WANTED_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getShareProfitWantedTypeLabel(type, t, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('search.region') || 'Preferred Region'}</Label>
              <Select value={regionId} onValueChange={(value) => {
                setRegionId(value);
                setTownshipId('all');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search.selectRegion') || 'Select Region'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.allRegions') || 'All Regions'}</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={String(region.id)}>
                      {getRegionName(region)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('search.township') || 'Preferred Township'}</Label>
              <Select
                value={townshipId}
                onValueChange={setTownshipId}
                disabled={regionId === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('search.selectTownship') || 'Select Township'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.allTownships') || 'All Townships'}</SelectItem>
                  {filteredTownships.map((township) => (
                    <SelectItem key={township.id} value={String(township.id)}>
                      {getTownshipName(township)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">{t('search.budgetRange') || 'Budget Range'}</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={t('search.minBudget') || 'Min Budget'}
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t('search.maxBudget') || 'Max Budget'}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">{t('search.areaRange') || 'Area Range (sqft)'}</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={t('search.minArea') || 'Min Area'}
                  value={minArea}
                  onChange={(e) => setMinArea(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t('search.maxArea') || 'Max Area'}
                  value={maxArea}
                  onChange={(e) => setMaxArea(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            {t('search.reset') || 'Reset'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleApply}>
            {t('search.apply') || 'Apply Filters'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
