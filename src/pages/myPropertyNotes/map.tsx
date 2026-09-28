import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  RotateCcw,
  Search,
  StickyNote,
  Home,
  ExternalLink,
  Tag,
  CircleDot,
  Ruler,
  MapPin,
  Phone,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { PropertyNotePageHeader } from './components/PropertyNotePageHeader';
import {
  PROPERTY_NOTE_PHOTO_NAV_BUTTON,
  PROPERTY_NOTE_PHOTO_NAV_ICON,
} from './photoNavStyles';
import type {
  PropertyNoteMapFilters,
  PropertyNoteMapPin,
  PropertyNoteMediaImage,
  PropertyNoteStatus,
} from '@/types/propertyNote';

/**
 * Prefer medium/full URL for map sheet gallery.
 */
function mapSheetImageSrc(img: PropertyNoteMediaImage): string {
  return img.medium_url || img.url || img.small_url || img.thumbnail_url || '';
}

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
  /**
   * Last clicked map pin (green). Separate from sidebar sheet.
   */
  const [activePin, setActivePin] = useState<PropertyNoteMapPin | null>(null);
  /**
   * Large dialog map — hide inline map while open (avoids dual Leaflet instances).
   */
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  /**
   * Sheet photo carousel index (reset when pin/detail changes).
   */
  const [photoIndex, setPhotoIndex] = useState(0);

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
    /**
     * Status filter removed — map API returns active notes only.
     */
    // if (filters.status) result.status = filters.status;
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

  const sheetImages = useMemo((): PropertyNoteMediaImage[] => {
    if (!detail) return [];
    if (detail.images?.length) return detail.images;
    if (detail.primary_image) return [detail.primary_image];
    return [];
  }, [detail]);

  useEffect(() => {
    setPhotoIndex(0);
  }, [selectedPin?.id, selectedPin?.pin_type, detail?.id]);

  const hasActiveFilters = Boolean(
    filters.note_code || filters.region_id || filters.township_id
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

      <PropertyNotePageHeader
        title={mm ? 'Property Note မြေပုံ' : 'Property Note Map'}
        extra={
          counts ? (
            <>
              <Badge className="gap-1 border-transparent !bg-blue-600 !text-white hover:!bg-blue-700">
                <StickyNote className="h-3 w-3" />
                {mm ? 'မှတ်စု' : 'Notes'}: {Number(counts.notes)}
              </Badge>
              <Badge className="gap-1 border-transparent !bg-red-600 !text-white hover:!bg-red-700">
                <Home className="h-3 w-3" />
                {mm ? 'အိမ်' : 'Properties'}: {Number(counts.properties)}
              </Badge>
              <Badge className="gap-1 border-transparent !bg-green-600 !text-white hover:!bg-green-700">
                {mm ? 'စုစုပေါင်း' : 'Total'}: {Number(counts.total)}
              </Badge>
            </>
          ) : null
        }
      />

      {/**
       * CardContent defaults to pt-0 — force full padding so filters are not flush to the card top.
       */}
      <Card className="mb-6">
        <CardContent className="!p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder={mm ? 'ကုဒ် ရှာရန် (note / property)' : 'Search code (note / property)'}
              value={filters.note_code}
              onChange={(e) => setFilters((prev) => ({ ...prev, note_code: e.target.value }))}
            />
          </div>

          {/**
           * Status filter hidden — map shows active notes only (API filters sold/rented out).
           *
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
           */}

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
              <>
                {/**
                 * Same Expand pattern as MapLocationPicker (create form): outline + icon + label above map.
                 */}
                {!isMapMaximized && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border-[3px] bg-white shadow"
                            style={{ borderColor: '#dc2626' }}
                          />
                          <span className="font-medium text-gray-700">
                            {mm ? 'အိမ်' : 'Property'}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border-[3px] bg-white shadow"
                            style={{ borderColor: '#2563eb' }}
                          />
                          <span className="font-medium text-gray-700">
                            {mm ? 'မှတ်စု' : 'Notes'}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block h-3.5 w-3.5 rounded-full border-[3px] bg-white shadow"
                            style={{ borderColor: '#16a34a' }}
                          />
                          <span className="font-medium text-gray-700">
                            {mm ? 'ရွေးထား' : 'Selected'}
                          </span>
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMapMaximized(true)}
                        className="shrink-0"
                      >
                        <Maximize2 className="h-4 w-4 mr-1.5" />
                        {mm ? 'ချဲ့ရန်' : 'Expand'}
                      </Button>
                    </div>
                    <div className="relative h-[65vh] min-h-[360px] w-full overflow-hidden rounded-lg">
                      <PropertyNoteMapCanvas
                        pins={pins}
                        language={language}
                        activePin={activePin}
                        onPinClick={setActivePin}
                        onViewDetails={(pin) => {
                          setActivePin(pin);
                          setSelectedPin(pin);
                        }}
                      />
                    </div>
                  </div>
                )}
                {isMapMaximized && (
                  <div className="h-[65vh] min-h-[360px] w-full flex items-center justify-center text-sm text-gray-500 rounded-lg bg-muted/30">
                    {mm ? 'ချဲ့ထားသော မြေပုံ ဖွင့်ထားသည်…' : 'Maximized map is open…'}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {isMapMaximized && (
        <Dialog open={isMapMaximized} onOpenChange={setIsMapMaximized}>
          <DialogContent
            size="2xl"
            className="max-w-[98vw] w-[98vw] h-[96vh] !flex !flex-col !gap-0 !p-0"
            style={{ maxHeight: '96vh' }}
          >
            <div className="px-3 py-2 pr-12 border-b flex items-center flex-shrink-0">
              <DialogHeader className="flex-1 space-y-0 py-0 text-left">
                <DialogTitle className="text-sm font-medium leading-tight">
                  {mm ? 'မြေပုံ (ကြီးမားသော မြေပုံ)' : 'Property notes map (expanded)'}
                </DialogTitle>
              </DialogHeader>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {pins.length > 0 && (
                <PropertyNoteMapCanvas
                  pins={pins}
                  language={language}
                  activePin={activePin}
                  onPinClick={setActivePin}
                  onViewDetails={(pin) => {
                    setActivePin(pin);
                    setSelectedPin(pin);
                    setIsMapMaximized(false);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
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
                {sheetImages.length > 0 && (
                  <div className="relative w-full">
                    <ImageWithFallback
                      key={sheetImages[photoIndex]?.id ?? photoIndex}
                      src={mapSheetImageSrc(sheetImages[photoIndex] ?? sheetImages[0])}
                      alt={detail.code || 'pin'}
                      className="w-full h-44 object-cover rounded-md"
                    />
                    {sheetImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          className={`absolute left-2 top-1/2 z-10 -translate-y-1/2 ${PROPERTY_NOTE_PHOTO_NAV_BUTTON}`}
                          onClick={() =>
                            setPhotoIndex((prev) =>
                              prev > 0 ? prev - 1 : sheetImages.length - 1
                            )
                          }
                          aria-label={mm ? 'ယခင်ပုံ' : 'Previous photo'}
                        >
                          <ChevronLeft className={PROPERTY_NOTE_PHOTO_NAV_ICON} />
                        </button>
                        <button
                          type="button"
                          className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 ${PROPERTY_NOTE_PHOTO_NAV_BUTTON}`}
                          onClick={() =>
                            setPhotoIndex((prev) =>
                              prev < sheetImages.length - 1 ? prev + 1 : 0
                            )
                          }
                          aria-label={mm ? 'နောက်ပုံ' : 'Next photo'}
                        >
                          <ChevronRight className={PROPERTY_NOTE_PHOTO_NAV_ICON} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white">
                          {photoIndex + 1} / {sheetImages.length}
                        </div>
                      </>
                    )}
                  </div>
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
