import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Eye, Heart, Edit, Phone, Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useModal } from '@/contexts/ModalContext';
import { advertisementApi } from '@/services/api/advertisement';
import { advertisementKeys } from '@/services/queries/advertisement';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdvertisement } from '@/hooks/queries/useAdvertisement';
import { MediaGallery } from '@/components/MediaGallery';

export default function AdvertisementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const advertisementId = Number(id);

  const seo = seoUtils.getPageSEO('advertisements');
  const { data, isLoading, error } = useAdvertisement(advertisementId);

  // Compute data-dependent hooks unconditionally to keep hook order stable
  const ad = data?.data;
  const formatYmd = (val?: string | null) => (val ? String(val).split('T')[0] : '-');
  const images = useMemo(() => (Array.isArray(ad?.media?.images) ? ad!.media!.images : []), [ad]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const canEdit = !!ad?.is_me && ad?.verification_status === 'pending';
  // Confirm modal and toasts
  const { showSuccess } = useModal();
  const queryClient = useQueryClient();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  const handleDelete = () => {
    if (!ad?.id) return;
    showConfirm({
      title: t('advertisements.confirmDeleteTitle') || 'Confirm Delete',
      message: t('advertisements.confirmDeleteMessage') || 'Are you sure you want to delete this advertisement? This action cannot be undone.',
      confirmText: t('advertisements.delete') || 'Delete',
      cancelText: t('advertisements.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: async () => {
        await advertisementApi.deleteAdvertisement(ad.id);
        queryClient.invalidateQueries({ queryKey: advertisementKeys.lists() });
        queryClient.invalidateQueries({ queryKey: advertisementKeys.stats() });
        showSuccess(t('advertisements.deleteSuccess') || 'Advertisement deleted successfully!', t('advertisements.deleteSuccessTitle') || 'Success!');
        navigate('/advertisements');
      },
    });
  };

  // Badge color helpers
  const getVerificationBadgeClass = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-200 text-gray-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-muted text-foreground';
    }
  };

  useEffect(() => {
    if (activeImageIdx >= images.length) {
      setActiveImageIdx(0);
    }
  }, [images.length, activeImageIdx]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('createAdvertisement.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12 flex items-center justify-center">
        <Card className="glass border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowLeft className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('createAdvertisement.errorTitle')}</h3>
            <p className="text-muted-foreground mb-4">{t('advertisements.errorDesc') || 'Failed to load advertisement details.'}</p>
            <Button onClick={() => navigate('/advertisements')} variant="outline">
              {t('appointments.backToList')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead seo={seo} path={`/advertisements/detail/${advertisementId}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header: Row 1 - Breadcrumb + Back */}
          <div className="flex items-center justify-between mb-3 py-2">
            <nav className="text-sm text-muted-foreground">
              <ol className="flex items-center gap-1">
                <li>
                  <Link to="/advertisements" className="text-primary hover:text-primary/80 transition-colors">
                    {t('advertisements.title') || 'Advertisements'}
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="text-muted-foreground">{t('advertisements.detail') || 'Detail'}</li>
              </ol>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" /> {t('createAdvertisement.back')}
              </Button>
            </div>
          </div>

          {/* Header: Row 2 - Title + Actions */}
          <div className="flex items-start justify-between mb-6 py-2">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {ad[`title_${language}`] || ad.title_en}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('myWantedList.actions') || 'Actions'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/advertisements/edit/${ad.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('advertisements.edit')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('advertisements.delete') || 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Top row: Media (70%) | Statistics (30%) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              {images.length > 0 && (
                <MediaGallery
                  images={images.map((img: any) => ({
                    id: img.id,
                    filename: img.filename,
                    url: img.url,
                    thumbnail_url: (img as any).thumbnail_url || undefined,
                  }))}
                  title={t('createAdvertisement.media')}
                  cardClassName="w-full"
                />
              )}
            </div>
            <div className="md:col-span-1">
              <Card className="shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">{t('advertisements.status')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('advertisements.verificationStatus')}:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVerificationBadgeClass(ad.verification_status)}`}>
                      {ad.verification_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('advertisements.status')}:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ad.status)}`}>{ad.status}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{t('advertisements.stats')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" /> {t('advertisements.views')}:
                    </span>
                    <span className="font-medium">{ad.stats?.view_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" /> {t('advertisements.favorites')}:
                    </span>
                    <span className="font-medium">{ad.stats?.favorite_count ?? 0}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" /> {'Dates'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('advertisements.createdAt')}:</span>
                    <span className="font-medium">{formatYmd(ad.dates?.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{'Verified at'}:</span>
                    <span className="font-medium">{ad.dates?.verified_at? formatYmd(ad.dates?.verified_at) : '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{'Expiry at'}:</span>
                    <span className="font-medium">{ad.dates?.expires_at? formatYmd(ad.dates?.expires_at) : '-'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full-width Description */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('createAdvertisement.descriptionLabel')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{ad.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Location */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" /> {t('createAdvertisement.location')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('createAdvertisement.region')}:</span>
                    <span className="font-medium">{ad.location?.region?.[`name_${language}`] || ad.location?.region?.name_en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('createAdvertisement.township')}:</span>
                    <span className="font-medium">{ad.location?.township?.[`name_${language}`] || ad.location?.township?.name_en}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('createAdvertisement.address')}:</span>
                    <span className="font-medium">{ad.location?.address}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right: Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" /> {t('createAdvertisement.contactInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('createAdvertisement.contactName')}:</span>
                    <span className="font-medium">{ad.contact_info?.contact_name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('createAdvertisement.email')}:</span>
                    <span className="font-medium">{ad.contact_info?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('createAdvertisement.phoneNumbers')}:</span>
                    <span className="font-medium">{(ad.contact_info?.phone_numbers || []).join(', ') || '-'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Confirm Modal */}
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


