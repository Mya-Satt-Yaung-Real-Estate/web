import { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, Bath, SlidersHorizontal, X, Square, Car, Calendar, Sparkles } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { Badge } from '../ui/badge';

interface AdvancedSearchFilterProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  keywords: string;
  propertyType: string;
  propertyListing: string;
  propertyCondition: string;
  region: string;
  township: string;
  location: string;
  priceMin: number;
  priceMax: number;
  bedrooms: string;
  bathrooms: string;
  areaMin: number;
  areaMax: number;
  furnished: string;
  parking: string;
  yearBuilt: string;
  amenities: string[];
}

export function AdvancedSearchFilter({ onSearch }: AdvancedSearchFilterProps) {
  const { t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: '',
    propertyType: 'all',
    propertyListing: 'all',
    propertyCondition: 'all',
    region: 'all',
    township: 'all',
    location: '',
    priceMin: 0,
    priceMax: 10000000,
    bedrooms: 'any',
    bathrooms: 'any',
    areaMin: 0,
    areaMax: 10000,
    furnished: 'any',
    parking: 'any',
    yearBuilt: 'any',
    amenities: [],
  });

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(filters);
  };

  // const toggleAmenity = (amenity: string) => {
  //   setFilters(prev => ({
  //     ...prev,
  //     amenities: prev.amenities.includes(amenity)
  //       ? prev.amenities.filter(a => a !== amenity)
  //       : [...prev.amenities, amenity]
  //   }));
  // };

  const clearFilters = () => {
    setFilters({
      keywords: '',
      propertyType: 'all',
      propertyListing: 'all',
      propertyCondition: 'all',
      region: 'all',
      township: 'all',
      location: '',
      priceMin: 0,
      priceMax: 10000000,
      bedrooms: 'any',
      bathrooms: 'any',
      areaMin: 0,
      areaMax: 10000,
      furnished: 'any',
      parking: 'any',
      yearBuilt: 'any',
      amenities: [],
    });
  };

  const hasActiveFilters = 
    filters.keywords !== '' ||
    filters.propertyType !== 'all' ||
    filters.propertyListing !== 'all' ||
    filters.propertyCondition !== 'all' ||
    filters.region !== 'all' ||
    filters.township !== 'all' ||
    filters.location !== '' ||
    filters.bedrooms !== 'any' ||
    filters.bathrooms !== 'any' ||
    filters.furnished !== 'any' ||
    filters.parking !== 'any' ||
    filters.yearBuilt !== 'any' ||
    filters.amenities.length > 0;

  return (
    <Card className="shadow-2xl border-border/50 backdrop-blur-xl bg-background/95 overflow-hidden">
      <CardContent className="p-6">
        {/* Recommended Property Types */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-muted-foreground mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            {t('propertyTypes.recommendedTitle')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
            {[
              { key: 'apartment', label: 'propertyTypes.apartment' },
              { key: 'beachHouse', label: 'propertyTypes.beachHouse' },
              { key: 'commercialBuilding', label: 'propertyTypes.commercialBuilding' },
              { key: 'condo', label: 'propertyTypes.condo' },
              { key: 'duplex', label: 'propertyTypes.duplex' },
              { key: 'factory', label: 'propertyTypes.factory' },
              { key: 'farm', label: 'propertyTypes.farm' },
              { key: 'garden', label: 'propertyTypes.garden' },
              { key: 'guestHouse', label: 'propertyTypes.guestHouse' },
              { key: 'hotel', label: 'propertyTypes.hotel' },
              { key: 'house', label: 'propertyTypes.house' },
              { key: 'land', label: 'propertyTypes.land' },
              { key: 'officeSpace', label: 'propertyTypes.officeSpace' },
              { key: 'penthouse', label: 'propertyTypes.penthouse' },
              { key: 'restaurant', label: 'propertyTypes.restaurant' },
              { key: 'shop', label: 'propertyTypes.shop' },
              { key: 'studio', label: 'propertyTypes.studio' },
              { key: 'townhouse', label: 'propertyTypes.townhouse' },
              { key: 'villa', label: 'propertyTypes.villa' },
              { key: 'warehouse', label: 'propertyTypes.warehouse' },
            ].map((type) => (
              <Button
                key={type.key}
                variant="outline"
                size="sm"
                onClick={() => updateFilter('propertyType', type.key.toLowerCase())}
                className={filters.propertyType === type.key.toLowerCase() ? 'border-primary bg-primary/10' : ''}
              >
                {t(type.label)}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keywords */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder={t('search.keywords')}
              value={filters.keywords}
              onChange={(e) => updateFilter('keywords', e.target.value)}
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Property Type */}
          <div className="md:col-span-3">
            <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50">
                <Home className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder={t('search.propertyType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.allTypes')}</SelectItem>
                <SelectItem value="residential">{t('search.residential')}</SelectItem>
                <SelectItem value="commercial">{t('search.commercial')}</SelectItem>
                <SelectItem value="industrial">{t('search.industrial')}</SelectItem>
                <SelectItem value="land">{t('search.land')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Region/State */}
          <div className="md:col-span-3">
            <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
              <SelectTrigger className="h-12 bg-background/50 border-border/50">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder={t('search.regionState')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('search.all')}</SelectItem>
                <SelectItem value="yangon">{t('search.yangon')}</SelectItem>
                <SelectItem value="mandalay">{t('search.mandalay')}</SelectItem>
                <SelectItem value="naypyidaw">{t('search.naypyidaw')}</SelectItem>
                <SelectItem value="bago">{t('search.bago')}</SelectItem>
                <SelectItem value="ayeyarwady">{t('search.ayeyarwady')}</SelectItem>
                <SelectItem value="shan">{t('search.shan')}</SelectItem>
                <SelectItem value="kachin">{t('search.kachin')}</SelectItem>
                <SelectItem value="kayah">{t('search.kayah')}</SelectItem>
                <SelectItem value="kayin">{t('search.kayin')}</SelectItem>
                <SelectItem value="chin">{t('search.chin')}</SelectItem>
                <SelectItem value="mon">{t('search.mon')}</SelectItem>
                <SelectItem value="rakhine">{t('search.rakhine')}</SelectItem>
                <SelectItem value="sagaing">{t('search.sagaing')}</SelectItem>
                <SelectItem value="tanintharyi">{t('search.tanintharyi')}</SelectItem>
                <SelectItem value="magway">{t('search.magway')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex gap-2">
            <Button
              onClick={handleSearch}
              className="flex-1 h-12 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-12 px-3"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-border/50 space-y-6 animate-fade-in">
            {/* Property Listing Type, Condition, Region, Township */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Property Listing */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Home className="h-4 w-4 text-primary" />
                  {t('search.propertyListing')}
                </label>
                <Select value={filters.propertyListing} onValueChange={(value) => updateFilter('propertyListing', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.all')}</SelectItem>
                    <SelectItem value="sale">{t('search.forSale')}</SelectItem>
                    <SelectItem value="rent">{t('search.forRent')}</SelectItem>
                    <SelectItem value="lease">{t('search.forLease')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Condition */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t('search.propertyCondition')}
                </label>
                <Select value={filters.propertyCondition} onValueChange={(value) => updateFilter('propertyCondition', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.all')}</SelectItem>
                    <SelectItem value="new">{t('search.brandNew')}</SelectItem>
                    <SelectItem value="excellent">{t('search.excellent')}</SelectItem>
                    <SelectItem value="good">{t('search.good')}</SelectItem>
                    <SelectItem value="fair">{t('search.fair')}</SelectItem>
                    <SelectItem value="renovation">{t('search.needsRenovation')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t('search.region')}
                </label>
                <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.all')}</SelectItem>
                    <SelectItem value="yangon">{t('search.yangon')}</SelectItem>
                    <SelectItem value="mandalay">{t('search.mandalay')}</SelectItem>
                    <SelectItem value="naypyidaw">{t('search.naypyidaw')}</SelectItem>
                    <SelectItem value="bago">{t('search.bago')}</SelectItem>
                    <SelectItem value="ayeyarwady">{t('search.ayeyarwady')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Township */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  {t('search.township')}
                </label>
                <Select value={filters.township} onValueChange={(value) => updateFilter('township', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.all')}</SelectItem>
                    <SelectItem value="bahan">{t('search.bahan')}</SelectItem>
                    <SelectItem value="kamayut">{t('search.kamayut')}</SelectItem>
                    <SelectItem value="yankin">{t('search.yankin')}</SelectItem>
                    <SelectItem value="sanchaung">{t('search.sanchaung')}</SelectItem>
                    <SelectItem value="hlaing">{t('search.hlaing')}</SelectItem>
                    <SelectItem value="mayangone">{t('search.mayangone')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" />
                  {t('search.priceRange')}
                </label>
                <span className="text-muted-foreground">
                  ${filters.priceMin.toLocaleString()} - ${filters.priceMax.toLocaleString()}
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => updateFilter('priceMin', Number(e.target.value))}
                  className="bg-background/50 border-border/50"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bedrooms */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Bed className="h-4 w-4 text-primary" />
                  {t('search.bedrooms')}
                </label>
                <Select value={filters.bedrooms} onValueChange={(value) => updateFilter('bedrooms', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('search.any')}</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Bath className="h-4 w-4 text-primary" />
                  {t('search.bathrooms')}
                </label>
                <Select value={filters.bathrooms} onValueChange={(value) => updateFilter('bathrooms', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('search.any')}</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Area Size */}
            <div>
              <label className="flex items-center gap-2 text-muted-foreground mb-3">
                <Square className="h-4 w-4 text-primary" />
                {t('search.areaSize')}
              </label>
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  placeholder={t('search.min')}
                  value={filters.areaMin}
                  onChange={(e) => updateFilter('areaMin', Number(e.target.value))}
                  className="bg-background/50 border-border/50"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder={t('search.max')}
                  value={filters.areaMax}
                  onChange={(e) => updateFilter('areaMax', Number(e.target.value))}
                  className="bg-background/50 border-border/50"
                />
                <span className="text-muted-foreground whitespace-nowrap">{t('listings.sqft')}</span>
              </div>
            </div>

            {/* Furnished, Parking, Year Built */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Furnished */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {t('search.furnished')}
                </label>
                <Select value={filters.furnished} onValueChange={(value) => updateFilter('furnished', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('search.any')}</SelectItem>
                    <SelectItem value="furnished">{t('search.furnished')}</SelectItem>
                    <SelectItem value="unfurnished">{t('search.unfurnished')}</SelectItem>
                    <SelectItem value="semi-furnished">{t('search.semiFurnished')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Parking */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Car className="h-4 w-4 text-primary" />
                  {t('search.parking')}
                </label>
                <Select value={filters.parking} onValueChange={(value) => updateFilter('parking', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('search.any')}</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Built */}
              <div>
                <label className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  {t('search.yearBuilt')}
                </label>
                <Select value={filters.yearBuilt} onValueChange={(value) => updateFilter('yearBuilt', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t('search.any')}</SelectItem>
                    <SelectItem value="2024">2024+</SelectItem>
                    <SelectItem value="2020">2020+</SelectItem>
                    <SelectItem value="2015">2015+</SelectItem>
                    <SelectItem value="2010">2010+</SelectItem>
                    <SelectItem value="2000">2000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {t('search.clearFilters')}
                </Button>
              )}
              <Button
                onClick={handleSearch}
                className="flex-1 gradient-primary shadow-lg shadow-primary/25"
              >
                <Search className="mr-2 h-4 w-4" />
                {t('search.searchProperties')}
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && !showAdvanced && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.propertyType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {filters.propertyType}
                <button onClick={() => updateFilter('propertyType', 'all')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                {filters.location}
                <button onClick={() => updateFilter('location', '')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.bedrooms !== 'any' && (
              <Badge variant="secondary" className="gap-1">
                {filters.bedrooms}+ beds
                <button onClick={() => updateFilter('bedrooms', 'any')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.bathrooms !== 'any' && (
              <Badge variant="secondary" className="gap-1">
                {filters.bathrooms}+ baths
                <button onClick={() => updateFilter('bathrooms', 'any')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
