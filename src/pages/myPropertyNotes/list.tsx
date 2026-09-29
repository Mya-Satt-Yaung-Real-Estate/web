import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useSyncAuthProfileFlags } from '@/hooks/useSyncAuthProfileFlags';
import { PropertyNotePageHeader } from './components/PropertyNotePageHeader';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyNoteAccess, usePropertyNotes } from '@/hooks/queries/usePropertyNotes';
import { useDeletePropertyNote } from '@/hooks/mutations/usePropertyNoteMutations';
import type { PropertyNoteListItem, PropertyNoteStatus } from '@/types/propertyNote';

function getImageUrl(note: PropertyNoteListItem): string | undefined {
  const img = note.primary_image;
  if (!img) return undefined;
  return img.url || img.medium_url || img.small_url || img.thumbnail_url;
}

function statusBadgeClass(status: PropertyNoteStatus): string {
  if (status === 'active') return 'bg-green-600 text-white hover:bg-green-600 border-transparent';
  if (status === 'sold') return 'bg-blue-600 text-white hover:bg-blue-600 border-transparent';
  return 'bg-amber-600 text-white hover:bg-amber-600 border-transparent';
}

/**
 * Property Note history list (own notes only).
 */
export default function MyPropertyNotesListPage() {
  const seo = seoUtils.getPageSEO('myPropertyNotesList');
  const { language } = useLanguage();
  const mm = language === 'mm';
  const { showSuccess, showError } = useModal();
  useSyncAuthProfileFlags(true);
  const {
    isOpen: isConfirmOpen,
    options: confirmOptions,
    isLoading: isConfirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PropertyNoteStatus | ''>('');
  const [regionId, setRegionId] = useState('');
  const [townshipId, setTownshipId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: accessResponse, isLoading: accessLoading } = usePropertyNoteAccess();
  const isAllowed = Boolean(accessResponse?.data?.data?.is_allowed);

  const { data: regionsData } = useRegions();
  const { data: townshipsData } = useTownships();
  const regions = regionsData?.data || [];

  const availableTownships = useMemo(() => {
    const all = townshipsData?.data || [];
    if (!regionId) return [];
    return all.filter((t) => t.region_id === parseInt(regionId, 10));
  }, [townshipsData?.data, regionId]);

  const { data: response, isLoading, error, refetch } = usePropertyNotes(
    {
      search: search.trim() || undefined,
      status: status || undefined,
      region_id: regionId ? parseInt(regionId, 10) : undefined,
      township_id: townshipId ? parseInt(townshipId, 10) : undefined,
      page: currentPage,
      per_page: 12,
    },
    isAllowed
  );

  const notes = response?.data?.data || [];
  const pagination = response?.data?.pagination;
  const deleteMutation = useDeletePropertyNote();

  const hasActiveFilters = Boolean(search.trim() || status || regionId || townshipId);

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setRegionId('');
    setTownshipId('');
    setCurrentPage(1);
  };

  const handleDelete = (note: PropertyNoteListItem) => {
    if (note.is_locked) {
      showError(
        mm ? 'Sold/Rented မှတ်စုကို ဖျက်၍မရပါ။' : 'Sold/Rented notes cannot be deleted.',
        mm ? 'ဖျက်မရပါ' : 'Cannot delete'
      );
      return;
    }

    showConfirm({
      title: mm ? 'ဖျက်ရန် အတည်ပြုပါ' : 'Confirm delete',
      message: mm
        ? `${note.note_code} ကို ဖျက်မှာ သေချာပါသလား။`
        : `Delete ${note.note_code}?`,
      confirmText: mm ? 'ဖျက်မည်' : 'Delete',
      cancelText: mm ? 'ပယ်ဖျက်' : 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          deleteMutation.mutate(note.id, {
            onSuccess: () => {
              showSuccess(
                mm ? 'ဖျက်ပြီးပါပြီ။' : 'Note deleted.',
                mm ? 'အောင်မြင်ပါသည်' : 'Success'
              );
              refetch();
              resolve();
            },
            onError: (err: Error & { response?: { data?: { message?: string } } }) => {
              showError(
                err?.response?.data?.message || err.message || (mm ? 'ဖျက်၍မရပါ' : 'Delete failed'),
                mm ? 'အမှား' : 'Error'
              );
              reject(err);
            },
          });
        }),
    });
  };

  if (!accessLoading && accessResponse?.data?.data && !isAllowed) {
    return <Navigate to="/my-property-notes" replace />;
  }

  return (
    <>
      <SEOHead seo={seo} path="/my-property-notes/list" />

      <div className="container mx-auto px-4 pt-24 pb-6 max-w-7xl">
        <PropertyNotePageHeader
          title={mm ? 'အိမ်ခြံမြေမှတ်စုများ စာရင်း' : 'Property Note List'}
          description={mm ? 'ကိုယ်ပိုင် မှတ်စုများကို စီမံပါ' : 'Manage your own property notes'}
          backTo="/my-property-notes"
          backLabel={mm ? 'ပြန်သွားရန်' : 'Back'}
        />

        <Card className="mb-6">
          <CardContent className="!p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-9"
                placeholder={mm ? 'ကုဒ် / ရပ်ကွက် / လမ်း' : 'Code / ward / road'}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              value={status || 'all'}
              onValueChange={(value) => {
                setStatus(value === 'all' ? '' : (value as PropertyNoteStatus));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={mm ? 'အခြေအနေ' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{mm ? 'အားလုံး' : 'All statuses'}</SelectItem>
                <SelectItem value="active">{mm ? 'အသက်ဝင်' : 'Active'}</SelectItem>
                <SelectItem value="sold">{mm ? 'ရောင်းပြီး' : 'Sold'}</SelectItem>
                <SelectItem value="rented">{mm ? 'ငှားပြီး' : 'Rented'}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={regionId || 'all'}
              onValueChange={(value) => {
                setRegionId(value === 'all' ? '' : value);
                setTownshipId('');
                setCurrentPage(1);
              }}
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
                value={townshipId || 'all'}
                onValueChange={(value) => {
                  setTownshipId(value === 'all' ? '' : value);
                  setCurrentPage(1);
                }}
                disabled={!regionId}
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
                <Button variant="outline" size="icon" onClick={resetFilters}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {(accessLoading || isLoading) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!accessLoading && !isLoading && error && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-red-600">{mm ? 'စာရင်း မရရှိပါ' : 'Could not load notes'}</p>
              <Button variant="outline" onClick={() => refetch()}>
                {mm ? 'ပြန်ကြိုးစားရန်' : 'Retry'}
              </Button>
            </CardContent>
          </Card>
        )}

        {!accessLoading && !isLoading && !error && notes.length === 0 && (
          <Card>
            <CardContent className="p-10 text-center text-sm text-gray-500">
              {mm ? 'မှတ်စု မရှိသေးပါ' : 'No property notes yet'}
              <div className="mt-4">
                <Button asChild>
                  <Link to="/my-property-notes/create">
                    <Plus className="h-4 w-4 mr-2" />
                    {mm ? 'ပထမဆုံး မှတ်စု ဖန်တီးရန်' : 'Create your first note'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!accessLoading && !isLoading && !error && notes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => {
                const imageUrl = getImageUrl(note);
                const listingName = note.listing_type
                  ? mm
                    ? note.listing_type.name_mm
                    : note.listing_type.name_en
                  : null;
                const place = [note.township, note.region]
                  .filter(Boolean)
                  .map((p) => (mm ? p!.name_mm : p!.name_en))
                  .join(', ');

                return (
                  <Card key={note.id} className="overflow-hidden">
                    <div className="relative h-40 bg-muted">
                      {imageUrl ? (
                        <ImageWithFallback
                          src={imageUrl}
                          alt={note.note_code}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                          {mm ? 'ပုံမရှိ' : 'No image'}
                        </div>
                      )}
                      <Badge className={`absolute top-2 right-2 border ${statusBadgeClass(note.status)}`}>
                        {note.status}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2 space-y-1">
                      <div className="font-semibold text-gray-900">{note.note_code}</div>
                      {listingName && <div className="text-sm text-gray-600">{listingName}</div>}
                      {place && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {place}
                        </div>
                      )}
                      {(note.ward || note.road) && (
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {[note.road, note.ward].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/my-property-notes/${note.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          {mm ? 'ကြည့်ရန်' : 'View'}
                        </Link>
                      </Button>
                      {!note.is_locked && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/my-property-notes/${note.id}/edit`}>
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            {mm ? 'ပြင်ရန်' : 'Edit'}
                          </Link>
                        </Button>
                      )}
                      {!note.is_locked && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleDelete(note)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          {mm ? 'ဖျက်ရန်' : 'Delete'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.last_page}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={confirmOptions?.title || ''}
        message={confirmOptions?.message || ''}
        confirmText={confirmOptions?.confirmText}
        cancelText={confirmOptions?.cancelText}
        confirmVariant={confirmOptions?.confirmVariant}
        isLoading={isConfirmLoading}
      />
    </>
  );
}
