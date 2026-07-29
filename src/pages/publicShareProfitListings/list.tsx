/**
 * Public Share Profit Listings page.
 */

import { useMemo, useState } from 'react';
import { Search, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useShareProfitListings } from '@/hooks/queries/useShareProfitListings';
import { InfiniteScrollList } from '@/components/features/InfiniteScrollList';
import { ShareProfitListingCard } from './components/ShareProfitListingCard';
import type { ShareProfitListFilters } from '@/services/api/shareProfitListing';
import type { ShareProfitWantedType } from '@/types/shareProfitListing';

export default function PublicShareProfitList() {
  const seo = seoUtils.getPageSEO('publicShareProfitList');
  const { t, language } = useLanguage();

  const [filters, setFilters] = useState({
    search: '',
    wanted_type: '' as ShareProfitWantedType | '',
    property_type_id: '',
    prefer_region_id: '',
    prefer_township_id: '',
    min_budget: '',
    max_budget: '',
    bedrooms: '',
    bathrooms: '',
    sort_by: 'created_at',
    sort_direction: 'desc' as 'asc' | 'desc',
  });

  const { data: regionsData } = useRegions();
  const { data: townshipsData } = useTownships();
  const { data: propertyTypesData } = usePropertyTypes();

  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const availableTownships = townships.filter(
    (township) => township.region_id === parseInt(filters.prefer_region_id, 10)
  );

  const apiFilters: ShareProfitListFilters = useMemo(() => {
    const result: ShareProfitListFilters = {
      sort_by: filters.sort_by,
      sort_direction: filters.sort_direction,
      per_page: 20,
    };

    if (filters.search) result.search = filters.search;
    if (filters.wanted_type) result.wanted_type = filters.wanted_type;
    if (filters.property_type_id) result.property_type_id = parseInt(filters.property_type_id, 10);
    if (filters.prefer_region_id) result.prefer_region_id = parseInt(filters.prefer_region_id, 10);
    if (filters.prefer_township_id) result.prefer_township_id = parseInt(filters.prefer_township_id, 10);
    if (filters.min_budget) result.min_budget = parseFloat(filters.min_budget);
    if (filters.max_budget) result.max_budget = parseFloat(filters.max_budget);
    if (filters.bedrooms) result.bedrooms = parseInt(filters.bedrooms, 10);
    if (filters.bathrooms) result.bathrooms = parseInt(filters.bathrooms, 10);

    return result;
  }, [filters]);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShareProfitListings(apiFilters);

  const listings = data?.pages.flatMap((page) => page.data?.data || []) || [];
  const totalCount = data?.pages[0]?.data?.pagination?.total ?? listings.length;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const loadingSkeletons = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
      {[...Array(6)].map((_, i) => (
        <Card key={`skeleton-${i}`} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <SEOHead seo={seo} path="/public-share-profit-list" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
              {language === 'mm' ? 'အကျိုးတူရ စာရင်း' : 'Share Profit Listings'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'mm'
                ? 'အကျိုးတူရ အိမ်ခြံမြေ လိုချင်သူများနှင့် ရောင်းချသူများကို ရှာဖွေပါ'
                : 'Browse share profit property listings from buyers, renters, and sellers'}
            </p>
          </div>

          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'mm' ? 'ရှာဖွေရန်...' : 'Search share profit listings...'}
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select
                    value={filters.wanted_type || 'all'}
                    onValueChange={(value) => handleFilterChange('wanted_type', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'mm' ? 'အမျိုးအစား' : 'Type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'mm' ? 'အားလုံး' : 'All Types'}</SelectItem>
                      <SelectItem value="buyer">{language === 'mm' ? 'ဝယ်သူ' : 'Buyer'}</SelectItem>
                      <SelectItem value="renter">{language === 'mm' ? 'ငှားသူ' : 'Renter'}</SelectItem>
                      <SelectItem value="seller">{language === 'mm' ? 'ရောင်းသူ' : 'Seller'}</SelectItem>
                      <SelectItem value="share_profit">{language === 'mm' ? 'အကျိုးတူရ' : 'Share Profit'}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.property_type_id || 'all'}
                    onValueChange={(value) => handleFilterChange('property_type_id', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('search.propertyType') || 'Property Type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'mm' ? 'အားလုံး' : 'All Types'}</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {language === 'mm' ? type.name_mm : type.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.prefer_region_id || 'all'}
                    onValueChange={(value) => {
                      handleFilterChange('prefer_region_id', value === 'all' ? '' : value);
                      handleFilterChange('prefer_township_id', '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('search.region') || 'Region'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'mm' ? 'တိုင်းဒေသကြီးအားလုံး' : 'All Regions'}</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {language === 'mm' ? region.name_mm : region.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.prefer_township_id || 'all'}
                    onValueChange={(value) => handleFilterChange('prefer_township_id', value === 'all' ? '' : value)}
                    disabled={!filters.prefer_region_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('search.township') || 'Township'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'mm' ? 'မြို့နယ်အားလုံး' : 'All Townships'}</SelectItem>
                      {availableTownships.map((township) => (
                        <SelectItem key={township.id} value={township.id.toString()}>
                          {language === 'mm' ? township.name_mm : township.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    placeholder={language === 'mm' ? 'အနည်းဆုံး ဘတ်ဂျက်' : 'Min Budget (MMK)'}
                    value={filters.min_budget}
                    onChange={(e) => handleFilterChange('min_budget', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={language === 'mm' ? 'အများဆုံး ဘတ်ဂျက်' : 'Max Budget (MMK)'}
                    value={filters.max_budget}
                    onChange={(e) => handleFilterChange('max_budget', e.target.value)}
                  />
                  <Select
                    value={filters.bedrooms || 'any'}
                    onValueChange={(value) => handleFilterChange('bedrooms', value === 'any' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('search.bedrooms') || 'Bedrooms'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">{language === 'mm' ? 'မည်သည့်တန်ဖိုးမဆို' : 'Any'}</SelectItem>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}{n === 5 ? '+' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.bathrooms || 'any'}
                    onValueChange={(value) => handleFilterChange('bathrooms', value === 'any' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('search.bathrooms') || 'Bathrooms'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">{language === 'mm' ? 'မည်သည့်တန်ဖိုးမဆို' : 'Any'}</SelectItem>
                      {[1, 2, 3, 4].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}{n === 4 ? '+' : ''}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Select value={filters.sort_by} onValueChange={(value) => handleFilterChange('sort_by', value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t('search.sortBy') || 'Sort by'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">{language === 'mm' ? 'တင်သည့်ရက်' : 'Date Posted'}</SelectItem>
                      <SelectItem value="updated_at">{language === 'mm' ? 'နောက်ဆုံးပြင်ဆင်မှု' : 'Last Updated'}</SelectItem>
                      <SelectItem value="title">{language === 'mm' ? 'ခေါင်းစဉ်' : 'Title'}</SelectItem>
                      <SelectItem value="min_budget">{language === 'mm' ? 'ဘတ်ဂျက်' : 'Budget'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.sort_direction}
                    onValueChange={(value) => handleFilterChange('sort_direction', value as 'asc' | 'desc')}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">↓</SelectItem>
                      <SelectItem value="asc">↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            loadingSkeletons
          ) : error ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {t('search.errorLoading') || 'Error loading listings. Please try again.'}
              </p>
            </Card>
          ) : listings.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'mm' ? 'စာရင်းမတွေ့ပါ' : 'No Listings Found'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'mm'
                    ? 'သင့်စစ်ထုတ်မှုနှင့် ကိုက်ညီသော စာရင်းမရှိပါ။'
                    : 'No listings match your current filters.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  {language === 'mm'
                    ? `${totalCount} ခု တွေ့ရှိပါသည်`
                    : `${totalCount} listing${totalCount !== 1 ? 's' : ''} found`}
                </p>
              </div>

              <InfiniteScrollList
                hasNextPage={hasNextPage || false}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                loadingComponent={loadingSkeletons}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {listings.map((listing) => (
                    <ShareProfitListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </InfiniteScrollList>
            </>
          )}
        </div>
      </div>
    </>
  );
}
