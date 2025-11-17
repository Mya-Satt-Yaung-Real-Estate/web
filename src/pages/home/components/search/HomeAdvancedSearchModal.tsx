/**
 * Home Advanced Search Modal Component
 * 
 * Modal dialog for advanced property search filters on home page.
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useState, useEffect, useMemo } from 'react';
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
import { useListingTypes } from '@/hooks/queries/useProperties';
import type { PropertyType } from '@/services/api/propertyTypes';
import type { ListingType } from '@/services/api/listingTypes';

interface HomeAdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
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
  }) => void;
  initialFilters?: {
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
  };
}

export function HomeAdvancedSearchModal({
  isOpen,
  onClose,
  onApply,
  initialFilters = {},
}: HomeAdvancedSearchModalProps) {
  const { t, language } = useLanguage();

  // Location data
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const { data: propertyTypesData } = usePropertyTypes();
  const { data: listingTypesData } = useListingTypes();
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];
  const propertyTypes = propertyTypesData?.data || [];
  const listingTypes = listingTypesData?.data || [];

  // Form state
  const [tanTanTan, setTanTanTan] = useState<string>('all');
  const [premium, setPremium] = useState<string>('all');
  const [installment, setInstallment] = useState<string>('all');
  const [propertyCondition, setPropertyCondition] = useState<string>('all');
  const [propertyTypeId, setPropertyTypeId] = useState<string>('all');
  const [listingTypeId, setListingTypeId] = useState<string>('all');
  const [priceLowToHigh, setPriceLowToHigh] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('all');
  const [townshipId, setTownshipId] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');
  const [minArea, setMinArea] = useState<string>('');
  const [maxArea, setMaxArea] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Filter townships by selected region
  const filteredTownships = useMemo(() => {
    if (regionId === 'all') return allTownships;
    return allTownships.filter((t: any) => String(t.region_id) === regionId);
  }, [regionId, allTownships]);

  // Initialize form from initialFilters
  useEffect(() => {
    if (isOpen) {
      setTanTanTan(initialFilters.tan_tan_tan === true ? 'true' : initialFilters.tan_tan_tan === false ? 'false' : 'all');
      setPremium(initialFilters.premium === true ? 'true' : initialFilters.premium === false ? 'false' : 'all');
      setInstallment(initialFilters.installment === true ? 'true' : initialFilters.installment === false ? 'false' : 'all');
      setPropertyCondition(initialFilters.property_condition || 'all');
      setPropertyTypeId(initialFilters.property_type_id ? String(initialFilters.property_type_id) : 'all');
      setListingTypeId(initialFilters.listing_type_id ? String(initialFilters.listing_type_id) : 'all');
      setPriceLowToHigh(initialFilters.price_low_to_high === true ? 'true' : initialFilters.price_low_to_high === false ? 'false' : 'all');
      setRegionId(initialFilters.region_id ? String(initialFilters.region_id) : 'all');
      setTownshipId(initialFilters.township_id ? String(initialFilters.township_id) : 'all');
      setBedrooms(initialFilters.bedrooms ? String(initialFilters.bedrooms) : '');
      setBathrooms(initialFilters.bathrooms ? String(initialFilters.bathrooms) : '');
      setMinArea(initialFilters.min_area ? String(initialFilters.min_area) : '');
      setMaxArea(initialFilters.max_area ? String(initialFilters.max_area) : '');
      setMinPrice(initialFilters.min_price ? String(initialFilters.min_price) : '');
      setMaxPrice(initialFilters.max_price ? String(initialFilters.max_price) : '');
    }
  }, [isOpen, initialFilters]);

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

  const handleApply = () => {
    const filters: any = {};

    if (tanTanTan === 'true') filters.tan_tan_tan = true;
    if (tanTanTan === 'false') filters.tan_tan_tan = false;
    if (premium === 'true') filters.premium = true;
    if (premium === 'false') filters.premium = false;
    if (installment === 'true') filters.installment = true;
    if (installment === 'false') filters.installment = false;
    if (propertyCondition !== 'all') {
      filters.property_condition = propertyCondition as 'ready' | 'some' | 'no';
    }
    if (propertyTypeId !== 'all') filters.property_type_id = Number(propertyTypeId);
    if (listingTypeId !== 'all') filters.listing_type_id = Number(listingTypeId);
    if (priceLowToHigh === 'true') filters.price_low_to_high = true;
    if (priceLowToHigh === 'false') filters.price_low_to_high = false;
    if (regionId !== 'all') filters.region_id = Number(regionId);
    if (townshipId !== 'all') filters.township_id = Number(townshipId);
    if (bedrooms) filters.bedrooms = Number(bedrooms);
    if (bathrooms) filters.bathrooms = Number(bathrooms);
    if (minArea) filters.min_area = Number(minArea);
    if (maxArea) filters.max_area = Number(maxArea);
    if (minPrice) filters.min_price = Number(minPrice);
    if (maxPrice) filters.max_price = Number(maxPrice);

    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setTanTanTan('all');
    setPremium('all');
    setInstallment('all');
    setPropertyCondition('all');
    setPropertyTypeId('all');
    setListingTypeId('all');
    setPriceLowToHigh('all');
    setRegionId('all');
    setTownshipId('all');
    setBedrooms('');
    setBathrooms('');
    setMinArea('');
    setMaxArea('');
    setMinPrice('');
    setMaxPrice('');
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

  const getListingTypeName = (type: ListingType): string => {
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
          {/* First Row: Tan Tan Tan, Premium, Installment, Property Condition */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tan Tan Tan */}
            <div>
              <Label>{t('search.tanTanTan') || 'Tan Tan Tan'}</Label>
              <Select value={tanTanTan} onValueChange={setTanTanTan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
                  <SelectItem value="true">{t('search.yes') || 'Yes'}</SelectItem>
                  <SelectItem value="false">{t('search.no') || 'No'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Premium */}
            <div>
              <Label>{t('search.premium') || 'Premium'}</Label>
              <Select value={premium} onValueChange={setPremium}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
                  <SelectItem value="true">{t('search.yes') || 'Yes'}</SelectItem>
                  <SelectItem value="false">{t('search.no') || 'No'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Installment */}
            <div>
              <Label>{t('listings.installment') || 'Installment'}</Label>
              <Select value={installment} onValueChange={setInstallment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
                  <SelectItem value="true">{t('search.yes') || 'Yes'}</SelectItem>
                  <SelectItem value="false">{t('search.no') || 'No'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Condition */}
            <div>
              <Label>{t('search.propertyCondition') || 'Property Condition'}</Label>
              <Select value={propertyCondition} onValueChange={setPropertyCondition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
                  <SelectItem value="ready">{t('search.ready') || 'Ready'}</SelectItem>
                  <SelectItem value="some">{t('search.some') || 'Some'}</SelectItem>
                  <SelectItem value="no">{t('search.no') || 'No'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row: Property Type, Listing Type, Region, Township */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Property Type */}
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

            {/* Listing Type */}
            <div>
              <Label>{t('search.listingType') || 'Listing Type'}</Label>
              <Select value={listingTypeId} onValueChange={setListingTypeId}>
                <SelectTrigger>
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

            {/* Region */}
            <div>
              <Label>{t('search.region') || 'Region'}</Label>
              <Select value={regionId} onValueChange={(value) => {
                setRegionId(value);
                setTownshipId('all');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search.selectRegion') || 'Select Region'} />
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

            {/* Township */}
            <div>
              <Label>{t('search.township') || 'Township'}</Label>
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
                  {filteredTownships.map((township: any) => (
                    <SelectItem key={township.id} value={String(township.id)}>
                      {getTownshipName(township)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Third Row: Price Sort, Min Price, Max Price */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Price Sort */}
            <div>
              <Label>{t('search.priceSort') || 'Price Sort'}</Label>
              <Select value={priceLowToHigh} onValueChange={setPriceLowToHigh}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.all') || 'All'}</SelectItem>
                  <SelectItem value="true">{t('search.lowToHigh') || 'Low to High'}</SelectItem>
                  <SelectItem value="false">{t('search.highToLow') || 'High to Low'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Price */}
            <div>
              <Label>{t('search.minPrice') || 'Min Price'}</Label>
              <Input
                type="number"
                placeholder={t('search.enterMinPrice') || 'Enter min price'}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            {/* Max Price */}
            <div>
              <Label>{t('search.maxPrice') || 'Max Price'}</Label>
              <Input
                type="number"
                placeholder={t('search.enterMaxPrice') || 'Enter max price'}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Empty column for spacing */}
            <div></div>
          </div>

          {/* Fourth Row: Min Area, Max Area, Bedrooms, Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Min Area */}
            <div>
              <Label>{t('search.minArea') || 'Min Area'}</Label>
              <Input
                type="number"
                placeholder={t('search.enterMinArea') || 'Enter min area'}
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
              />
            </div>

            {/* Max Area */}
            <div>
              <Label>{t('search.maxArea') || 'Max Area'}</Label>
              <Input
                type="number"
                placeholder={t('search.enterMaxArea') || 'Enter max area'}
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
              />
            </div>

            {/* Bedrooms */}
            <div>
              <Label>{t('search.bedrooms') || 'Bedrooms'}</Label>
              <Input
                type="number"
                min="0"
                placeholder={t('search.enterBedrooms') || 'Enter bedrooms'}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>

            {/* Bathrooms */}
            <div>
              <Label>{t('search.bathrooms') || 'Bathrooms'}</Label>
              <Input
                type="number"
                min="0"
                placeholder={t('search.enterBathrooms') || 'Enter bathrooms'}
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
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
            {t('search.search') || 'Search'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

