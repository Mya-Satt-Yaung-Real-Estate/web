/**
 * Public Event Detail Page
 * 
 * Displays detailed information about a public housing event.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHousingEventDetail } from '@/hooks/queries/useHousingEventDetail';
import { housingEventApi } from '@/services/api/housingEvents';
import { housingEventKeys } from '@/services/queries/housingEvents';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EventGallery, EventDetailsCard, ContactCard, LocationCard, RegisterCard } from './components';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PublicEventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useHousingEventDetail(slug || '');

  // Register mutation - must be called before conditional returns
  const registerMutation = useMutation({
    mutationFn: (id: number) => housingEventApi.registerEvent(id),
    onSuccess: (_response) => {
      // Invalidate event detail to refresh registration status
      queryClient.invalidateQueries({ queryKey: housingEventKeys.detail(slug || '') });
      toast.success(t('eventDetail.registrationSuccess') || 'Successfully registered for the event!');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t('eventDetail.registrationError') || 'Failed to register for the event';
      toast.error(errorMessage);
    },
  });

  const handleRegister = () => {
    if (!isAuthenticated) {
      toast.error(t('eventDetail.signInRequired') || 'Please sign in to register');
      navigate('/signin');
      return;
    }
    if (data?.data?.data?.id) {
      registerMutation.mutate(data.data.data.id);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString(language === 'mm' ? 'my-MM' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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
            <h3 className="mb-2">{t('eventDetail.errorLoading') || 'Error loading event'}</h3>
            <p className="text-muted-foreground mb-4">
              {t('eventDetail.errorMessage') || 'Failed to load the event. Please try again later.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('eventDetail.back') || 'Go Back'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const event = data.data.data;

  const title = language === 'mm' ? event.name_mm : event.name_en;
  const description = event.description || '';

  const getLocationString = () => {
    const parts: string[] = [];
    if (event.location) {
      parts.push(event.location);
    }
    if (event.township && event.region) {
      const townshipName = language === 'mm' ? event.township.name_mm : event.township.name_en;
      const regionName = language === 'mm' ? event.region.name_mm : event.region.name_en;
      parts.push(`${townshipName}, ${regionName}`);
    }
    return parts.join(', ') || '';
  };

  const locationString = getLocationString();
  const imageUrl = event.images?.url || '';

  return (
    <>
      <SEOHead 
        seo={{
          title: title,
          description: description.substring(0, 160),
          keywords: `${title}, ${locationString}, ${event.category.name_en}, event`,
          image: imageUrl || '/jade.png',
        }}
        path={`/events/${slug}`}
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
            {t('eventDetail.backToListings') || 'Back to Listings'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Image Gallery */}
              {event && imageUrl && (
                <EventGallery
                  event={event}
                  title={title}
                  imageUrl={imageUrl}
                  shareUrl={window.location.href}
                  language={language}
                  t={t}
                />
              )}

              {/* Event Details */}
              {event && (
                <EventDetailsCard
                  event={event}
                  title={title}
                  description={description}
                  locationString={locationString}
                  formatDate={formatTimestamp}
                  formatTime={formatTime}
                  t={t}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Register Card */}
              {event && event.need_registration && (
                <RegisterCard
                  event={event}
                  onRegister={handleRegister}
                  isRegistering={registerMutation.isPending}
                  t={t}
                />
              )}

              {/* Contact Card */}
              {event && (
                <ContactCard
                  event={event}
                  t={t}
                />
              )}

              {/* Location Card */}
              {event.location && event.township && event.region && (
                <LocationCard
                  location={event.location}
                  region={event.region}
                  township={event.township}
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

