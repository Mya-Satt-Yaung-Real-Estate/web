import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Eye, Heart, Edit, Phone, Trash2, Bath, Bed, Ruler, ThumbsUp, MessageCircle, Square, Star, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useModal } from '@/contexts/ModalContext';
import { propertyApi } from '@/services/api/properties';
import { pointSettingsApi } from '@/services/api/pointSettings';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMyProperty } from '@/hooks/queries/useProperties';
import { MediaGallery } from '@/components/MediaGallery';

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const seo = seoUtils.getPageSEO('properties');
  const { data, isLoading, error } = useMyProperty(slug || '');

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

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
  const { showSuccess, showError } = useModal();
  const queryClient = useQueryClient();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  // Status change dialog state
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'draft' | 'published' | 'sold' | 'rented' | null>(null);
  const [pointSettings, setPointSettings] = useState<any>(null);
  const [loadingPointSettings, setLoadingPointSettings] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Renewal dialog state
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [renewalPointSettings, setRenewalPointSettings] = useState<any>(null);
  const [loadingRenewalPointSettings, setLoadingRenewalPointSettings] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  const handleDelete = () => {
    if (!property?.slug) return;
    showConfirm({
      title: t('properties.confirmDeleteTitle') || 'Confirm Delete',
      message: t('properties.confirmDeleteMessage') || 'Are you sure you want to delete this property? This action cannot be undone.',
      confirmText: t('properties.delete') || 'Delete',
      cancelText: t('properties.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: async () => {
        try {
          await propertyApi.deleteMyProperty(property.slug);
          // Invalidate all property-related queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['my-properties'] });
          queryClient.invalidateQueries({ queryKey: ['my-property', property.slug] });
          showSuccess(t('properties.deleteSuccess') || 'Property deleted successfully!', t('properties.deleteSuccessTitle') || 'Success!');
          // Redirect to list page - it will automatically refetch due to invalidated queries
          navigate('/my-properties');
        } catch (err: any) {
          console.error('Delete error:', err);
          const msg = err?.response?.data?.message || err?.message || t('properties.deleteError') || 'Failed to delete property';
          showError(msg, t('common.error') || 'Error');
        }
      },
    });
  };

  // Handle status change
  const handleStatusChange = async (newStatus: 'draft' | 'published' | 'sold' | 'rented') => {
    if (!property?.slug) return;
    
    const currentStatus = property.status as 'draft' | 'published' | 'sold' | 'rented';
    
    // Only allow: draft → published, published → sold, published → rented
    if (currentStatus === 'draft' && newStatus === 'published') {
      // Draft → Published: Show confirmation dialog
      setPendingStatus(newStatus);
      setShowStatusChangeDialog(true);
      // Fetch point settings
      setLoadingPointSettings(true);
      try {
        const response = await pointSettingsApi.getPointSettings();
        if (response.data && response.data.data) {
          setPointSettings(response.data.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch point settings:', err);
        showError(err?.response?.data?.message || err?.message || 'Failed to load fee information', t('common.error') || 'Error');
        setLoadingPointSettings(false);
        setShowStatusChangeDialog(false);
        return;
      }
      setLoadingPointSettings(false);
    } else if (currentStatus === 'published' && (newStatus === 'sold' || newStatus === 'rented')) {
      // Published → Sold/Rented: Only allow if verification status is approved
      if (property?.verification_status !== 'approved') {
        showError(
          t('editProperty.propertyMustBeApproved') || 'Property must be approved before changing status to sold or rented',
          t('common.error') || 'Error'
        );
        return;
      }
      // Update directly
      await updateStatus(newStatus);
    } else {
      // Block all other transitions
      showError(
        t('editProperty.invalidStatusChange') || 'This status change is not allowed',
        t('common.error') || 'Error'
      );
    }
  };

  // Update status
  const updateStatus = async (newStatus: 'draft' | 'published' | 'sold' | 'rented') => {
    if (!property?.slug) return;
    
    setIsUpdatingStatus(true);
    try {
      // Use dedicated status update endpoint
      await propertyApi.updateMyPropertyStatus(property.slug, newStatus);
      
      // Refetch property data
      queryClient.invalidateQueries({ queryKey: ['my-property', property.slug] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      
      showSuccess(
        t('properties.statusUpdateSuccess') || 'Status updated successfully!',
        t('properties.statusUpdateSuccessTitle') || 'Success!'
      );
      
      setShowStatusChangeDialog(false);
      setPendingStatus(null);
      setPointSettings(null);
    } catch (err: any) {
      console.error('Status update error:', err);
      const msg = err?.response?.data?.message || err?.message || t('properties.statusUpdateError') || 'Failed to update status';
      showError(msg, t('common.error') || 'Error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Fetch point settings when dialog opens
  useEffect(() => {
    if (showStatusChangeDialog && !pointSettings && !loadingPointSettings && pendingStatus === 'published') {
      const fetchPointSettings = async () => {
        setLoadingPointSettings(true);
        try {
          const response = await pointSettingsApi.getPointSettings();
          if (response.data && response.data.data) {
            setPointSettings(response.data.data);
          }
        } catch (err: any) {
          console.error('Failed to fetch point settings:', err);
          showError(err?.response?.data?.message || err?.message || 'Failed to load fee information', t('common.error') || 'Error');
          setShowStatusChangeDialog(false);
        } finally {
          setLoadingPointSettings(false);
        }
      };
      fetchPointSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStatusChangeDialog]);

  // Handle renewal button click
  const handleRenewClick = async () => {
    if (!property?.slug) return;
    
    setShowRenewalDialog(true);
    setLoadingRenewalPointSettings(true);
    try {
      const response = await pointSettingsApi.getPointSettings();
      if (response.data && response.data.data) {
        setRenewalPointSettings(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch point settings:', err);
      showError(err?.response?.data?.message || err?.message || 'Failed to load fee information', t('common.error') || 'Error');
      setShowRenewalDialog(false);
    } finally {
      setLoadingRenewalPointSettings(false);
    }
  };

  // Handle renewal confirmation
  const handleRenewConfirm = async () => {
    if (!property?.slug) return;
    
    setIsRenewing(true);
    try {
      await propertyApi.renewMyProperty(property.slug);
      
      // Refetch property data
      queryClient.invalidateQueries({ queryKey: ['my-property', property.slug] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      
      showSuccess(
        t('properties.renewalSuccess') || 'Property renewed successfully!',
        t('properties.renewalSuccessTitle') || 'Success!'
      );
      
      setShowRenewalDialog(false);
      setRenewalPointSettings(null);
    } catch (err: any) {
      console.error('Renewal error:', err);
      const msg = err?.response?.data?.message || err?.message || t('properties.renewalError') || 'Failed to renew property';
      showError(msg, t('common.error') || 'Error');
    } finally {
      setIsRenewing(false);
    }
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
            <Button onClick={() => navigate('/my-properties')} variant="outline">
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
                  <Link to="/my-properties" className="text-primary hover:text-primary/80 transition-colors">
                    {t('properties.title') || 'Properties'}
                  </Link>
                </li>
                <li className="mx-1">/</li>
                <li className="text-muted-foreground">{t('properties.detail') || 'Detail'}</li>
              </ol>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/my-properties')} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" /> {t('properties.back') || 'Back'}
              </Button>
            </div>
          </div>

          {/* Warning Message for Sold/Rented Properties */}
          {property?.verification_status === 'approved' && (property?.status === 'sold' || property?.status === 'rented') && (
            <div className="mb-6 rounded-lg border border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20 shadow-lg">
              <div className="px-5 pt-5 pb-5">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20">
                      <span className="text-orange-600 dark:text-orange-400 text-lg">ℹ️</span>
                    </div>
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                      {property?.status === 'sold' 
                        ? (t('editProperty.alreadySoldMessage') || 'This property is already sold. You cannot edit or update this property.')
                        : (t('editProperty.alreadyRentedMessage') || 'This property is already rented. You cannot edit or update this property.')
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header: Row 2 - Title + Actions */}
          <div className="flex items-start justify-between mb-6 py-2">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                {property[`title_${language}`] || property.title_en}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{property.code}</span>
                {property.is_expired && (
                  <span className="inline-flex items-center rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                    {t('properties.expired') || 'Expired'}
                  </span>
                )}
                {property.is_trending && (
                  <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                    {t('premium.badge') || 'Premium'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && !(property?.verification_status === 'approved' && (property?.status === 'sold' || property?.status === 'rented')) && (
                <>
                  {/* Renew Button - Show if property is expired */}
                  {property?.is_expired && (
                    <Button 
                      onClick={handleRenewClick}
                      disabled={isRenewing}
                      variant="default"
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {isRenewing ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          {t('properties.renewing') || 'Renewing...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {t('properties.renew') || 'Renew'}
                        </>
                      )}
                    </Button>
                  )}
                  
                  {/* Change Status Dropdown */}
                  <Select
                    value={property?.status || ''}
                    onValueChange={(v) => handleStatusChange(v as 'draft' | 'published' | 'sold' | 'rented')}
                    disabled={isUpdatingStatus || property?.status === 'sold' || property?.status === 'rented'}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('properties.status') || 'Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem 
                        value="draft"
                        disabled={property?.status === 'published' || property?.status === 'sold' || property?.status === 'rented'}
                      >
                        {t('createAdvertisement.draft') || 'Draft'}
                      </SelectItem>
                      <SelectItem 
                        value="published"
                        disabled={property?.status === 'published' || property?.status === 'sold' || property?.status === 'rented'}
                      >
                        {t('createAdvertisement.published') || 'Published'}
                      </SelectItem>
                      <SelectItem 
                        value="sold"
                        disabled={
                          property?.status === 'draft' || 
                          property?.status === 'sold' || 
                          property?.status === 'rented' ||
                          (property?.status === 'published' && property?.verification_status !== 'approved')
                        }
                      >
                        {t('editProperty.sold') || 'Sold'}
                      </SelectItem>
                      <SelectItem 
                        value="rented"
                        disabled={
                          property?.status === 'draft' || 
                          property?.status === 'sold' || 
                          property?.status === 'rented' ||
                          (property?.status === 'published' && property?.verification_status !== 'approved')
                        }
                      >
                        {t('editProperty.rented') || 'Rented'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Edit className="h-4 w-4 mr-2" />
                        {t('properties.actions') || 'Actions'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/my-properties/edit/${property.slug}`}>
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
                </>
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
                    type: img.type || 'image',
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

          {/* Features & Amenities */}
          {property?.features && Array.isArray(property.features) && property.features.length > 0 && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('createProperty.propertyFeatures') || 'Feature & Amenities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature: string) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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

              {/* Google Map - Show if latitude and longitude are available */}
              {property.location?.latitude && property.location?.longitude && (
                <Card className="shadow-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" /> {t('properties.map') || 'Map'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-96 w-full">
                      <iframe
                        src={`https://www.google.com/maps?q=${property.location.latitude},${property.location.longitude}&z=15&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={t('properties.mapLocation') || 'Property Location'}
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
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

          {/* Comments Section */}
          {property?.comments && Array.isArray(property.comments) && property.comments.length > 0 && (() => {
            // Calculate total count including replies
            const totalComments = property.comments.reduce((total: number, comment: any) => {
              const replyCount = comment.replies && Array.isArray(comment.replies) ? comment.replies.length : 0;
              return total + 1 + replyCount; // 1 for the comment itself + replies
            }, 0);
            
            return (
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-primary" /> {t('properties.comments') || 'Comments'} ({totalComments})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {property.comments.map((comment: any) => (
                    <div key={comment.id} className="space-y-4">
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-[#4a9b82]">
                          {comment.profile_link ? (
                            <img
                              src={comment.profile_link}
                              alt={comment.user_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                                      ${comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                  `;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                              {comment.user_name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{comment.user_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.created_at ? new Date(comment.created_at).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : '-'}
                            </span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{comment.comment}</p>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div className="ml-12 space-y-4 border-l-2 border-border/50 pl-4">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary to-[#4a9b82]">
                                {reply.profile_link ? (
                                  <img
                                    src={reply.profile_link}
                                    alt={reply.user_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                          <div class="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                                            ${reply.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                          </div>
                                        `;
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                                    {reply.user_name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-foreground">{reply.user_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {reply.created_at ? new Date(reply.created_at).toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    }) : '-'}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap">{reply.comment}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            );
          })()}
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

      {/* Status Change Confirmation Dialog - Only for draft to published */}
      <Dialog
        open={showStatusChangeDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowStatusChangeDialog(false);
            setPendingStatus(null);
            setPointSettings(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-left">
                  {t('editProperty.confirmPublishTitle') || 'Confirm Publishing Property'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {t('editProperty.confirmPublishDescription') || 'You are publishing this property. Upload fees will apply.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {loadingPointSettings ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground font-medium">
                {t('createProperty.loadingFees') || 'Loading fee information...'}
              </p>
            </div>
          ) : pointSettings ? (
            <div className="py-4">
              <div className="overflow-hidden border border-border rounded-lg">
                <table className="w-full border-collapse">
                  <tbody className="divide-y divide-border">
                    {/* Upload Fee */}
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('createProperty.uploadFee') || 'Upload Fee'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                        {pointSettings.upload_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                      </td>
                    </tr>
                    
                    {/* Premium Fee - Show if property has premium */}
                    {property?.is_trending && pointSettings.premium_property_info && (
                      <tr className="hover:bg-muted/30 transition-colors bg-yellow-50/30 dark:bg-yellow-950/10">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{t('createProperty.premiumFee') || 'Premium Fee'}</span>
                            <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                              Premium
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                          {pointSettings.premium_property_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="bg-primary/5 border-t-2 border-primary/20">
                      <td className="px-4 py-4 text-right text-sm font-semibold text-foreground">
                        {t('createProperty.totalFee') || 'Total'}
                      </td>
                      <td className="px-4 py-4 text-right text-base font-bold text-primary">
                        {(
                          (pointSettings.upload_info?.point_amount || 0) +
                          (property?.is_trending ? (pointSettings.premium_property_info?.point_amount || 0) : 0)
                        )} {t('createProperty.points') || 'Points'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Validity Period Info */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  <CheckCircle2 className="inline h-3 w-3 mr-1" />
                  {t('createProperty.uploadFeeDesc') || 'Valid for'} <span className="font-medium text-foreground">{pointSettings.upload_info?.days || 0}</span> {t('createProperty.days') || 'days'}
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowStatusChangeDialog(false);
                setPointSettings(null);
                setPendingStatus(null);
              }}
              disabled={loadingPointSettings || isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={() => pendingStatus && updateStatus(pendingStatus)}
              disabled={loadingPointSettings || isUpdatingStatus || !pointSettings}
              className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 w-full sm:w-auto"
            >
              {isUpdatingStatus ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t('editProperty.updating') || 'Updating...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('createProperty.confirmSubmit') || 'Confirm & Publish'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renewal Confirmation Dialog */}
      <Dialog
        open={showRenewalDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowRenewalDialog(false);
            setRenewalPointSettings(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-left">
                  {t('properties.confirmRenewalTitle') || 'Confirm Property Renewal'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {t('properties.confirmRenewalDescription') || 'You are renewing this property. Renewal fees will apply.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {loadingRenewalPointSettings ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground font-medium">
                {t('createProperty.loadingFees') || 'Loading fee information...'}
              </p>
            </div>
          ) : renewalPointSettings ? (
            <div className="py-4">
              <div className="overflow-hidden border border-border rounded-lg">
                <table className="w-full border-collapse">
                  <tbody className="divide-y divide-border">
                    {/* Renewal Fee */}
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {t('properties.renewalFee') || 'Renewal Fee'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                        {renewalPointSettings.renewal_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-orange-500/5 border-t-2 border-orange-500/20">
                      <td className="px-4 py-4 text-right text-sm font-semibold text-foreground">
                        {t('createProperty.totalFee') || 'Total'}
                      </td>
                      <td className="px-4 py-4 text-right text-base font-bold text-orange-500">
                        {renewalPointSettings.renewal_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Validity Period Info */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  <CheckCircle2 className="inline h-3 w-3 mr-1" />
                  {t('properties.renewalFeeDesc') || 'Valid for'} <span className="font-medium text-foreground">{renewalPointSettings.renewal_info?.days || 0}</span> {t('createProperty.days') || 'days'}
                </p>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRenewalDialog(false);
                setRenewalPointSettings(null);
              }}
              disabled={loadingRenewalPointSettings || isRenewing}
              className="w-full sm:w-auto"
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleRenewConfirm}
              disabled={loadingRenewalPointSettings || isRenewing || !renewalPointSettings}
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 w-full sm:w-auto"
            >
              {isRenewing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t('properties.renewing') || 'Renewing...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('properties.confirmRenewal') || 'Confirm & Renew'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

