import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Eye, Heart, Edit, Phone, Trash2, Bath, Bed, Ruler, ThumbsUp, MessageCircle, Square, Star } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useModal } from '@/contexts/ModalContext';
import { propertyApi } from '@/services/api/properties';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyProperty } from '@/hooks/queries/useProperties';
import { MediaGallery } from '@/components/MediaGallery';

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const seo = seoUtils.getPageSEO('properties');
  const { data, isLoading, error } = useMyProperty(slug || '');

  // Compute data-dependent hooks unconditionally to keep hook order stable
  const property = (data?.data?.data || data?.data) as any;
  const formatYmd = (val?: string | null) => {
    if (!val || val === 'null' || val === null) return '-';
    return String(val).split('T')[0];
  };
  const images = useMemo(() => {
    const propertyWithMedia = property as any;
    const mediaArray = propertyWithMedia?.media?.images || propertyWithMedia?.media || [];
    return Array.isArray(mediaArray) ? mediaArray : [];
  }, [property]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const canEdit = !!property; // Allow edit if property exists (authenticated user's own property)
  
  // Confirm modal and toasts
  const { showSuccess } = useModal();
  const queryClient = useQueryClient();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  const handleDelete = () => {
    if (!property?.slug) return;
    showConfirm({
      title: t('properties.confirmDeleteTitle') || 'Confirm Delete',
      message: t('properties.confirmDeleteMessage') || 'Are you sure you want to delete this property? This action cannot be undone.',
      confirmText: t('properties.delete') || 'Delete',
      cancelText: t('properties.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: async () => {
        await propertyApi.deleteMyProperty(property.slug);
        queryClient.invalidateQueries({ queryKey: ['my-properties'] });
        showSuccess(t('properties.deleteSuccess') || 'Property deleted successfully!', t('properties.deleteSuccessTitle') || 'Success!');
        navigate('/properties');
      },
    });
  };

  // Badge color helpers
  const getVerificationBadgeClass = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'expired':
        return 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'draft':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
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
          <p className="text-muted-foreground">{t('properties.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12 flex items-center justify-center">
        <Card className="glass border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowLeft className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('properties.errorTitle') || 'Error'}</h3>
            <p className="text-muted-foreground mb-4">{t('properties.errorDesc') || 'Failed to load property details.'}</p>
            <Button onClick={() => navigate('/properties')} variant="outline">
              {t('properties.backToList') || 'Back to List'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead seo={seo} path={`/properties/detail/${slug}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header: Row 1 - Breadcrumb + Back */}
          <div className="flex items-center justify-between mb-3 py-2">
            <nav className="text-sm text-muted-foreground">
              <ol className="flex items-center gap-1">
                <li>
                  <Link to="/properties" className="text-primary hover:text-primary/80 transition-colors">
                    {t('properties.title') || 'Properties'}
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="text-muted-foreground">{t('properties.detail') || 'Detail'}</li>
              </ol>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" /> {t('properties.back') || 'Back'}
              </Button>
            </div>
          </div>

          {/* Header: Row 2 - Title + Actions */}
          <div className="flex items-start justify-between mb-6 py-2">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {property[`title_${language}`] || property.title_en}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{property.code}</span>
                {property.is_trending && (
                  <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    {t('premium.badge') || 'Premium'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('properties.actions') || 'Actions'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/properties/edit/${property.slug}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('properties.edit') || 'Edit'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('properties.delete') || 'Delete'}
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
                    filename: img.filename || img.original_filename || 'image',
                    url: img.url || img.medium_url || img.small_url || img.thumbnail_url,
                    thumbnail_url: img.thumbnail_url || img.small_url || img.url,
                  }))}
                  title={t('properties.media') || 'Media'}
                  cardClassName="w-full"
                />
              )}
            </div>
            <div className="md:col-span-1">
              <Card className="shadow-lg mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">{t('properties.status') || 'Status'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {property.verification_status && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground min-w-[120px]">{t('properties.verificationStatus') || 'Verification'}:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVerificationBadgeClass(property.verification_status)}`}>
                        {property.verification_status}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.status') || 'Status'}:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(property.status)}`}>
                      {property.status || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Property Flags/Badges */}
                  {(property.is_featured || property.is_trending || property.tan_tan_tan) && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-2">{t('properties.flags') || 'Flags'}:</div>
                      <div className="flex flex-wrap gap-2">
                        {property.is_featured && (
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/50">
                            <Star className="h-3 w-3 mr-1" />
                            {t('premium.badge') || 'Premium'}
                          </Badge>
                        )}
                        {property.is_trending && (
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/50">
                            <Star className="h-3 w-3 mr-1" />
                            {t('premium.badge') || 'Premium'}
                          </Badge>
                        )}
                        {property.tan_tan_tan && (
                          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                            {t('categories.tantantan') || 'Tantantan'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{t('properties.stats') || 'Statistics'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" /> {t('properties.views') || 'Views'}:
                    </span>
                    <span className="font-medium">{property.stats?.view_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" /> {t('properties.favorites') || 'Favorites'}:
                    </span>
                    <span className="font-medium">{property.stats?.favorite_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-blue-500" /> {t('properties.likes') || 'Likes'}:
                    </span>
                    <span className="font-medium">{property.stats?.like_count ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-500" /> {t('properties.comments') || 'Comments'}:
                    </span>
                    <span className="font-medium">{property.stats?.comment_count ?? 0}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" /> {t('properties.dates') || 'Dates'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.createdAt') || 'Created'}:</span>
                    <span className="font-medium">
                      {(property.dates?.created_at || (property as any).created_at) 
                        ? formatYmd(property.dates?.created_at || (property as any).created_at) 
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.publishedAt') || 'Published'}:</span>
                    <span className="font-medium">
                      {(property.dates?.published_at || (property as any).published_at) 
                        ? formatYmd(property.dates?.published_at || (property as any).published_at) 
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.verifiedAt') || 'Verified'}:</span>
                    <span className="font-medium">
                      {(property.dates?.verified_at || (property as any).verified_at) 
                        ? formatYmd(property.dates?.verified_at || (property as any).verified_at) 
                        : '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.expiresAt') || 'Expires'}:</span>
                    <span className="font-medium">
                      {(property.dates?.expires_at || (property as any).expires_at) 
                        ? formatYmd(property.dates?.expires_at || (property as any).expires_at) 
                        : '-'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Property Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{t('properties.details') || 'Property Details'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[120px]">{t('properties.type') || 'Type'}:</span>
                  <span className="font-medium">
                    {property.property_type?.[`name_${language}`] || property.property_type?.name_en || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[120px]">{t('properties.listingType') || 'Listing Type'}:</span>
                  <span className="font-medium">
                    {property.listing_type?.[`name_${language}`] || property.listing_type?.name_en || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[120px]">{t('properties.condition') || 'Condition'}:</span>
                  <span className="font-medium">
                    {property.property_condition?.value === 'ready' 
                      ? (language === 'mm' ? 'အားလုံး ပြင်ဆင်ထားပြီး' : 'Ready Decoration')
                      : property.property_condition?.value === 'some'
                      ? (language === 'mm' ? 'တချို့တစ်ဝက် ပြင်ဆင်ထားပြီး' : 'Some Decoration')
                      : property.property_condition?.value === 'no'
                      ? (language === 'mm' ? 'အကြမ်းထည်' : 'No Decoration')
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground min-w-[120px]">{t('properties.price') || 'Price'}:</span>
                  <span className="font-medium text-primary">{property.formatted_price || property.price || '-'}</span>
                </div>
                {property.bank_installment_available && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                      {t('properties.bankInstallmentAvailable') || 'Bank Installment Available'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">{t('properties.specifications') || 'Specifications'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="min-w-[120px] inline-flex items-center gap-2">
                    <Square className="h-4 w-4" /> {t('properties.area') || 'Area'}:
                  </span>
                  <span className="font-medium">{property.area_sqft ? `${property.area_sqft} ${t('properties.sqft') || 'sqft'}` : '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[120px] inline-flex items-center gap-2">
                    <Bed className="h-4 w-4" /> {t('properties.bedrooms') || 'Bedrooms'}:
                  </span>
                  <span className="font-medium">{property.bedrooms ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[120px] inline-flex items-center gap-2">
                    <Bath className="h-4 w-4" /> {t('properties.bathrooms') || 'Bathrooms'}:
                  </span>
                  <span className="font-medium">{property.bathrooms ?? 0}</span>
                </div>
                {property.length && (
                  <div className="flex items-center gap-2">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> {t('properties.length') || 'Length'}:
                    </span>
                    <span className="font-medium">{property.length} {t('properties.ft') || 'ft'}</span>
                  </div>
                )}
                {property.width && (
                  <div className="flex items-center gap-2">
                    <span className="min-w-[120px] inline-flex items-center gap-2">
                      <Ruler className="h-4 w-4" /> {t('properties.width') || 'Width'}:
                    </span>
                    <span className="font-medium">{property.width} {t('properties.ft') || 'ft'}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Full-width Description */}
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t('properties.description') || 'Description'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{property.description || '-'}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Location */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" /> {t('properties.location') || 'Location'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.region') || 'Region'}:</span>
                    <span className="font-medium">
                      {property.location?.region?.[`name_${language}`] || property.location?.region?.name_en || '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.township') || 'Township'}:</span>
                    <span className="font-medium">
                      {property.location?.township?.[`name_${language}`] || property.location?.township?.name_en || '-'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.address') || 'Address'}:</span>
                    <span className="font-medium">{property.location?.address || '-'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right: Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" /> {t('properties.contactInformation') || 'Contact Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.contactName') || 'Contact Name'}:</span>
                    <span className="font-medium">{property.contact_info?.owner_name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.email') || 'Email'}:</span>
                    <span className="font-medium">{property.contact_info?.email || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground min-w-[120px]">{t('properties.phoneNumbers') || 'Phone Numbers'}:</span>
                    <span className="font-medium">{(property.contact_info?.phone_numbers || []).join(', ') || '-'}</span>
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

