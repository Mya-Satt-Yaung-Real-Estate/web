import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalculatorIcon, MapPin, Building2, Home, DollarSign, TrendingUp, Info, Loader2 } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { useRegions, useTownships, useWards, useRoads } from '@/hooks/queries/useLocations';
import type { Region, Township, Ward, Road } from '@/services/api/locations';

export function YarPyatCalculator() {
  const { t, language } = useLanguage();
  
  // Location selections
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedRoad, setSelectedRoad] = useState<string>('');
  
  // Land dimensions
  const [landArea, setLandArea] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  
  // Calculated values
  const [ratePerSqft, setRatePerSqft] = useState<number>(0);
  const [assessedValue, setAssessedValue] = useState<number>(0);
  const [sellingTax, setSellingTax] = useState<number>(0);
  const [buyingTax, setBuyingTax] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Validation states
  const [errors, setErrors] = useState<{
    region?: string;
    city?: string;
    ward?: string;
    road?: string;
    landArea?: string;
    length?: string;
    width?: string;
  }>({});

  // API data
  const { data: regionsData, isLoading: regionsLoading, error: regionsError } = useRegions();
  const { data: townshipsData, isLoading: townshipsLoading, error: townshipsError } = useTownships();
  const { data: wardsData, isLoading: wardsLoading, error: wardsError } = useWards(
    selectedCity ? parseInt(selectedCity) : null
  );
  const { data: roadsData, isLoading: roadsLoading, error: roadsError } = useRoads(
    selectedWard ? parseInt(selectedWard) : null
  );

  // Filter townships based on selected region
  const filteredTownships = townshipsData?.data?.filter(
    (township: Township) => township.region_id === parseInt(selectedRegion)
  ) || [];

  // Reset dependent selections when parent selection changes
  useEffect(() => {
    if (selectedRegion) {
      setSelectedCity('');
      setSelectedWard('');
      setSelectedRoad('');
      setRatePerSqft(0);
      setShowResults(false);
      // Clear errors for dependent fields
      setErrors(prev => ({ ...prev, city: undefined, ward: undefined, road: undefined }));
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedCity) {
      setSelectedWard('');
      setSelectedRoad('');
      setRatePerSqft(0);
      setShowResults(false);
      // Clear errors for dependent fields
      setErrors(prev => ({ ...prev, ward: undefined, road: undefined }));
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedWard) {
      setSelectedRoad('');
      setRatePerSqft(0);
      setShowResults(false);
      // Clear error for dependent field
      setErrors(prev => ({ ...prev, road: undefined }));
    }
  }, [selectedWard]);

  // Update rate when road is selected
  useEffect(() => {
    if (selectedRoad && roadsData?.data) {
      const road = roadsData.data.find((road: Road) => road.id === parseInt(selectedRoad));
      if (road) {
        setRatePerSqft(parseFloat(road.price));
      }
    }
  }, [selectedRoad, roadsData]);

  // Auto-calculate land area when length and width are entered
  useEffect(() => {
    if (length && width && parseFloat(length) > 0 && parseFloat(width) > 0) {
      const calculatedArea = parseFloat(length) * parseFloat(width);
      setLandArea(calculatedArea.toString());
      // Clear land area error if it exists
      if (errors.landArea) {
        setErrors(prev => ({ ...prev, landArea: undefined }));
      }
    }
  }, [length, width, errors.landArea]);

  // Handlers to clear individual field errors
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    if (errors.region) {
      setErrors(prev => ({ ...prev, region: undefined }));
    }
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
    if (errors.ward) {
      setErrors(prev => ({ ...prev, ward: undefined }));
    }
  };

  const handleRoadChange = (value: string) => {
    setSelectedRoad(value);
    if (errors.road) {
      setErrors(prev => ({ ...prev, road: undefined }));
    }
  };

  const handleLandAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLandArea(e.target.value);
    if (errors.landArea) {
      setErrors(prev => ({ ...prev, landArea: undefined }));
    }
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLength(e.target.value);
    if (errors.length) {
      setErrors(prev => ({ ...prev, length: undefined }));
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(e.target.value);
    if (errors.width) {
      setErrors(prev => ({ ...prev, width: undefined }));
    }
  };
  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!selectedRegion) {
      newErrors.region = t('calculator.yarPyat.selectRegion');
    }
    if (!selectedCity) {
      newErrors.city = t('calculator.yarPyat.selectTownship');
    }
    if (!selectedWard) {
      newErrors.ward = t('calculator.yarPyat.selectWard');
    }
    if (!selectedRoad) {
      newErrors.road = t('calculator.yarPyat.selectRoad');
    }
    
    // Check if user has both length and width (land area is auto-calculated)
    const hasLength = length && parseFloat(length) > 0;
    const hasWidth = width && parseFloat(width) > 0;
    
    if (!hasLength || !hasWidth) {
      newErrors.landArea = t('calculator.yarPyat.enterLengthAndWidth');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateForm()) {
      return;
    }

    const area = parseFloat(landArea);
    const assessed = area * ratePerSqft;
    const selling = assessed * 0.10; // 10% selling tax
    const buying = assessed * 0.075; // 7.5% buying tax

    setAssessedValue(assessed);
    setSellingTax(selling);
    setBuyingTax(buying);
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedRegion('');
    setSelectedCity('');
    setSelectedWard('');
    setSelectedRoad('');
    setLandArea('');
    setLength('');
    setWidth('');
    setRatePerSqft(0);
    setAssessedValue(0);
    setSellingTax(0);
    setBuyingTax(0);
    setShowResults(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
      <SEOHead
        seo={{
          title: t('calculators.yarPyatTaxCalculator'),
          description: t('calculator.description'),
          keywords: t('calculator.keywords')
        }}
        path="/yarpyat-taxes-calculator"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg">
              <CalculatorIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent text-center">
            {t('calculator.yarPyat.title')}
          </h1>
          <p className="text-muted-foreground mt-2 text-center">
            {t('calculator.yarPyat.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Selection Card */}
            <Card className="glass border-border/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('calculator.yarPyat.locationSelection')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.yarPyat.locationDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Region */}
                <div className="space-y-2">
                  <Label htmlFor="region">
                    {t('calculator.yarPyat.region')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedRegion} onValueChange={handleRegionChange}>
                    <SelectTrigger id="region" className={errors.region ? "border-red-500" : ""}>
                      <SelectValue placeholder={t('calculator.yarPyat.selectRegion')} />
                    </SelectTrigger>
                     <SelectContent>
                       {regionsLoading ? (
                         <SelectItem value="loading" disabled>
                           <div className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             {t('common.loading')}
                           </div>
                         </SelectItem>
                       ) : regionsError ? (
                         <SelectItem value="error" disabled>
                           {t('common.error')}
                         </SelectItem>
                       ) : (
                         regionsData?.data?.map((region: Region) => (
                           <SelectItem key={region.id} value={region.id.toString()}>
                             {language === 'mm' ? region.name_mm : region.name_en}
                           </SelectItem>
                         ))
                       )}
                     </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-red-500">{errors.region}</p>
                  )}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">
                    {t('calculator.yarPyat.city')} <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={handleCityChange}
                    disabled={!selectedRegion}
                  >
                    <SelectTrigger id="city" className={errors.city ? "border-red-500" : ""}>
                      <SelectValue placeholder={t('calculator.yarPyat.selectTownship')} />
                    </SelectTrigger>
                     <SelectContent>
                       {townshipsLoading ? (
                         <SelectItem value="loading" disabled>
                           <div className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             {t('common.loading')}
                           </div>
                         </SelectItem>
                       ) : townshipsError ? (
                         <SelectItem value="error" disabled>
                           {t('common.error')}
                         </SelectItem>
                       ) : (
                         filteredTownships.map((township: Township) => (
                           <SelectItem key={township.id} value={township.id.toString()}>
                             {language === 'mm' ? township.name_mm : township.name_en}
                           </SelectItem>
                         ))
                       )}
                     </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                {/* Ward */}
                <div className="space-y-2">
                  <Label htmlFor="ward">
                    {t('calculator.yarPyat.ward')} <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={selectedWard} 
                    onValueChange={handleWardChange}
                    disabled={!selectedCity}
                  >
                    <SelectTrigger id="ward" className={errors.ward ? "border-red-500" : ""}>
                      <SelectValue placeholder={t('calculator.yarPyat.selectWard')} />
                    </SelectTrigger>
                     <SelectContent>
                       {wardsLoading ? (
                         <SelectItem value="loading" disabled>
                           <div className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             {t('common.loading')}
                           </div>
                         </SelectItem>
                       ) : wardsError ? (
                         <SelectItem value="error" disabled>
                           {t('common.error')}
                         </SelectItem>
                       ) : (
                         wardsData?.data?.map((ward: Ward) => (
                           <SelectItem key={ward.id} value={ward.id.toString()}>
                             {language === 'mm' ? ward.ward_name_mm : ward.ward_name_en}
                           </SelectItem>
                         ))
                       )}
                     </SelectContent>
                  </Select>
                  {errors.ward && (
                    <p className="text-sm text-red-500">{errors.ward}</p>
                  )}
                </div>

                {/* Road */}
                <div className="space-y-2">
                  <Label htmlFor="road">
                    {t('calculator.yarPyat.road')} <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={selectedRoad} 
                    onValueChange={handleRoadChange}
                    disabled={!selectedWard}
                  >
                    <SelectTrigger id="road" className={errors.road ? "border-red-500" : ""}>
                      <SelectValue placeholder={t('calculator.yarPyat.selectRoad')} />
                    </SelectTrigger>
                     <SelectContent>
                       {roadsLoading ? (
                         <SelectItem value="loading" disabled>
                           <div className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             {t('common.loading')}
                           </div>
                         </SelectItem>
                       ) : roadsError ? (
                         <SelectItem value="error" disabled>
                           {t('common.error')}
                         </SelectItem>
                       ) : (
                         roadsData?.data?.map((road: Road) => (
                           <SelectItem key={road.id} value={road.id.toString()}>
                             <div className="flex items-center justify-between w-full">
                               <span>{language === 'mm' ? road.name_mm : road.name_en}</span>
                               <Badge variant="secondary" className="ml-2">
                                 {parseFloat(road.price).toLocaleString()} MMK
                               </Badge>
                             </div>
                           </SelectItem>
                         ))
                       )}
                     </SelectContent>
                  </Select>
                  {errors.road && (
                    <p className="text-sm text-red-500">{errors.road}</p>
                  )}
                </div>

                {/* Current Rate Display */}
                {ratePerSqft > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{t('calculator.yarPyat.ratePerSqft')}</span>
                      </div>
                      <Badge className="gradient-primary text-white">
                        {ratePerSqft.toLocaleString()} MMK
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Land Area Card */}
            <Card className="glass border-border/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-primary" />
                  {t('calculator.yarPyat.landArea')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.yarPyat.landAreaDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Length, Width, and Land Area Fields in One Row */}
                <div className="space-y-2">
                  {/* Labels Row */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-[120px]">
                      <Label htmlFor="length">
                        {t('calculator.yarPyat.length')}
                      </Label>
                    </div>
                    <div className="w-6"></div>
                    <div className="flex-1 max-w-[120px]">
                      <Label htmlFor="width">
                        {t('calculator.yarPyat.width')}
                      </Label>
                    </div>
                    <div className="w-6"></div>
                    <div className="flex-1">
                      <Label htmlFor="landArea">
                        {t('calculator.yarPyat.landAreaSqft')} <span className="text-red-500">*</span>
                      </Label>
                    </div>
                  </div>

                  {/* Input Fields Row */}
                  <div className="flex items-center gap-4">
                    {/* Length Field */}
                    <div className="flex-1 max-w-[120px]">
                      <Input
                        id="length"
                        type="number"
                        placeholder="e.g., 40"
                        value={length}
                        onChange={handleLengthChange}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Multiplication Sign */}
                    <div className="flex items-center justify-center w-6">
                      <span className="text-lg font-semibold text-muted-foreground">×</span>
                    </div>

                    {/* Width Field */}
                    <div className="flex-1 max-w-[120px]">
                      <Input
                        id="width"
                        type="number"
                        placeholder="e.g., 60"
                        value={width}
                        onChange={handleWidthChange}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Equals Sign */}
                    <div className="flex items-center justify-center w-6">
                      <span className="text-lg font-semibold text-muted-foreground">=</span>
                    </div>

                    {/* Land Area Field */}
                    <div className="flex-1">
                      <Input
                        id="landArea"
                        type="number"
                        placeholder={t('calculator.yarPyat.landAreaExample')}
                        value={landArea}
                        onChange={handleLandAreaChange}
                        min="0"
                        step="0.01"
                        className={`${errors.landArea ? "border-red-500" : ""} bg-gray-50 cursor-not-allowed`}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Helper Text Row */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1 max-w-[120px]">
                      <p className="text-xs text-muted-foreground">
                        {t('calculator.yarPyat.length')}
                      </p>
                    </div>
                    <div className="w-6"></div>
                    <div className="flex-1 max-w-[120px]">
                      <p className="text-xs text-muted-foreground">
                        {t('calculator.yarPyat.width')}
                      </p>
                    </div>
                    <div className="w-6"></div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {t('calculator.yarPyat.autoCalculated')}
                      </p>
                      {errors.landArea && (
                        <p className="text-sm text-red-500 mt-1">{errors.landArea}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border my-4"></div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    onClick={handleCalculate}
                    className="flex-1 gradient-primary text-white"
                  >
                    <CalculatorIcon className="h-4 w-4 mr-2" />
                    {t('calculator.yarPyat.calculateTax')}
                  </Button>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('calculator.reset')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="glass border-border/50 sticky top-24 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('calculator.yarPyat.taxResults')}
                </CardTitle>
                <CardDescription>
                  {t('calculator.yarPyat.taxResults')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="text-center py-8">
                    <CalculatorIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {t('calculator.yarPyat.fillFormMessage')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Location Summary */}
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                         <div className="space-y-1">
                           <p className="text-muted-foreground">{t('calculator.yarPyat.location')}</p>
                           <p>{language === 'mm' ? roadsData?.data?.find((road: Road) => road.id === parseInt(selectedRoad))?.name_mm : roadsData?.data?.find((road: Road) => road.id === parseInt(selectedRoad))?.name_en}, {language === 'mm' ? wardsData?.data?.find((ward: Ward) => ward.id === parseInt(selectedWard))?.ward_name_mm : wardsData?.data?.find((ward: Ward) => ward.id === parseInt(selectedWard))?.ward_name_en}</p>
                           <p>{language === 'mm' ? filteredTownships.find((township: Township) => township.id === parseInt(selectedCity))?.name_mm : filteredTownships.find((township: Township) => township.id === parseInt(selectedCity))?.name_en}, {language === 'mm' ? regionsData?.data?.find((region: Region) => region.id === parseInt(selectedRegion))?.name_mm : regionsData?.data?.find((region: Region) => region.id === parseInt(selectedRegion))?.name_en}</p>
                         </div>
                      </div>
                    </div>

                    <div className="border-t border-border my-4"></div>

                    {/* Assessed Value */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Land Area:</span>
                        <span>{parseFloat(landArea).toLocaleString()} Sqft</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t('calculator.yarPyat.ratePerSqft')}:</span>
                        <span>{ratePerSqft.toLocaleString()} MMK</span>
                      </div>
                    </div>

                    <div className="border-t border-border my-4"></div>

                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{t('calculator.yarPyat.assessedValue')}</span>
                      </div>
                      <p className="text-primary">
                        {assessedValue.toLocaleString()} MMK
                      </p>
                    </div>

                    <div className="border-t border-border my-4"></div>

                    {/* Taxes */}
                    <div className="space-y-3">
                      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-muted-foreground">{t('calculator.yarPyat.sellingTax')}</span>
                        </div>
                        <p className="text-green-600">
                          {sellingTax.toLocaleString()} MMK
                        </p>
                      </div>

                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-muted-foreground">{t('calculator.yarPyat.buyingTax')}</span>
                        </div>
                        <p className="text-blue-600">
                          {buyingTax.toLocaleString()} MMK
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-border my-4"></div>

                    {/* Info Note */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                          {t('calculator.yarPyat.infoNote')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}