/**
 * Public Advertisement Detail Page
 * 
 * Displays detailed information about a public advertisement.
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePublicAdvertisementDetail } from '@/hooks/queries/usePublicAdvertisementDetail';
import { publicAdvertisementApi } from '@/services/api/publicAdvertisements';
import { publicAdvertisementKeys } from '@/services/queries/publicAdvertisements';
import { homeKeys } from '@/services/queries/home';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AdvertisementGallery, AdvertisementDetailsCard, ContactCard, LocationCard, UserInfoCard } from './components';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicAdvertisementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = usePublicAdvertisementDetail(id || '');
  
  // State
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Like mutation - must be called before conditional returns
  const toggleLikeMutation = useMutation({
    mutationFn: (id: string | number) => publicAdvertisementApi.toggleLike(id),
    onSuccess: (response, id) => {
      const isLiked = response.data?.data?.is_like ?? false;
      setIsLiked(isLiked);
      
      // Invalidate all advertisement list queries (like property detail page)
      queryClient.invalidateQueries({ queryKey: publicAdvertisementKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
      queryClient.invalidateQueries({ queryKey: publicAdvertisementKeys.detail(id) });
      
      // Show success message
      toast.success(isLiked 
        ? (t('advertisementDetail.liked') || 'Liked!')
        : (t('advertisementDetail.unliked') || 'Unliked')
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('advertisementDetail.likeError') || 'Failed to update like status';
      toast.error(errorMessage);
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error(t('advertisementDetail.signInRequired') || 'Please sign in to like');
      navigate('/signin');
      return;
    }
    if (id) {
      toggleLikeMutation.mutate(id);
    }
  };

  // Initialize state from API response - must be before conditional returns
  useEffect(() => {
    if (data?.data?.data) {
      // Initialize like state from is_favorited
      setIsLiked(data.data.data.is_favorited ?? false);
    }
  }, [data]);

  // Prepare gallery images - must be before conditional returns
  const galleryImages = useMemo(() => {
    if (!data?.data?.data?.media?.images || data.data.data.media.images.length === 0) {
      return [];
    }
    return data.data.data.media.images.map((img) => ({
      id: img.id,
      filename: img.filename,
      url: img.url,
      thumbnail_url: img.thumbnail_url || img.url,
    }));
  }, [data?.data?.data?.media]);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">{t('advertisementDetail.errorLoading') || 'Error loading advertisement'}</h3>
            <p className="text-muted-foreground mb-4">
              {t('advertisementDetail.errorMessage') || 'Failed to load the advertisement. Please try again later.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('advertisementDetail.back') || 'Go Back'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const advertisement = data.data.data;

  const title = language === 'mm' ? advertisement.title_mm : advertisement.title_en;
  const description = advertisement.description || '';

  const getLocationString = () => {
    if (!advertisement.location) return '';
    const region = language === 'mm' 
      ? advertisement.location.region.name_mm 
      : advertisement.location.region.name_en;
    const township = language === 'mm' 
      ? advertisement.location.township.name_mm 
      : advertisement.location.township.name_en;
    return `${township}, ${region}`;
  };

  const locationString = getLocationString();

  return (
    <>
      <SEOHead 
        seo={{
          title: title,
          description: description.substring(0, 160),
          keywords: `${title}, ${locationString}, advertisement`,
          image: advertisement.media?.primary_image?.url || advertisement.media?.images?.[0]?.url || '/jade.png',
        }}
        path={`/advertisements/${id}`}
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
            {t('advertisementDetail.backToListings') || 'Back to Listings'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Image Gallery */}
              {advertisement && galleryImages.length > 0 && (
                <AdvertisementGallery
                  advertisement={advertisement}
                  title={title}
                  galleryImages={galleryImages}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  isLiked={isLiked}
                  onLike={handleLike}
                  shareUrl={window.location.href}
                  t={t}
                />
              )}

              {/* Advertisement Details */}
              {advertisement && (
                <AdvertisementDetailsCard
                  advertisement={advertisement}
                  title={title}
                  description={description}
                  locationString={locationString}
                  isLiked={isLiked}
                  onLike={handleLike}
                  formatTimestamp={formatTimestamp}
                  t={t}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Contact Card */}
              {advertisement.contact_info && (
                <ContactCard
                  contactInfo={advertisement.contact_info}
                  t={t}
                />
              )}

              {/* User Info Card */}
              {advertisement.user && (
                <UserInfoCard
                  user={advertisement.user}
                  t={t}
                />
              )}

              {/* Location Card */}
              {advertisement.location && (
                <LocationCard
                  location={advertisement.location}
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

