import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalculatorIcon, MapPin, Building2, Home, DollarSign, TrendingUp, Info } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

// Location data with tax rates per square foot
const locationData = {
  'Yangon': {
    cities: {
      'Yangon City': {
        wards: {
          'Kamayut': {
            roads: {
              'Pyay Road': 150000,
              'Inya Road': 180000,
              'U Wisara Road': 120000,
            }
          },
          'Bahan': {
            roads: {
              'Shwe Gon Daing Road': 200000,
              'Than Lwin Road': 170000,
              'Aye Yeik Thar Road': 160000,
            }
          },
          'Hlaing': {
            roads: {
              'Hlaing River Road': 140000,
              'Parami Road': 130000,
              'Kaba Aye Pagoda Road': 125000,
            }
          },
          'Yankin': {
            roads: {
              'Yankin Road': 110000,
              'Myay Ni Gone Road': 105000,
              'Thanlyin Road': 100000,
            }
          }
        }
      },
      'Yangon North': {
        wards: {
          'Insein': {
            roads: {
              'Insein Road': 80000,
              'Pyay Road': 85000,
              'Mingaladon Road': 75000,
            }
          },
          'Shwe Pyi Thar': {
            roads: {
              'Main Road': 60000,
              'Industrial Road': 55000,
              'Airport Road': 70000,
            }
          }
        }
      }
    }
  },
  'Mandalay': {
    cities: {
      'Mandalay City': {
        wards: {
          'Chan Aye Thar Zan': {
            roads: {
              '84th Street': 90000,
              '80th Street': 95000,
              '73rd Street': 85000,
            }
          },
          'Aung Myay Thar Zan': {
            roads: {
              '27th Street': 100000,
              '35th Street': 105000,
              '26th Street': 98000,
            }
          },
          'Maha Aung Myay': {
            roads: {
              'Mandalay-Lashio Road': 75000,
              'Mandalay-Myitkyina Road': 70000,
              'Strand Road': 80000,
            }
          }
        }
      }
    }
  },
  'Nay Pyi Taw': {
    cities: {
      'Zeyar Thiri': {
        wards: {
          'Hotel Zone': {
            roads: {
              'Main Boulevard': 120000,
              'Hotel Zone Road 1': 110000,
              'Hotel Zone Road 2': 115000,
            }
          },
          'Diplomatic Zone': {
            roads: {
              'Embassy Road': 130000,
              'Diplomatic Road': 125000,
            }
          }
        }
      },
      'Pyinmana': {
        wards: {
          'Downtown': {
            roads: {
              'Main Road': 60000,
              'Market Road': 55000,
              'Station Road': 50000,
            }
          }
        }
      }
    }
  }
};

export function YarPyatCalculator() {
  const { t } = useLanguage();
  
  // Location selections
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedRoad, setSelectedRoad] = useState<string>('');
  
  // Land dimensions
  const [landArea, setLandArea] = useState<string>('');
  
  // Calculated values
  const [ratePerSqft, setRatePerSqft] = useState<number>(0);
  const [assessedValue, setAssessedValue] = useState<number>(0);
  const [sellingTax, setSellingTax] = useState<number>(0);
  const [buyingTax, setBuyingTax] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Available options based on selections
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableWards, setAvailableWards] = useState<string[]>([]);
  const [availableRoads, setAvailableRoads] = useState<string[]>([]);

  // Update available cities when region changes
  useEffect(() => {
    if (selectedRegion) {
      const cities = Object.keys(locationData[selectedRegion as keyof typeof locationData]?.cities || {});
      setAvailableCities(cities);
      setSelectedCity('');
      setSelectedWard('');
      setSelectedRoad('');
      setAvailableWards([]);
      setAvailableRoads([]);
      setRatePerSqft(0);
      setShowResults(false);
    }
  }, [selectedRegion]);

  // Update available wards when city changes
  useEffect(() => {
    if (selectedRegion && selectedCity) {
      const wards = Object.keys(
        (locationData[selectedRegion as keyof typeof locationData]?.cities as any)?.[selectedCity]?.wards || {}
      );
      setAvailableWards(wards);
      setSelectedWard('');
      setSelectedRoad('');
      setAvailableRoads([]);
      setRatePerSqft(0);
      setShowResults(false);
    }
  }, [selectedCity, selectedRegion]);

  // Update available roads when ward changes
  useEffect(() => {
    if (selectedRegion && selectedCity && selectedWard) {
      const roads = Object.keys(
        (locationData[selectedRegion as keyof typeof locationData]?.cities as any)?.[selectedCity]?.wards?.[selectedWard]?.roads || {}
      );
      setAvailableRoads(roads);
      setSelectedRoad('');
      setRatePerSqft(0);
      setShowResults(false);
    }
  }, [selectedWard, selectedCity, selectedRegion]);

  // Update rate when road is selected
  useEffect(() => {
    if (selectedRegion && selectedCity && selectedWard && selectedRoad) {
      const rate = (locationData[selectedRegion as keyof typeof locationData]?.cities as any)?.[selectedCity]?.wards?.[selectedWard]?.roads?.[selectedRoad] || 0;
      setRatePerSqft(rate);
      setShowResults(false);
    }
  }, [selectedRoad, selectedWard, selectedCity, selectedRegion]);

  const handleCalculate = () => {
    if (!selectedRegion || !selectedCity || !selectedWard || !selectedRoad) {
      alert('Please select Region, City, Ward, and Road');
      return;
    }

    if (!landArea || parseFloat(landArea) <= 0) {
      alert('Please enter a valid land area');
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
    setRatePerSqft(0);
    setAssessedValue(0);
    setSellingTax(0);
    setBuyingTax(0);
    setShowResults(false);
    setAvailableCities([]);
    setAvailableWards([]);
    setAvailableRoads([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
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
                    {t('calculator.yarPyat.region')}
                  </Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(locationData).map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city">
                    {t('calculator.yarPyat.city')}
                  </Label>
                  <Select 
                    value={selectedCity} 
                    onValueChange={setSelectedCity}
                    disabled={!selectedRegion}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ward */}
                <div className="space-y-2">
                  <Label htmlFor="ward">
                    {t('calculator.yarPyat.ward')}
                  </Label>
                  <Select 
                    value={selectedWard} 
                    onValueChange={setSelectedWard}
                    disabled={!selectedCity}
                  >
                    <SelectTrigger id="ward">
                      <SelectValue placeholder="Select Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWards.map((ward) => (
                        <SelectItem key={ward} value={ward}>
                          {ward}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Road */}
                <div className="space-y-2">
                  <Label htmlFor="road">
                    {t('calculator.yarPyat.road')}
                  </Label>
                  <Select 
                    value={selectedRoad} 
                    onValueChange={setSelectedRoad}
                    disabled={!selectedWard}
                  >
                    <SelectTrigger id="road">
                      <SelectValue placeholder="Select Road" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoads.map((road) => (
                        <SelectItem key={road} value={road}>
                          {road}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="space-y-2">
                  <Label htmlFor="landArea">
                    {t('calculator.yarPyat.landAreaSqft')}
                  </Label>
                  <Input
                    id="landArea"
                    type="number"
                    placeholder="e.g., 2400"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('calculator.yarPyat.landAreaExample')}
                  </p>
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
                          <p>{selectedRoad}, {selectedWard}</p>
                          <p>{selectedCity}, {selectedRegion}</p>
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
