/**
 * Mobile Property Detail Page
 * 
 * Standalone mobile page for property detail (no header, no footer).
 * Used in mobile app (Flutter WebView) context.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { usePublicProperty } from '@/hooks/queries/usePublicProperties';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Play,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const AI_GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

export default function MobilePropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const { data, isLoading, error } = usePublicProperty(slug || '');
  
  // State for gallery navigation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get property data
  const property = data?.data?.data;

  // Memoized values
  const title = useMemo(() => {
    if (!property) return '';
    return language === 'mm' 
      ? (property.title_mm || property.title_en || '')
      : (property.title_en || property.title_mm || '');
  }, [property, language]);

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

  const propertyTypeName = useMemo(() => {
    if (!property?.property_type) return '';
    return language === 'mm' 
      ? (property.property_type.name_mm || property.property_type.name_en || '')
      : (property.property_type.name_en || property.property_type.name_mm || '');
  }, [property?.property_type, language]);

  const listingTypeName = useMemo(() => {
    if (!property?.listing_type) return '';
    return language === 'mm' 
      ? (property.listing_type.name_mm || property.listing_type.name_en || '')
      : (property.listing_type.name_en || property.listing_type.name_mm || '');
  }, [property?.listing_type, language]);

  const propertyConditionLabel = useMemo(() => {
    if (!property?.property_condition) return '';
    return language === 'mm' 
      ? (property.property_condition.label_mm || property.property_condition.label_en || '')
      : (property.property_condition.label_en || property.property_condition.label_mm || '');
  }, [property?.property_condition, language]);

  // Get gallery images and videos
  const galleryImages = useMemo(() => {
    if (!property?.media?.images) return [];
    return property.media.images.map((img) => ({
      id: img.id,
      url: img.url || img.medium_url || img.small_url || img.thumbnail_url || '',
      thumbnail_url: img.thumbnail_url || img.small_url || img.url || '',
      filename: img.filename || (img.type === 'video' ? 'video' : 'image'),
      type: img.type || 'image',
    }));
  }, [property?.media?.images]);

  const handleGoBackToAI = () => {
    navigate('/mobile/ai-assistant?token=JADE_PROPERTY_MOBILE_AI_CALL_2026');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-64 w-full mb-4 rounded-lg" />
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

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2 text-lg font-semibold">{t('propertyDetail.errorLoading') || 'Error loading property'}</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            {t('propertyDetail.errorMessage') || 'Failed to load the property. Please try again later.'}
          </p>
        </Card>
      </div>
    );
  }

  // Ensure currentImageIndex is within bounds
  const safeIndex = galleryImages.length > 0 
    ? Math.max(0, Math.min(currentImageIndex, galleryImages.length - 1))
    : 0;
  const currentItem = galleryImages[safeIndex];
  const isVideo = currentItem?.type === 'video';
  const videoUrl = isVideo && currentItem?.url ? currentItem.url : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4">
        {/* Image and Video Gallery */}
        {galleryImages.length > 0 && (
          <Card>
            <CardContent className="pt-1 px-0 pb-0">
              {/* Main Image/Video Container */}
              <div className="relative bg-black overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {isVideo ? (
                  /* Video Player */
                  <div className="relative w-full h-full bg-black">
                    {videoUrl ? (
                      (() => {
                        // Check if it's YouTube or Vimeo URL
                        const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
                        const isVimeo = videoUrl?.includes('vimeo.com');
                        
                        if (isYouTube && videoUrl) {
                          // Extract YouTube video ID
                          let videoId = '';
                          if (videoUrl.includes('youtube.com/watch?v=')) {
                            videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
                          } else if (videoUrl.includes('youtu.be/')) {
                            videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
                          }
                          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                          
                          return (
                            <iframe
                              width="100%"
                              height="100%"
                              src={embedUrl}
                              title={title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          );
                        } else if (isVimeo && videoUrl) {
                          // Extract Vimeo video ID
                          const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0] || '';
                          const embedUrl = `https://player.vimeo.com/video/${videoId}`;
                          
                          return (
                            <iframe
                              width="100%"
                              height="100%"
                              src={embedUrl}
                              title={title}
                              frameBorder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          );
                        } else {
                          // Direct video file (MP4, WebM, etc.)
                          return (
                            <video
                              controls
                              className="w-full h-full object-contain"
                              src={videoUrl}
                              title={title}
                            >
                              Your browser does not support the video tag.
                            </video>
                          );
                        }
                      })()
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <p className="text-white">{t('propertyDetail.videoNotAvailable') || 'Video not available'}</p>
                      </div>
                    )}
                    
                    {/* Navigation Arrows for Video */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => {
                              const newIndex = prev > 0 ? prev - 1 : galleryImages.length - 1;
                              return newIndex;
                            });
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                        >
                          <ChevronLeft className="h-5 w-5 text-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => {
                              const newIndex = prev < galleryImages.length - 1 ? prev + 1 : 0;
                              return newIndex;
                            });
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                        >
                          <ChevronRight className="h-5 w-5 text-foreground" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-foreground">
                          {safeIndex + 1} / {galleryImages.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* Image Display */
                  <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
                    {currentItem && (
                      <ImageWithFallback
                        key={`main-image-${safeIndex}-${currentItem.id}`}
                        src={currentItem.url}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => {
                              const newIndex = prev > 0 ? prev - 1 : galleryImages.length - 1;
                              return newIndex;
                            });
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                        >
                          <ChevronLeft className="h-5 w-5 text-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex((prev) => {
                              const newIndex = prev < galleryImages.length - 1 ? prev + 1 : 0;
                              return newIndex;
                            });
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                        >
                          <ChevronRight className="h-5 w-5 text-foreground" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-foreground">
                          {safeIndex + 1} / {galleryImages.length}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Badges - Top Left */}
                {property && (
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 z-20">
                    {property.premium && (
                      <Badge className="bg-yellow-500 text-white border-0 font-semibold text-xs">
                        Premium
                      </Badge>
                    )}
                    {property.tan_tan_tan && (
                      <Badge className="bg-primary text-white border-0 font-semibold text-xs">
                        Tan Tan Tan
                      </Badge>
                    )}
                    {property.is_featured && (
                      <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 font-semibold text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Navigation - Only show if more than 1 item */}
              {galleryImages.length > 1 && (
                <div className="w-full bg-background border-t border-border p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((item, idx) => {
                      const isVideoItem = item.type === 'video';
                      const thumbnailSrc = item.thumbnail_url || item.url;
                      
                      return (
                        <div
                          key={`thumb-${item.id}-${idx}`}
                          className={`relative aspect-video rounded overflow-hidden border-2 transition-all cursor-pointer ${
                            safeIndex === idx 
                              ? 'border-primary ring-2 ring-primary/30' 
                              : 'border-transparent hover:border-border'
                          }`}
                          onClick={() => setCurrentImageIndex(idx)}
                        >
                          {isVideoItem ? (
                            <>
                              <ImageWithFallback
                                src={thumbnailSrc}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-4 h-4 text-white fill-white" />
                              </div>
                            </>
                          ) : (
                            <ImageWithFallback
                              src={item.url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Header Card */}
        <Card>
          <CardContent className="p-4 pt-5 space-y-4">
            <div>
              <h1 className="mb-3 text-lg font-semibold">{title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-primary/5 border-primary/20">
                  <Home className="h-3 w-3 mr-1" />
                  {propertyTypeName}
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  {listingTypeName}
                </Badge>
                {propertyConditionLabel && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {propertyConditionLabel}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{locationString}</span>
                </div>
                <div className="text-right">
                  <div className="text-primary text-lg font-semibold">
                    {property.formatted_price || property.price || '-'}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Key Specifications */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">
                {t('propertyDetail.specifications') || 'Specifications'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{t('propertyDetail.bedrooms') || 'Bedrooms'}</p>
                    <p className="font-medium text-sm">{property.bedrooms || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{t('propertyDetail.bathrooms') || 'Bathrooms'}</p>
                    <p className="font-medium text-sm">{property.bathrooms || '-'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Square className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground text-xs">{t('propertyDetail.area') || 'Area'}</p>
                    <p className="font-medium text-sm">{property.area_sqft || '-'} {t('propertyDetail.sqft') || 'sqft'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{t('propertyDetail.price') || 'Price'}</h3>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold text-primary">{property.formatted_price || property.price || '-'}</span>
              </div>
              {property.bank_installment_available && (
                <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-600 border-green-500/20">
                  {t('propertyDetail.bankInstallmentAvailable') || 'Bank Installment Available'}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold">{t('propertyDetail.description') || 'Description'}</h3>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed">
                {property.description || t('propertyDetail.noDescription') || 'No description provided.'}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 text-sm font-semibold">{t('propertyDetail.features') || 'Features'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5 border-primary/20">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Posted Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {t('propertyDetail.postedOn') || 'Posted on'}: {property.dates?.published_at || property.dates?.created_at || '-'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        {property.contact_info && (
          <Card>
            <CardContent className="p-4 pt-5 space-y-4">
              <h3 className="text-base font-semibold">{t('propertyDetail.contact') || 'Contact'}</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('propertyDetail.ownerName') || 'Owner Name'}</p>
                  <p className="font-medium">{property.contact_info.owner_name}</p>
                </div>

                <Separator />

                {property.contact_info.phone_numbers && property.contact_info.phone_numbers.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('propertyDetail.phone') || 'Phone'}</p>
                    <div className="space-y-1">
                      {property.contact_info.phone_numbers.map((phone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <p className="font-medium">{phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {property.contact_info.email && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('propertyDetail.email') || 'Email'}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="break-all">{property.contact_info.email}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Info Card */}
        {property.user && (
          <Card>
            <CardContent className="p-4 pt-5 space-y-3">
              <h3 className="text-base font-semibold">{t('propertyDetail.postedBy') || 'Posted By'}</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white font-medium">
                  {property.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{property.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {property.user.user_type === 'company' 
                      ? (t('propertyDetail.company') || 'Company')
                      : (t('propertyDetail.individual') || 'Individual')}
                  </p>
                  {property.user.member_level && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {property.user.member_level}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location Card */}
        {property.location && (
          <Card>
            <CardContent className="p-4 pt-5">
              <h4 className="mb-3 text-base font-semibold">{t('propertyDetail.location') || 'Location'}</h4>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    {property.location.township && (
                      <p className="text-sm">
                        {language === 'mm' 
                          ? property.location.township.name_mm 
                          : property.location.township.name_en}
                      </p>
                    )}
                    {property.location.region && (
                      <p className="text-sm text-muted-foreground">
                        {language === 'mm' 
                          ? property.location.region.name_mm 
                          : property.location.region.name_en}
                      </p>
                    )}
                    {property.location.address && (
                      <p className="text-sm text-muted-foreground">{property.location.address}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
          {t('propertyDetail.continueSearchingWithAI') || 'Continue Searching with AI'}
        </Button>
      </div>
    </div>
  );
}

