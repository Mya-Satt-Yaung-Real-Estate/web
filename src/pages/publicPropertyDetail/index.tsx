/**
 * Public Property Detail Page
 * 
 * Displays detailed information about a public property.
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePublicProperty } from '@/hooks/queries/usePublicProperties';
import { publicPropertyApi } from '@/services/api/publicProperties';
import { publicPropertyKeys } from '@/services/queries/publicProperties';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { PropertyGallery, PropertyDetailsCard, ContactOwnerCard, QuickActionsCard, LocationCard } from './components';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicPropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = usePublicProperty(slug || '');
  
  // State
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Favorite mutation - must be called before conditional returns
  const toggleFavoriteMutation = useMutation({
    mutationFn: (slug: string) => publicPropertyApi.toggleFavorite(slug),
    onSuccess: (response, slug) => {
      const isFavorited = response.data?.data?.is_favorited ?? false;
      setIsFavorite(isFavorited);
      
      // Invalidate property detail to refresh favorite status
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(slug) });
      
      // Invalidate favorites list if it exists
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      
      // Show success message
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
    onSuccess: (response, slug) => {
      const isLiked = response.data?.data?.liked ?? false;
      setIsLiked(isLiked);
      
      // Invalidate property detail to refresh like status
      queryClient.invalidateQueries({ queryKey: publicPropertyKeys.detail(slug) });
      
      // Show success message
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


  return (
    <>
      <SEOHead 
        seo={{
          title: title,
          description: description.substring(0, 160),
          keywords: `${title}, ${locationString}, ${propertyTypeName}, ${listingTypeName}, property, real estate`,
          image: property?.media?.primary_image?.url || property?.media?.images?.[0]?.url || '/jade.png',
        }}
        path={`/properties/${slug}`}
      />
      
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
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

