import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Search, StickyNote, Home, ExternalLink, Tag, CircleDot, Ruler, MapPin, Phone, List } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { SEOHead } from '@/components/seo/SEOHead';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import {
  usePropertyNoteAccess,
  usePropertyNoteMap,
  usePropertyNoteMapDetail,
} from '@/hooks/queries/usePropertyNotes';
import { PropertyNoteMapCanvas } from './components/PropertyNoteMapCanvas';
import type {
  PropertyNoteMapFilters,
  PropertyNoteMapPin,
  PropertyNoteStatus,
} from '@/types/propertyNote';

/**
 * Property Note map — pins for own/see-others notes + properties.
 */
export default function MyPropertyNotesMapPage() {
  const seo = seoUtils.getPageSEO('myPropertyNotesMap');
  const { language } = useLanguage();
  const mm = language === 'mm';

  const [filters, setFilters] = useState({
    note_code: '',
    status: '' as PropertyNoteStatus | '',
    region_id: '',
    township_id: '',
  });
  const [selectedPin, setSelectedPin] = useState<PropertyNoteMapPin | null>(null);

  const { data: accessResponse, isLoading: accessLoading } = usePropertyNoteAccess();
  const access = accessResponse?.data?.data;
  const isAllowed = Boolean(access?.is_allowed);

  const { data: regionsData } = useRegions();
  const { data: townshipsData } = useTownships();
  const regions = regionsData?.data || [];

  const availableTownships = useMemo(() => {
    const allTownships = townshipsData?.data || [];
    if (!filters.region_id) return [];
    const regionId = parseInt(filters.region_id, 10);
    return allTownships.filter((t) => t.region_id === regionId);
  }, [townshipsData?.data, filters.region_id]);

  const apiFilters: PropertyNoteMapFilters = useMemo(() => {
    const result: PropertyNoteMapFilters = { paginate: false };
    if (filters.note_code.trim()) result.note_code = filters.note_code.trim();
    if (filters.status) result.status = filters.status;
    if (filters.region_id) result.region_id = parseInt(filters.region_id, 10);
    if (filters.township_id) result.township_id = parseInt(filters.township_id, 10);
    return result;
  }, [filters]);

  const {
    data: mapResponse,
    isLoading: mapLoading,
    error: mapError,
    refetch,
  } = usePropertyNoteMap(apiFilters, isAllowed);

  const mapData = mapResponse?.data?.data;
  const pins = mapData?.pins ?? [];
  const counts = mapData?.counts;

  const {
    data: detailResponse,
    isLoading: detailLoading,
    error: detailError,
  } = usePropertyNoteMapDetail(
    selectedPin?.id ?? 0,
    selectedPin?.pin_type ?? 'note',
    Boolean(selectedPin)
  );

  const detail = detailResponse?.data?.data;

  const hasActiveFilters = Boolean(
    filters.note_code || filters.status || filters.region_id || filters.township_id
  );

  const resetFilters = () => {
    setFilters({
      note_code: '',
      status: '',
      region_id: '',
      township_id: '',
    });
  };

  if (!accessLoading && access && !isAllowed) {
    return <Navigate to="/my-property-notes" replace />;
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-6 max-w-7xl">
      <SEOHead seo={seo} path="/my-property-notes/map" />

      <div className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-1 -ml-2">
              <Link to="/my-property-notes/list">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {mm ? 'စာရင်းသို့' : 'Back to list'}
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">
              {mm ? 'Property Note မြေပုံ' : 'Property Note Map'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {mm
                ? 'မှတ်စု (လိမ္မော်) နှင့် အိမ်ခြံမြေ (ပြာ) pins'
                : 'Notes (amber) and properties (blue) pins'}
            </p>
          </div>

          <div className="flex flex-col items-stretch sm:items-end gap-2 sm:pt-8">
            <Button variant="outline" asChild>
              <Link to="/my-property-notes/list">
                <List className="h-4 w-4 mr-2" />
                {mm ? 'မှတ်စု စာရင်း' : 'Property Note List'}
              </Link>
            </Button>
            {counts && (
              <div className="flex flex-wrap gap-2">
                <Badge className="gap-1 border-amber-600/30 bg-amber-600 text-white hover:bg-amber-600">
                  <StickyNote className="h-3 w-3" />
                  {mm ? 'မှတ်စု' : 'Notes'}: {counts.notes}
                </Badge>
                <Badge className="gap-1 border-blue-600/30 bg-blue-600 text-white hover:bg-blue-600">
                  <Home className="h-3 w-3" />
                  {mm ? 'အိမ်' : 'Properties'}: {counts.properties}
                </Badge>
                <Badge variant="secondary">
                  {mm ? 'စုစုပေါင်း' : 'Total'}: {counts.total}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/**
       * CardContent defaults to pt-0 — force full padding so filters are not flush to the card top.
       */}
      <Card className="mb-6">
        <CardContent className="!p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder={mm ? 'ကုဒ် ရှာရန် (note / property)' : 'Search code (note / property)'}
              value={filters.note_code}
              onChange={(e) => setFilters((prev) => ({ ...prev, note_code: e.target.value }))}
            />
          </div>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value === 'all' ? '' : (value as PropertyNoteStatus),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={mm ? 'အခြေအနေ' : 'Status'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{mm ? 'အခြေအနေ အားလုံး' : 'All statuses'}</SelectItem>
              <SelectItem value="active">{mm ? 'အသက်ဝင်' : 'Active'}</SelectItem>
              <SelectItem value="sold">{mm ? 'ရောင်းပြီး' : 'Sold'}</SelectItem>
              <SelectItem value="rented">{mm ? 'ငှားပြီး' : 'Rented'}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.region_id || 'all'}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                region_id: value === 'all' ? '' : value,
                township_id: '',
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={mm ? 'တိုင်း/ပြည်နယ်' : 'Region'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{mm ? 'တိုင်းအားလုံး' : 'All regions'}</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={String(region.id)}>
                  {mm ? region.name_mm : region.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select
              value={filters.township_id || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  township_id: value === 'all' ? '' : value,
                }))
              }
              disabled={!filters.region_id}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={mm ? 'မြို့နယ်' : 'Township'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{mm ? 'မြို့နယ်အားလုံး' : 'All townships'}</SelectItem>
                {availableTownships.map((township) => (
                  <SelectItem key={township.id} value={String(township.id)}>
                    {mm ? township.name_mm : township.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" size="icon" onClick={resetFilters} title={mm ? 'ရှင်းရန်' : 'Reset'}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {(accessLoading || mapLoading) && (
        <Skeleton className="w-full h-[60vh] rounded-lg" />
      )}

      {!accessLoading && !mapLoading && mapError && (
        <Card>
          <CardContent className="p-6 flex flex-col gap-3">
            <p className="text-red-600 text-sm">
              {mm ? 'မြေပုံ pins မရရှိပါ' : 'Could not load map pins'}
            </p>
            <Button variant="outline" className="w-fit" onClick={() => refetch()}>
              {mm ? 'ပြန်ကြိုးစားရန်' : 'Retry'}
            </Button>
          </CardContent>
        </Card>
      )}

      {!accessLoading && !mapLoading && !mapError && (
        <Card>
          <CardContent className="p-2 sm:p-3">
            {pins.length === 0 ? (
              <div className="h-[50vh] flex items-center justify-center text-sm text-gray-500">
                {mm ? 'pin မရှိသေးပါ' : 'No pins to show'}
              </div>
            ) : (
              <div className="h-[65vh] min-h-[360px] w-full overflow-hidden rounded-lg">
                <PropertyNoteMapCanvas
                  pins={pins}
                  language={language}
                  onViewDetails={setSelectedPin}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Sheet
        modal={false}
        open={Boolean(selectedPin)}
        onOpenChange={(open) => !open && setSelectedPin(null)}
      >
        <SheetContent
          showOverlay={false}
          className="sm:max-w-md overflow-y-auto border-l shadow-xl"
        >
          <SheetHeader>
            <SheetTitle>
              {detail?.code || selectedPin?.code || (mm ? 'အသေးစိတ်' : 'Details')}
            </SheetTitle>
            <SheetDescription>
              {selectedPin?.pin_type === 'note'
                ? mm
                  ? 'Property Note'
                  : 'Property Note'
                : mm
                  ? 'အိမ်ခြံမြေ'
                  : 'Property'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {detailLoading && (
              <div className="space-y-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {detailError && (
              <p className="text-sm text-red-600">
                {mm ? 'အသေးစိတ် မရရှိပါ' : 'Could not load details'}
              </p>
            )}

            {!detailLoading && detail && (
              <>
                {(detail.primary_image?.url || detail.primary_image?.medium_url) && (
                  <ImageWithFallback
                    src={
                      detail.primary_image.medium_url ||
                      detail.primary_image.url ||
                      detail.primary_image.small_url ||
                      ''
                    }
                    alt={detail.code || 'pin'}
                    className="w-full h-44 object-cover rounded-md"
                  />
                )}

                <div className="space-y-3 text-sm">
                  {detail.listing_type && (
                    <div className="flex items-start gap-2.5">
                      <Tag className="h-4 w-4 mt-0.5 shrink-0 text-amber-700" />
                      <p>
                        <span className="text-gray-500">{mm ? 'အမျိုးအစား' : 'Listing'}: </span>
                        {mm ? detail.listing_type.name_mm : detail.listing_type.name_en}
                      </p>
                    </div>
                  )}
                  {detail.status && (
                    <div className="flex items-start gap-2.5">
                      <CircleDot className="h-4 w-4 mt-0.5 shrink-0 text-green-700" />
                      <p>
                        <span className="text-gray-500">{mm ? 'အခြေအနေ' : 'Status'}: </span>
                        {detail.status}
                      </p>
                    </div>
                  )}
                  {(detail.length_ft != null || detail.width_ft != null) && (
                    <div className="flex items-start gap-2.5">
                      <Ruler className="h-4 w-4 mt-0.5 shrink-0 text-gray-600" />
                      <p>
                        <span className="text-gray-500">{mm ? 'အတိုင်းအတာ' : 'Size'}: </span>
                        {detail.length_ft ?? '-'}' × {detail.width_ft ?? '-'}'
                      </p>
                    </div>
                  )}
                  {detail.location?.location_string && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-700" />
                      <p>
                        <span className="text-gray-500">{mm ? 'တည်နေရာ' : 'Location'}: </span>
                        {detail.location.location_string}
                      </p>
                    </div>
                  )}
                  {detail.location?.address && (
                    <div className="flex items-start gap-2.5">
                      <Home className="h-4 w-4 mt-0.5 shrink-0 text-blue-600" />
                      <p>
                        <span className="text-gray-500">{mm ? 'လိပ်စာ' : 'Address'}: </span>
                        {detail.location.address}
                      </p>
                    </div>
                  )}
                  {detail.phone_numbers?.length > 0 && (
                    <div className="flex items-start gap-2.5">
                      <Phone className="h-4 w-4 mt-0.5 shrink-0 text-emerald-700" />
                      <p>
                        <span className="text-gray-500">{mm ? 'ဖုန်း' : 'Phone'}: </span>
                        {detail.phone_numbers.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                {detail.pin_type === 'property' && (detail.slug || selectedPin?.slug) && (
                  <Button asChild className="w-full">
                    <Link
                      to={`/properties/${detail.slug || selectedPin?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {mm ? 'Property အသေးစိတ် ကြည့်ရန်' : 'View property details'}
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
