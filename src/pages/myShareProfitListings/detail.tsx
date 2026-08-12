import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, MapPin, DollarSign, Home, Bed, Bath, Square, Phone, Mail, Edit, Trash2,
  CheckCircle, Clock, ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useMyShareProfitListing } from '@/hooks/queries/useMyShareProfitListings';
import {
  useDeleteShareProfitListing,
  useRenewShareProfitListing,
  useToggleShareProfitListingStatus,
} from '@/hooks/mutations';
import { shareProfitListingApi } from '@/services/api/shareProfitListing';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useModal } from '@/contexts/ModalContext';

export default function MyShareProfitDetail() {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const seo = seoUtils.getPageSEO('myShareProfitList');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: response, isLoading, error, refetch } = useMyShareProfitListing(slug || '');
  const listing = response?.data?.data;
  const deleteMutation = useDeleteShareProfitListing();
  const toggleMutation = useToggleShareProfitListingStatus();
  const renewMutation = useRenewShareProfitListing();
  const { showSuccess, showError } = useModal();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  const galleryImages = listing?.media?.images || [];
  const safeIndex = Math.max(0, Math.min(currentImageIndex, Math.max(galleryImages.length - 1, 0)));
  const currentImage = galleryImages[safeIndex];

  const getImageUrl = (img: (typeof galleryImages)[number]) =>
    img.url || img.medium_url || img.small_url || img.thumbnail_url || '';

  const getLocation = () => {
    if (!listing?.preferred_location) return '';
    const region = language === 'mm'
      ? listing.preferred_location.region.name_mm
      : listing.preferred_location.region.name_en;
    const township = listing.preferred_location.township
      ? (language === 'mm'
        ? listing.preferred_location.township.name_mm
        : listing.preferred_location.township.name_en)
      : null;
    return township ? `${township}, ${region}` : region;
  };

  const handleDelete = () => {
    if (!slug) return;
    if (listing?.status?.is_active) {
      showError(
        language === 'mm'
          ? 'အသက်ဝင်နေသော စာရင်းကို ဖျက်၍မရပါ။ အရင် ပိတ်ပါ။'
          : 'Active listing cannot be deleted. Please deactivate first.',
        language === 'mm' ? 'ဖျက်မရပါ' : 'Cannot delete'
      );
      return;
    }

    showConfirm({
      title: t('editWantedList.confirmDeleteTitle') || 'Confirm Delete',
      message: language === 'mm'
        ? 'ဤအကျိုးတူရ စာရင်းကို ဖျက်မှာ သေချာပါသလား။'
        : 'Are you sure you want to delete this partnership post?',
      confirmText: t('myWantedList.delete'),
      cancelText: t('editWantedList.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: () => {
        return new Promise((resolve, reject) => {
          deleteMutation.mutate(slug, {
            onSuccess: () => {
              showSuccess(
                language === 'mm' ? 'စာရင်း ဖျက်ပြီးပါပြီ။' : 'Listing deleted successfully.',
                t('editWantedList.deleteSuccessTitle') || 'Success!'
              );
              setTimeout(() => navigate('/my-share-profit-listings/list'), 1500);
              resolve();
            },
            onError: (err: Error) => {
              showError(err.message, t('editWantedList.errorTitle'));
              reject(err);
            },
          });
        });
      },
    });
  };

  const handleToggle = () => {
    if (!slug) return;
    toggleMutation.mutate(slug, {
      onSuccess: () => {
        showSuccess(
          language === 'mm' ? 'အခြေအနေ ပြောင်းပြီးပါပြီ။' : 'Status updated.',
          t('editWantedList.successTitle') || 'Success!'
        );
        refetch();
      },
      onError: (err: Error) => {
        showError(err.message, t('editWantedList.errorTitle'));
      },
    });
  };

  const handleRenew = async () => {
    if (!slug) return;

    let renewalDays = 30;
    let pointCost = 0;

    try {
      const statsResponse = await shareProfitListingApi.getOwnerStatistics();
      renewalDays = statsResponse.data?.data?.renewal?.days ?? 30;
      pointCost = statsResponse.data?.data?.renewal?.point_cost ?? 0;
    } catch {
      /**
       * Keep defaults if statistics fail; renew API still validates points.
       */
    }

    showConfirm({
      title: language === 'mm' ? 'သက်တမ်းတိုးရန်' : 'Renew Listing',
      message: language === 'mm'
        ? `သက်တမ်း ${renewalDays} ရက် တိုးမည်။ ပွိုင့် ${pointCost} နှုတ်မည်။ လက်ကျန်လုံလောက်မှသာ အောင်မြင်ပါမည်။`
        : `Extend expiry by ${renewalDays} days. ${pointCost} points will be charged. Renew succeeds only if your balance is enough.`,
      confirmText: language === 'mm' ? 'သက်တမ်းတိုးမည်' : 'Confirm & Renew',
      cancelText: t('editWantedList.cancel') || 'Cancel',
      onConfirm: () => {
        return new Promise<void>((resolve, reject) => {
          renewMutation.mutate(slug, {
            onSuccess: (apiResponse) => {
              const pointsConsumed = apiResponse.data?.data?.renewal_info?.points_consumed ?? pointCost;
              showSuccess(
                language === 'mm'
                  ? `သက်တမ်းတိုးပြီးပါပြီ။ ${pointsConsumed} ပွိုင့် အသုံးပြုခဲ့သည်။`
                  : `Listing renewed. Points used: ${pointsConsumed}.`,
                t('editWantedList.successTitle') || 'Success!'
              );
              refetch();
              resolve();
            },
            onError: (err: Error) => {
              showError(err.message, t('editWantedList.errorTitle'));
              reject(err);
            },
          });
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-40 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <h3 className="mb-4">{t('myWantedList.errorLoading')}</h3>
            <Button onClick={() => navigate('/my-share-profit-listings/list')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('createWantedList.back')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead seo={seo} path={`/my-share-profit-listings/detail/${slug}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/my-share-profit-listings/list')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'mm' ? 'စာရင်းသို့ ပြန်သွားရန်' : 'Back to Listings'}
            </Button>
            <div className="flex gap-2 flex-wrap">
              {listing.status.is_expired && (
                <Button
                  variant="outline"
                  onClick={handleRenew}
                  disabled={renewMutation.isPending}
                  className="border-amber-500/30 text-amber-700 hover:bg-amber-500/10 hover:text-amber-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {language === 'mm' ? 'သက်တမ်းတိုးမည်' : 'Renew'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleToggle}
                disabled={toggleMutation.isPending}
                className={
                  listing.status.is_active
                    ? 'border-red-500/30 text-red-600 hover:bg-red-500/10 hover:text-red-700'
                    : 'border-green-500/30 text-green-600 hover:bg-green-500/10 hover:text-green-700'
                }
              >
                {listing.status.is_active
                  ? (language === 'mm' ? 'ပိတ်မည်' : 'Deactivate')
                  : (language === 'mm' ? 'ဖွင့်မည်' : 'Activate')}
              </Button>
              <Button asChild variant="outline">
                <Link to={`/my-share-profit-listings/edit/${slug}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t('myWantedList.edit')}
                </Link>
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('myWantedList.delete')}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {galleryImages.length > 0 && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[16/10] bg-muted">
                      <ImageWithFallback
                        key={`owner-main-${safeIndex}-${currentImage?.id}`}
                        src={getImageUrl(currentImage)}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2"
                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2"
                            onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                            {safeIndex + 1} / {galleryImages.length}
                          </div>
                        </>
                      )}
                    </div>
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto">
                        {galleryImages.map((img, index) => (
                          <button
                            key={`owner-thumb-${img.id}-${index}`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                              index === safeIndex ? 'border-primary' : 'border-transparent'
                            }`}
                          >
                            <ImageWithFallback
                              src={getImageUrl(img)}
                              alt={`${listing.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6 pt-6 space-y-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl mb-3">{listing.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {listing.wanted_type_label}
                      </Badge>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        <Home className="h-3 w-3 mr-1" />
                        {language === 'mm' ? listing.property_type.name_mm : listing.property_type.name_en}
                      </Badge>
                      {listing.status.is_expired ? (
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
                          <Clock className="h-3 w-3 mr-1" />
                          {t('myWantedList.expired')}
                        </Badge>
                      ) : listing.status.is_active ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {language === 'mm' ? 'အသက်ဝင်သည်' : 'Active'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                          <Clock className="h-3 w-3 mr-1" />
                          {language === 'mm' ? 'ပိတ်ထားသည်' : 'Inactive'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{getLocation()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-sm font-semibold">{t('wantedDetail.description') || 'Description'}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {listing.description || (language === 'mm' ? 'ဖော်ပြချက်မရှိပါ။' : 'No description.')}
                    </p>
                  </div>

                  {listing.address && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="mb-2 text-sm font-semibold">{t('createWantedList.address') || 'Address'}</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{listing.address}</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Bed className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('wantedDetail.bedrooms')}</p>
                        <p className="font-medium">{listing.specifications.bedrooms ?? '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Bath className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('wantedDetail.bathrooms')}</p>
                        <p className="font-medium">{listing.specifications.bathrooms ?? '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Square className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t('wantedDetail.area')}</p>
                        <p className="font-medium">{listing.specifications.area_range || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold text-primary">{listing.budget.budget_range}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 pt-6 space-y-4">
                  <h3 className="mb-2">{t('wantedDetail.contact') || 'Contact'}</h3>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('wantedDetail.name')}</p>
                    <p className="font-medium">{listing.contact.name}</p>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{listing.contact.phone || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="break-all">{listing.contact.email || '—'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 pt-6 space-y-2 text-sm text-muted-foreground">
                  <p>{t('wantedDetail.postedOn') || 'Posted on'}: {listing.created_at}</p>
                  {listing.status.expires_at && (
                    <p>{language === 'mm' ? 'သက်တမ်းကုန်' : 'Expires'}: {listing.status.expires_at}</p>
                  )}
                  <p>
                    {language === 'mm' ? 'အတည်ပြုအခြေအနေ' : 'Verification'}: {listing.status.verification_status}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
