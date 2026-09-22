import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import {
  usePropertyNoteAccess,
  usePropertyNoteDetail,
} from '@/hooks/queries/usePropertyNotes';
import {
  useDeletePropertyNote,
  useUpdatePropertyNoteStatus,
} from '@/hooks/mutations/usePropertyNoteMutations';
import type { PropertyNoteStatus } from '@/types/propertyNote';

function statusBadgeClass(status: PropertyNoteStatus | string): string {
  if (status === 'active') return 'bg-green-600 text-white hover:bg-green-600 border-transparent';
  if (status === 'sold') return 'bg-blue-600 text-white hover:bg-blue-600 border-transparent';
  if (status === 'rented') return 'bg-amber-600 text-white hover:bg-amber-600 border-transparent';
  return 'bg-secondary text-secondary-foreground';
}

/**
 * Property Note detail — view, mark sold/rented, delete.
 */
export default function MyPropertyNoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const noteId = Number(id);
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('myPropertyNotesDetail');
  const { language } = useLanguage();
  const mm = language === 'mm';
  const { showSuccess, showError } = useModal();
  const {
    isOpen: isConfirmOpen,
    options: confirmOptions,
    isLoading: isConfirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const { data: accessResponse, isLoading: accessLoading } = usePropertyNoteAccess();
  const isAllowed = Boolean(accessResponse?.data?.data?.is_allowed);

  const { data: response, isLoading, error, refetch } = usePropertyNoteDetail(
    noteId,
    isAllowed && noteId > 0
  );
  const note = response?.data?.data;

  const deleteMutation = useDeletePropertyNote();
  const statusMutation = useUpdatePropertyNoteStatus();

  const handleStatus = (status: 'sold' | 'rented') => {
    if (!note || note.is_locked) return;

    showConfirm({
      title: mm ? 'အခြေအနေ ပြောင်းရန်' : 'Update status',
      message:
        status === 'sold'
          ? mm
            ? 'Sold အဖြစ် မှတ်မလား။ ပြင်ဆင်၍မရတော့ပါ။'
            : 'Mark as sold? Editing will be locked.'
          : mm
            ? 'Rented အဖြစ် မှတ်မလား။ ပြင်ဆင်၍မရတော့ပါ။'
            : 'Mark as rented? Editing will be locked.',
      confirmText: mm ? 'အတည်ပြု' : 'Confirm',
      cancelText: mm ? 'ပယ်ဖျက်' : 'Cancel',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          statusMutation.mutate(
            { id: note.id, status },
            {
              onSuccess: () => {
                showSuccess(
                  mm ? 'အခြေအနေ ပြောင်းပြီးပါပြီ။' : 'Status updated.',
                  mm ? 'အောင်မြင်ပါသည်' : 'Success'
                );
                refetch();
                resolve();
              },
              onError: (err: Error & { response?: { data?: { message?: string } } }) => {
                showError(
                  err?.response?.data?.message || err.message || (mm ? 'မအောင်မြင်ပါ' : 'Failed'),
                  mm ? 'အမှား' : 'Error'
                );
                reject(err);
              },
            }
          );
        }),
    });
  };

  const handleDelete = () => {
    if (!note || note.is_locked) return;

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
              showSuccess(mm ? 'ဖျက်ပြီးပါပြီ။' : 'Note deleted.', mm ? 'အောင်မြင်ပါသည်' : 'Success');
              navigate('/my-property-notes/list');
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

  if (!noteId) {
    return <Navigate to="/my-property-notes/list" replace />;
  }

  const images = note?.images?.length
    ? note.images
    : note?.primary_image
      ? [note.primary_image]
      : [];

  return (
    <>
      <SEOHead seo={seo} path={`/my-property-notes/${noteId}`} />

      <div className="container mx-auto px-4 pt-24 pb-6 max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link to="/my-property-notes/list">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {mm ? 'စာရင်းသို့' : 'Back to list'}
          </Link>
        </Button>

        {(accessLoading || isLoading) && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && error && (
          <Card>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-red-600">{mm ? 'မှတ်စု မရရှိပါ' : 'Could not load note'}</p>
              <Button variant="outline" onClick={() => refetch()}>
                {mm ? 'ပြန်ကြိုးစားရန်' : 'Retry'}
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && note && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-semibold text-gray-900">{note.note_code}</h1>
                  <Badge className={statusBadgeClass(note.status)}>{note.status}</Badge>
                  {note.is_locked && (
                    <Badge variant="outline">{mm ? 'ပြင်မရ' : 'Locked'}</Badge>
                  )}
                </div>
                {note.listing_type && (
                  <p className="text-sm text-gray-600 mt-1">
                    {mm ? note.listing_type.name_mm : note.listing_type.name_en}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {!note.is_locked && (
                  <>
                    <Button variant="outline" asChild>
                      <Link to={`/my-property-notes/${note.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        {mm ? 'ပြင်ရန်' : 'Edit'}
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => handleStatus('sold')}>
                      {mm ? 'Sold' : 'Mark sold'}
                    </Button>
                    <Button variant="outline" onClick={() => handleStatus('rented')}>
                      {mm ? 'Rented' : 'Mark rented'}
                    </Button>
                    <Button variant="outline" className="text-red-600" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      {mm ? 'ဖျက်ရန်' : 'Delete'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {images.map((img) => (
                  <ImageWithFallback
                    key={img.id}
                    src={img.medium_url || img.url || img.small_url || ''}
                    alt={note.note_code}
                    className="h-36 w-full object-cover rounded-md"
                  />
                ))}
              </div>
            )}

            <Card>
              <CardHeader className="pb-2 font-medium">{mm ? 'အချက်အလက်' : 'Details'}</CardHeader>
              <CardContent className="space-y-2 text-sm">
                {(note.length_ft != null || note.width_ft != null) && (
                  <p>
                    <span className="text-gray-500">{mm ? 'အတိုင်းအတာ' : 'Size'}: </span>
                    {note.length_ft ?? '-'}' × {note.width_ft ?? '-'}'
                  </p>
                )}
                <p className="flex items-start gap-1">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                  <span>
                    {[note.road, note.ward, note.township && (mm ? note.township.name_mm : note.township.name_en), note.region && (mm ? note.region.name_mm : note.region.name_en)]
                      .filter(Boolean)
                      .join(', ') || '-'}
                  </span>
                </p>
                {note.latitude != null && note.longitude != null && (
                  <p className="text-gray-500">
                    {note.latitude.toFixed(6)}, {note.longitude.toFixed(6)}
                  </p>
                )}
                <p className="text-gray-500">
                  {mm ? 'ဖန်တီးချိန်' : 'Created'}: {note.created_at || '-'}
                </p>
              </CardContent>
            </Card>
          </div>
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
