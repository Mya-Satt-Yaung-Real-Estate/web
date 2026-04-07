/**
 * Mobile Wanted Detail Page
 * 
 * Standalone mobile page for wanted listing detail (no header, no footer).
 * Used in mobile app (Flutter WebView) context.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useWantedDetail } from '@/hooks/queries/useWantedDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const AI_GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

export default function MobileWantedDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const { data, isLoading, error } = useWantedDetail(slug || '');

  // Prevent body scrolling and pinch zoom when in mobile WebView - MUST be called before any conditional returns
  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.touchAction = 'pan-y'; // Allow vertical scroll, prevent pinch zoom
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.touchAction = 'pan-y';

    // Prevent pinch zoom with touch events
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      const timeSinceLastTouch = now - (preventDoubleTapZoom as any).lastTouch || 0;
      (preventDoubleTapZoom as any).lastTouch = now;
      
      if (timeSinceLastTouch < 300 && timeSinceLastTouch > 0) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    document.addEventListener('gesturechange', (e) => e.preventDefault());
    document.addEventListener('gestureend', (e) => e.preventDefault());

    // Update viewport meta tag to prevent zoom
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.touchAction = '';
      
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.removeEventListener('gesturestart', (e) => e.preventDefault());
      document.removeEventListener('gesturechange', (e) => e.preventDefault());
      document.removeEventListener('gestureend', (e) => e.preventDefault());
      
      // Restore viewport
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2 text-lg font-semibold">{t('wantedDetail.errorLoading') || 'Error loading wanted listing'}</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('wantedDetail.errorMessage') || 'Failed to load the wanted listing. Please try again later.'}
          </p>
          <Button onClick={() => navigate(-1)} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('wantedDetail.back') || 'Go Back'}
          </Button>
        </Card>
      </div>
    );
  }

  const wanted = data.data.data;

  const getPropertyType = () => {
    return language === 'mm' ? wanted.property_type.name_mm : wanted.property_type.name_en;
  };

  const getLocation = () => {
    const region = language === 'mm' 
      ? wanted.preferred_location.region.name_mm 
      : wanted.preferred_location.region.name_en;
    const township = language === 'mm' 
      ? wanted.preferred_location.township.name_mm 
      : wanted.preferred_location.township.name_en;
    return `${township}, ${region}`;
  };

  const getStatusBadge = () => {
    if (wanted.status.is_expired) {
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <Clock className="h-3 w-3 mr-1" />
          {language === 'mm' ? 'သက်တမ်းကုန်ဆုံး' : 'Expired'}
        </Badge>
      );
    }
    if (wanted.status.verification_status === 'approved' && wanted.status.is_published) {
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          {language === 'mm' ? 'အသက်ဝင်သည်' : 'Active'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
        {language === 'mm' ? 'အတည်ပြုထားသည်' : 'Approved'}
      </Badge>
    );
  };

  const getWantedTypeBadge = () => {
    const color = wanted.wanted_type === 'buyer' 
      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
      : 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    return (
      <Badge variant="outline" className={color}>
        {wanted.wanted_type_label}
      </Badge>
    );
  };

  const handleGoBackToAI = () => {
    navigate('/mobile/ai-assistant?token=JADE_PROPERTY_MOBILE_AI_CALL_2026');
  };

  return (
    <div 
      className="fixed inset-0 bg-background overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={(e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }}
    >
      <div className="p-4 space-y-4">
        {/* Header Card */}
        <Card>
          <CardContent className="p-4 pt-5 space-y-4">
            <div>
              <h1 className="mb-3 text-lg font-semibold">{wanted.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {getWantedTypeBadge()}
                {getStatusBadge()}
                <Badge variant="outline" className="bg-primary/5 border-primary/20">
                  <Home className="h-3 w-3 mr-1" />
                  {getPropertyType()}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{getLocation()}</span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{t('wantedDetail.description') || 'Description'}</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {wanted.description || t('wantedDetail.noDescription') || 'No description provided.'}
              </p>
            </div>

            {/* Additional Requirements */}
            {wanted.additional_requirement && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    {t('wantedDetail.additionalRequirements') || 'Additional Requirements'}
                  </h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                    {wanted.additional_requirement}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Key Specifications */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                {t('wantedDetail.specifications') || 'Specifications'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{t('wantedDetail.bedrooms') || 'Bedrooms'}</p>
                    <p className="font-medium text-sm">{wanted.specifications.bedrooms || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{t('wantedDetail.bathrooms') || 'Bathrooms'}</p>
                    <p className="font-medium text-sm">{wanted.specifications.bathrooms || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Square className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{t('wantedDetail.area') || 'Area'}</p>
                    <p className="font-medium text-sm">{wanted.specifications.area_range || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Budget */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{t('wantedDetail.budget') || 'Budget'}</h3>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-primary">{wanted.budget.budget_range}</span>
              </div>
            </div>

            <Separator />

            {/* Posted Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {t('wantedDetail.postedOn') || 'Posted on'}: {wanted.created_at}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card>
          <CardContent className="p-4 pt-5 space-y-4">
            <h3 className="text-base font-semibold">{t('wantedDetail.contact') || 'Contact'}</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('wantedDetail.name') || 'Name'}</p>
                <p className="font-medium">{wanted.contact?.name ?? '—'}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('wantedDetail.phone') || 'Phone'}</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <p className="font-medium">{wanted.contact?.phone ?? '—'}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="break-all">{wanted.contact?.email ?? '—'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        {wanted.user && (
          <Card>
            <CardContent className="p-4 pt-5 space-y-3">
              <h3 className="text-base font-semibold">{t('wantedDetail.postedBy') || 'Posted By'}</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white font-medium">
                  {wanted.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{wanted.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {wanted.user.user_type === 'company' 
                      ? (t('wantedDetail.company') || 'Company')
                      : (t('wantedDetail.individual') || 'Individual')}
                  </p>
                  {wanted.user.member_level && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {wanted.user.member_level}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Card */}
        <Card>
          <CardContent className="p-4 pt-5">
            <h4 className="mb-3 text-base font-semibold">{t('wantedDetail.preferredLocation') || 'Preferred Location'}</h4>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  {wanted.preferred_location.township && (
                    <p className="text-sm">
                      {language === 'mm' 
                        ? wanted.preferred_location.township.name_mm 
                        : wanted.preferred_location.township.name_en}
                    </p>
                  )}
                  {wanted.preferred_location.region && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'mm' 
                        ? wanted.preferred_location.region.name_mm 
                        : wanted.preferred_location.region.name_en}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Searching with AI Button */}
        <Button
          variant="outline"
          onClick={handleGoBackToAI}
          className="w-full border-0 text-white hover:opacity-90"
          size="sm"
          style={{
            background: AI_GRADIENT_COLOR,
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {t('wantedDetail.continueSearchingWithAI') || 'Continue Searching with AI'}
        </Button>
      </div>
    </div>
  );
}

