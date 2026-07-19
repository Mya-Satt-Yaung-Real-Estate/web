/**
 * Public Property Detail Page
 * 
 * Displays detailed information about a public property.
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePublicProperty } from '@/hooks/queries/usePublicProperties';
import { publicPropertyApi } from '@/services/api/publicProperties';
import { publicPropertyKeys } from '@/services/queries/publicProperties';
import { pointSettingsApi } from '@/services/api/pointSettings';
import { homeKeys } from '@/services/queries/home';
import { SEOHead } from '@/components/seo/SEOHead';
import { Helmet } from 'react-helmet-async';
import { generateCanonicalUrl } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { PropertyGallery, PropertyDetailsCard, ContactOwnerCard, QuickActionsCard, LocationCard, PropertyDetailCompanyLogosCard, DetailSidebarAdsCard, SimilarPropertiesSection } from './components';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import type { PublicPropertyDetailResponse } from '@/types/publicProperties';

export default function PublicPropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { isAuthenticated, token, user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = usePublicProperty(slug || '');
  
  // State
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  // Favorite mutation - must be called before conditional returns
  const toggleFavoriteMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleFavorite(slug),
    onSuccess: (response) => {
      const isFavorited = response.data?.data?.is_favorited ?? false;
      setIsFavorite(isFavorited);
      
      // Invalidate all property list queries
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      toast.success(isFavorited 
        ? (t('propertyDetail.addedToFavorites') || 'Added to favorites')
        : (t('propertyDetail.removedFromFavorites') || 'Removed from favorites')
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('propertyDetail.favoriteError') || 'Failed to update favorite status';
      toast.error(errorMessage);
    },
  });

  // Like mutation - must be called before conditional returns
  const toggleLikeMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleLike(slug),
    onSuccess: (response) => {
      const isLiked = response.data?.data?.liked ?? false;
      setIsLiked(isLiked);
      
      // Invalidate all property list queries
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      
      toast.success(isLiked 
        ? (t('propertyDetail.liked') || 'Liked!')
        : (t('propertyDetail.unliked') || 'Unliked')
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('propertyDetail.likeError') || 'Failed to update like status';
      toast.error(errorMessage);
    },
  });

  // Comment mutations - must be called before conditional returns
  const addCommentMutation = useMutation({
    mutationFn: ({ slug, comment }: { slug: string; comment: string }) => 
      publicPropertyApi.addComment(slug, comment),
    onSuccess: (_response, variables) => {
      // Invalidate property detail to refresh comments
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(variables.slug) });
      toast.success(t('propertyDetail.commentAdded') || 'Comment added successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('propertyDetail.commentError') || 'Failed to add comment';
      toast.error(errorMessage);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ slug, commentId, comment }: { slug: string; commentId: number; comment: string }) => 
      publicPropertyApi.updateComment(slug, commentId, comment),
    onSuccess: (_response, variables) => {
      // Invalidate property detail to refresh comments
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(variables.slug) });
      toast.success(t('propertyDetail.commentUpdated') || 'Comment updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('propertyDetail.commentUpdateError') || 'Failed to update comment';
      toast.error(errorMessage);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ slug, commentId }: { slug: string; commentId: number }) => 
      publicPropertyApi.deleteComment(slug, commentId),
    onSuccess: (_response, variables) => {
      // Invalidate property detail to refresh comments
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(variables.slug) });
      toast.success(t('propertyDetail.commentDeleted') || 'Comment deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('propertyDetail.commentDeleteError') || 'Failed to delete comment';
      toast.error(errorMessage);
    },
  });

  const replyToCommentMutation = useMutation({
    mutationFn: ({ slug, commentId, comment }: { slug: string; commentId: number; comment: string }) => 
      publicPropertyApi.replyToComment(slug, commentId, comment),
    onSuccess: (_response, variables) => {
      // Invalidate property detail to refresh comments
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(variables.slug) });
      toast.success(t('propertyDetail.replyAdded') || 'Reply added successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('propertyDetail.replyError') || 'Failed to add reply';
      toast.error(errorMessage);
    },
  });

  // Prepare property data - use empty object as fallback to ensure hooks always run
  const property = data?.data?.data || null;
  const isOwnerInfoLocked = Boolean(property?.owner_information_lock);

  const {
    data: pointSettings,
    isLoading: isPointSettingsLoading,
    isError: isPointSettingsError,
  } = useQuery({
    queryKey: ['point-settings'],
    queryFn: async () => {
      const response = await pointSettingsApi.getPointSettings();
      return response.data?.data;
    },
    enabled: isOwnerInfoLocked || unlockModalOpen,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const unlockPointAmount = pointSettings?.unlock_property_info?.point_amount;

  const userPointBalance =
    user?.current_point ?? user?.point_balance ?? user?.points ?? 0;

  const hasInsufficientPoints =
    Boolean(token) &&
    unlockPointAmount != null &&
    !isPointSettingsLoading &&
    userPointBalance < unlockPointAmount;

  const insufficientFromApi =
    !!unlockError &&
    /insufficient|not enough points|required points/i.test(unlockError.toLowerCase());

  const insufficientMode = hasInsufficientPoints || insufficientFromApi;

  const unlockMutation = useMutation({
    mutationFn: async () => {
      const res = await publicPropertyApi.unlockPublicPropertyDetail(slug || '');
      return res.data as PublicPropertyDetailResponse;
    },
    onMutate: () => setUnlockError(null),
    onSuccess: (response) => {
      setUnlockModalOpen(false);
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(slug || '') });

      const apiMessage = response?.message?.trim();
      if (apiMessage) {
        toast.success(apiMessage);
      } else if (unlockPointAmount != null) {
        toast.success(
          language === 'mm'
            ? `ပွိုင့် ${unlockPointAmount} ဖြတ်ထားပြီး ဆက်သွယ်ရန်အချက်အလက် ဖွင့်ပြီးပါပြီ။`
            : `${unlockPointAmount} points deducted. Contact details are now visible.`
        );
      } else {
        toast.success(
          language === 'mm'
            ? 'ဆက်သွယ်ရန်အချက်အလက် ဖွင့်ပြီးပါပြီ။'
            : 'Contact information unlocked successfully.'
        );
      }
    },
    onError: (err: Error) => {
      const msg = err.message || 'Unlock failed';
      setUnlockError(msg);
      toast.error(msg);
    },
  });

  // Initialize favorite and like state from API
  useEffect(() => {
    if (property) {
      setIsFavorite(property.is_favorited);
      setIsLiked(property.is_liked);
    }
  }, [property]);

  // Reset image index when property or images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property?.id, property?.media?.images?.length]);
  
  const seoBaseUrl = 'https://jade-property.com';

  const toAbsoluteUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const normalized = url.startsWith('/') ? url : `/${url}`;
    return `${seoBaseUrl}${normalized}`;
  };

  // Get title based on language - prefer language-specific version, fallback to other language
  const title = useMemo(() => {
    if (!property) return '';
    if (language === 'mm') {
      return (property.title_mm && property.title_mm.trim()) ? property.title_mm : (property.title_en || '');
    }
    return (property.title_en && property.title_en.trim()) ? property.title_en : (property.title_mm || '');
  }, [property, language]);
  
  // Description is the same for both languages (from API response)
  const description = property?.description || '';
  const titleEn = property?.title_en?.trim() || '';
  const titleMm = property?.title_mm?.trim() || '';
  
  // Prepare images and videos for MediaGallery - must be called before conditional returns
  const galleryImages = useMemo(() => {
    if (!property?.media) {
      console.log('PropertyGallery - No media found');
      return [];
    }
    
    const media: any[] = [];
    
    // Add primary image first if it exists and is not already in images array
    if (property.media.primary_image) {
      const primaryImg = property.media.primary_image;
      const primaryExists = property.media.images?.some((img: any) => img.id === primaryImg.id);
      if (!primaryExists) {
        media.push({
          id: primaryImg.id || Date.now(),
          filename: primaryImg.filename || 'primary-image',
          url: primaryImg.url || primaryImg.medium_url || primaryImg.small_url || primaryImg.thumbnail_url,
          thumbnail_url: primaryImg.thumbnail_url || primaryImg.small_url || primaryImg.url,
          type: primaryImg.type || 'image',
        });
      }
    }
    
    // Add all images and videos from the images array
    if (property.media.images && Array.isArray(property.media.images)) {
      property.media.images.forEach((img: any) => {
        media.push({
          id: img.id,
          filename: img.filename || (img.type === 'video' ? 'video' : 'image'),
          url: img.url || img.medium_url || img.small_url || img.thumbnail_url,
          thumbnail_url: img.thumbnail_url || img.small_url || img.url,
          type: img.type || 'image',
        });
      });
    }
    
    console.log('PropertyGallery - Prepared media:', media.length, media);
    return media;
  }, [property?.media]);

  // Get location string - memoized - must be called before conditional returns
  const locationString = useMemo(() => {
    if (!property?.location) return '';
    if (language === 'mm') {
      return (property.location.location_string_mm && property.location.location_string_mm.trim())
        ? property.location.location_string_mm
        : (property.location.location_string || '');
    }
    return (property.location.location_string && property.location.location_string.trim())
      ? property.location.location_string
      : (property.location.location_string_mm || '');
  }, [property?.location, language]);

  // Get property type name - memoized
  const propertyTypeName = useMemo(() => {
    if (!property?.property_type) return '';
    if (language === 'mm') {
      return (property.property_type.name_mm && property.property_type.name_mm.trim()) 
        ? property.property_type.name_mm 
        : (property.property_type.name_en || '');
    }
    return (property.property_type.name_en && property.property_type.name_en.trim())
      ? property.property_type.name_en
      : (property.property_type.name_mm || '');
  }, [property?.property_type, language]);

  // Get listing type name - memoized
  const listingTypeName = useMemo(() => {
    if (!property?.listing_type) return '';
    if (language === 'mm') {
      return (property.listing_type.name_mm && property.listing_type.name_mm.trim())
        ? property.listing_type.name_mm
        : (property.listing_type.name_en || '');
    }
    return (property.listing_type.name_en && property.listing_type.name_en.trim())
      ? property.listing_type.name_en
      : (property.listing_type.name_mm || '');
  }, [property?.listing_type, language]);

  // Get property condition label - memoized
  const propertyConditionLabel = useMemo(() => {
    if (!property?.property_condition) return '';
    if (language === 'mm') {
      return (property.property_condition.label_mm && property.property_condition.label_mm.trim())
        ? property.property_condition.label_mm
        : (property.property_condition.label_en || '');
    }
    return (property.property_condition.label_en && property.property_condition.label_en.trim())
      ? property.property_condition.label_en
      : (property.property_condition.label_mm || '');
  }, [property?.property_condition, language]);


  // Map location for MapView - must be called before conditional returns
  const mapLocation = useMemo(() => {
    if (!property?.location || !property.location.latitude || !property.location.longitude) return null;
    return {
      id: property.id.toString(),
      title: title,
      location: locationString,
      lat: parseFloat(property.location.latitude),
      lng: parseFloat(property.location.longitude),
      type: listingTypeName,
    };
  }, [property?.location, property?.id, title, locationString, listingTypeName]);

  const seoImage = toAbsoluteUrl(
    property?.media?.primary_image?.url ||
    property?.media?.images?.[0]?.url ||
    '/jade.png'
  );

  const schemaImages = galleryImages
    .filter((media) => media.type !== 'video')
    .map((media) => toAbsoluteUrl(media.url))
    .filter(Boolean);

  const priceValue = property?.price
    ? Number(String(property.price).replace(/[^\d.]/g, ''))
    : undefined;

  const structuredData = property ? {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: titleEn || titleMm || title,
    alternateName: titleMm || undefined,
    description: description || undefined,
    image: schemaImages.length ? schemaImages : undefined,
    url: generateCanonicalUrl(`/properties/${slug}`, seoBaseUrl),
    inLanguage: language === 'mm' ? 'my-MM' : 'en-US',
    datePosted: property?.dates?.published_at || property?.dates?.created_at,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location?.address || undefined,
      addressLocality: property.location?.township?.name_en || undefined,
      addressRegion: property.location?.region?.name_en || undefined,
      addressCountry: 'MM',
    },
    geo: property.location?.latitude && property.location?.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.location.latitude,
      longitude: property.location.longitude,
    } : undefined,
    floorSize: property.area_sqft ? {
      '@type': 'QuantitativeValue',
      value: Number(String(property.area_sqft).replace(/[^\d.]/g, '')),
      unitCode: 'SQF',
    } : undefined,
    numberOfBedrooms: property.bedrooms || undefined,
    numberOfBathroomsTotal: property.bathrooms || undefined,
    offers: priceValue ? {
      '@type': 'Offer',
      priceCurrency: 'MMK',
      price: priceValue,
      availability: 'https://schema.org/InStock',
    } : undefined,
    seller: property.user?.name ? {
      '@type': 'Person',
      name: property.user.name,
    } : undefined,
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t('propertyDetail.notFound') || 'Property Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('propertyDetail.notFoundMessage') || 'The property you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Button onClick={() => navigate('/search')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('propertyDetail.backToListings') || 'Back to Listings'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('propertyDetail.justNow') || 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${t('propertyDetail.minutesAgo') || 'm ago'}`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${t('propertyDetail.hoursAgo') || 'h ago'}`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}${t('propertyDetail.daysAgo') || 'd ago'}`;
    
    return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handlers
  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.signInToFavorite') || 'Please sign in to add to favorites');
      navigate('/signin');
      return;
    }
    if (!slug) return;
    toggleFavoriteMutation.mutate(slug);
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error(t('propertyDetail.signInToLike') || 'Please sign in to like');
      navigate('/signin');
      return;
    }
    if (!slug) return;
    toggleLikeMutation.mutate(slug);
  };


  const handleContactOwner = () => {
    if (property?.contact_info?.phone_numbers && property.contact_info.phone_numbers.length > 0) {
      const phoneNumber = property.contact_info.phone_numbers[0];
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleRequestUnlock = () => {
    setUnlockError(null);
    setUnlockModalOpen(true);
  };

  const handleConfirmUnlock = () => {
    if (!slug) {
      setUnlockModalOpen(false);
      return;
    }
    if (!token) {
      setUnlockModalOpen(false);
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    if (insufficientMode) {
      setUnlockModalOpen(false);
      setUnlockError(null);
      navigate(
        `/point-management?returnTo=${encodeURIComponent(location.pathname + location.search)}`
      );
      return;
    }
    unlockMutation.mutate();
  };


  return (
    <>
      <SEOHead 
        seo={{
          title: title,
          description: description,
          keywords: `${title}, ${locationString}, ${propertyTypeName}, ${listingTypeName}, property, real estate`,
          image: seoImage,
        }}
        path={`/properties/${slug}`}
      />
      {structuredData && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('propertyDetail.backToListings') || 'Back to Listings'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Image/Video Gallery */}
              {property && galleryImages.length > 0 && (
                <PropertyGallery
                  property={property}
                  title={title}
                  galleryImages={galleryImages}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  isFavorite={isFavorite}
                  onFavorite={handleFavorite}
                  shareUrl={window.location.href}
                  t={t}
                />
              )}

            {/* Property Details */}
            {property && slug && (
              <PropertyDetailsCard
                property={property}
                title={title}
                description={description}
                locationString={locationString}
                listingTypeName={listingTypeName}
                propertyTypeName={propertyTypeName}
                propertyConditionLabel={propertyConditionLabel}
                isLiked={isLiked}
                onLike={handleLike}
                formatTimestamp={formatTimestamp}
                isAuthenticated={isAuthenticated}
                onAddComment={(comment) => {
                  if (!isAuthenticated) {
                    toast.error(t('propertyDetail.signInToComment') || 'Please sign in to comment');
                    navigate('/signin');
                    return;
                  }
                  addCommentMutation.mutate({ slug, comment });
                }}
                onUpdateComment={(commentId, comment) => {
                  updateCommentMutation.mutate({ slug, commentId, comment });
                }}
                onDeleteComment={(commentId) => {
                  deleteCommentMutation.mutate({ slug, commentId });
                }}
                onReplyToComment={(commentId, comment) => {
                  if (!isAuthenticated) {
                    toast.error(t('propertyDetail.signInToReply') || 'Please sign in to reply');
                    navigate('/signin');
                    return;
                  }
                  replyToCommentMutation.mutate({ slug, commentId, comment });
                }}
                isAddingComment={addCommentMutation.isPending}
                isUpdatingComment={updateCommentMutation.isPending}
                isDeletingComment={deleteCommentMutation.isPending}
                isReplying={replyToCommentMutation.isPending}
                t={t}
              />
            )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Owner Card */}
              {property?.contact_info && (
                <ContactOwnerCard
                  contactInfo={property.contact_info}
                  onContactOwner={handleContactOwner}
                  t={t}
                  isLocked={isOwnerInfoLocked}
                  unlockPointAmount={unlockPointAmount}
                  language={language === 'mm' ? 'mm' : 'en'}
                  onRequestUnlock={handleRequestUnlock}
                />
              )}

              {/* Quick Actions Card */}
              <QuickActionsCard
                onNavigate={navigate}
                t={t}
              />

              {/* Location Card with Map */}
              {property?.location && (
                <LocationCard
                  location={property.location}
                  locationString={locationString}
                  mapLocation={mapLocation}
                  language={language}
                  t={t}
                />
              )}

              <PropertyDetailCompanyLogosCard t={t} />

              <DetailSidebarAdsCard sidebarSlot={1} />
              <DetailSidebarAdsCard sidebarSlot={2} />
            </div>
          </div>

          {/* Separator */}
          <Separator className="my-8" />

          {/* Similar Properties Section */}
          {slug && <SimilarPropertiesSection slug={slug} />}
        </div>
      </div>

      <ConfirmModal
        isOpen={unlockModalOpen}
        onClose={() => {
          setUnlockModalOpen(false);
          setUnlockError(null);
        }}
        onConfirm={handleConfirmUnlock}
        title={
          insufficientMode
            ? language === 'mm'
              ? 'ပွိုင့်မလုံလောက်ပါ'
              : 'Not enough points'
            : language === 'mm'
              ? 'ဆက်သွယ်ရန်အချက်အလက် ဖွင့်မည်'
              : 'Unlock contact information'
        }
        message={
          <div className="space-y-3">
            {insufficientMode ? (
              language === 'mm' ? (
                <>
                  {hasInsufficientPoints && unlockPointAmount != null ? (
                    <p>
                      အချက်အလက်များကို ကြည့်ရန်အတွက် <strong>{unlockPointAmount}</strong> ပွိုင့် လိုအပ်ပါသည်။
                      သင့်လက်ကျန်မှာ{' '}
                      <strong>{userPointBalance}</strong> ပွိုင့် သာရှိပါသည်။
                    </p>
                  ) : (
                    <p className="text-red-600">{unlockError}</p>
                  )}
                  <p className="text-gray-600 text-sm">
                    ပွိုင့်ဝယ်ယူရန် <strong>ပွိုင့် ရောင်းသော</strong> စာမျက်နှာသို့ သွားပါ။ ပွိုင့် ဖြည့်သွင်းပြီးလျှင် ဤစာမျက်နှာသို့ ပြန်လာပြီး ဖွင့်ကြည့်နိုင်ပါပြီ။
                  </p>
                </>
              ) : (
                <>
                  {hasInsufficientPoints && unlockPointAmount != null ? (
                    <p>
                      You need <strong>{unlockPointAmount}</strong> points to unlock contact
                      details. Your current balance is <strong>{userPointBalance}</strong> points.
                    </p>
                  ) : (
                    <p className="text-red-600">{unlockError}</p>
                  )}
                  <p className="text-gray-600 text-sm">
                    Go to <strong>Point Management</strong> to purchase or top up points. After your balance
                    is sufficient, return here and unlock again.
                  </p>
                </>
              )
            ) : language === 'mm' ? (
              <>
                <p>
                  ဤပစ္စည်း၏ <strong>ဆက်သွယ်ရန်အချက်အလက်</strong> ကို ကြည့်ရန် ပွိုင့်ပေးဆောင်ရပါမည်။
                </p>
                <p>
                  ကုန်ကျပွိုင့် —{' '}
                  {isPointSettingsLoading ? (
                    <span className="inline-block align-middle h-4 w-12 rounded bg-gray-200 animate-pulse" />
                  ) : unlockPointAmount != null ? (
                    <strong className="text-gray-900">{unlockPointAmount}</strong>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                  {isPointSettingsError ? ' (ကုန်ကျပွိုင့်မဖတ်ရပါ)' : ''}
                </p>
                <p className="text-gray-600 text-sm">
                  အတည်ပြုပြီးနောက် သင့်အကောင့်မှ ပွိုင့်ဖြတ်တောက်မည်ဖြစ်ပြီး ဤပစ္စည်းအတွက်သာ အသုံးပြုမည်ဖြစ်သည်။
                </p>
              </>
            ) : (
              <>
                <p>
                  If you want to view <strong>contact information</strong> (name, phone, email) for this
                  property, you need to pay points to unlock them.
                </p>
                <p>
                  Unlock cost:{' '}
                  {isPointSettingsLoading ? (
                    <span className="inline-block align-middle h-4 w-12 rounded bg-gray-200 animate-pulse" />
                  ) : unlockPointAmount != null ? (
                    <strong className="text-gray-900">{unlockPointAmount}</strong>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}{' '}
                  points
                  {isPointSettingsError ? ' (could not load current cost)' : ''}.
                </p>
                <p className="text-gray-600 text-sm">
                  Points are deducted from your balance when you confirm. This unlock applies to this property only.
                </p>
              </>
            )}
            {!insufficientMode && unlockError ? (
              <p className="text-sm text-red-600 pt-1">{unlockError}</p>
            ) : null}
          </div>
        }
        confirmText={
          insufficientMode
            ? language === 'mm'
              ? 'ပွိုင့် ဝယ်ရန် နိုပ်ပါ။'
              : 'Go to Point Market!'
            : token
              ? language === 'mm'
                ? isPointSettingsLoading
                  ? 'စောင့်ပါ…'
                  : unlockPointAmount != null
                    ? `ပွိုင့် ${unlockPointAmount} ဖြင့်ဖွင့်မည်`
                    : 'ပွိုင့်ဖြင့် ဖွင့်မည်'
                : isPointSettingsLoading
                  ? 'Loading…'
                  : unlockPointAmount != null
                    ? `Pay ${unlockPointAmount} points and unlock`
                    : 'Pay points and unlock'
              : language === 'mm'
                ? 'ဝင်ရောက်မည်'
                : 'Sign in'
        }
        cancelText={language === 'mm' ? 'မလုပ်တော့ပါ' : 'Cancel'}
        confirmVariant="default"
        isLoading={unlockMutation.isPending}
        size="lg"
      />
    </>
  );
}

