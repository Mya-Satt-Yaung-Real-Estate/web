import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

import { SEOHead } from '@/components/seo/SEOHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePublicActivity } from '@/hooks/queries/usePublicActivity';
import { ActivityDetailsCard, ActivityGallery, UserInfoCard } from './components';

export default function PublicActivityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data, isLoading, error } = usePublicActivity(slug || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const activity = data?.data?.data;

  const galleryImages = useMemo(() => {
    const images = activity?.media?.images || [];
    if (images.length === 0 && activity?.media?.primary_image) {
      const primary = activity.media.primary_image;
      return [{
        id: primary.id,
        filename: primary.filename,
        url: primary.url || primary.medium_url || primary.small_url || primary.thumbnail_url || '',
        thumbnail_url: primary.thumbnail_url || primary.small_url || primary.url,
      }].filter((img) => img.url);
    }

    return images
      .map((img) => ({
        id: img.id,
        filename: img.filename,
        url: img.url || img.medium_url || img.small_url || img.thumbnail_url || '',
        thumbnail_url: img.thumbnail_url || img.small_url || img.url,
      }))
      .filter((img) => img.url);
  }, [activity?.media]);

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

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">{t('activityDetail.errorLoading') || 'Error loading activity'}</h3>
            <p className="text-muted-foreground mb-4">
              {t('activityDetail.errorMessage') || 'Failed to load the activity. Please try again later.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('activityDetail.back') || 'Go Back'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const seoDescription = (activity.description || activity.title).substring(0, 160);
  const seoImage =
    activity.media?.primary_image?.url
    || activity.media?.images?.[0]?.url
    || '/jade.png';

  return (
    <>
      <SEOHead
        seo={{
          title: activity.title,
          description: seoDescription,
          keywords: `${activity.title}, ${t('companies.tabs.activities') || 'Activities'}, Jade Property`,
          image: seoImage,
        }}
        path={`/activities/${slug}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 sm:mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('activityDetail.backToListings') || t('activityDetail.back') || 'Go Back'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {galleryImages.length > 0 && (
                <ActivityGallery
                  title={activity.title}
                  galleryImages={galleryImages}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  shareUrl={window.location.href}
                  badgeLabel={t('companies.tabs.activities') || 'Activities'}
                />
              )}

              <ActivityDetailsCard
                activity={activity}
                formatTimestamp={formatTimestamp}
                t={t}
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              {activity.user && <UserInfoCard user={activity.user} t={t} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
