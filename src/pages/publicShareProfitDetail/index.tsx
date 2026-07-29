/**
 * Public Share Profit Detail Page
 */

import { useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useShareProfitDetail } from '@/hooks/queries/useShareProfitDetail';
import { useAuthStore } from '@/stores/authStore';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ShareModal } from '@/components/ui/ShareModal';
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
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatMemberLevelLabel, getMemberLevelBadgeClass } from '@/lib/memberLevel';
import type { ShareProfitListingDetail, ShareProfitMediaImage } from '@/types/shareProfitListing';

function getGalleryImages(listing: ShareProfitListingDetail): ShareProfitMediaImage[] {
  const images = listing.media?.images || [];
  if (images.length > 0) return images;

  if (listing.media?.primary_image) {
    return [listing.media.primary_image];
  }

  return [];
}

function getImageUrl(img: ShareProfitMediaImage): string {
  return img.url || img.medium_url || img.small_url || img.thumbnail_url || '';
}

function getWantedTypeColor(wantedType: string): string {
  switch (wantedType) {
    case 'buyer':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'renter':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'seller':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'share_profit':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    default:
      return 'bg-primary/5 text-primary border-primary/20';
  }
}

export default function PublicShareProfitDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const token = useAuthStore((s) => s.token);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, isLoading, error } = useShareProfitDetail(slug || '');
  const listing = data?.data?.data;
  const isOwnerInfoLocked = Boolean(listing?.status?.owner_information_lock);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">
              {language === 'mm' ? 'စာရင်း ဖွင့်မရပါ' : 'Error loading listing'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'mm'
                ? 'စာရင်းကို ဖွင့်ရန် မအောင်မြင်ပါ။ နောက်မှ ထပ်စမ်းကြည့်ပါ။'
                : 'Failed to load the listing. Please try again later.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'mm' ? 'နောက်သို့' : 'Go Back'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const galleryImages = getGalleryImages(listing);
  const safeIndex = Math.max(0, Math.min(currentImageIndex, Math.max(galleryImages.length - 1, 0)));
  const currentImage = galleryImages[safeIndex];

  const getPropertyType = () => {
    return language === 'mm' ? listing.property_type.name_mm : listing.property_type.name_en;
  };

  const getLocation = () => {
    const region = language === 'mm'
      ? listing.preferred_location.region.name_mm
      : listing.preferred_location.region.name_en;
    const township = language === 'mm'
      ? listing.preferred_location.township.name_mm
      : listing.preferred_location.township.name_en;
    return `${township}, ${region}`;
  };

  const getStatusBadge = () => {
    if (listing.status.is_expired) {
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
          <Clock className="h-3 w-3 mr-1" />
          {language === 'mm' ? 'သက်တမ်းကုန်ဆုံး' : 'Expired'}
        </Badge>
      );
    }
    if (listing.status.verification_status === 'approved' && listing.status.is_published) {
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

  const handleLockedTap = () => {
    if (!token) {
      navigate(`/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    navigate('/point-management');
  };

  const handleCall = () => {
    if (!listing.contact?.phone) return;
    window.location.href = `tel:${listing.contact.phone}`;
  };

  const shareUrl = window.location.href;
  const title = listing.title;
  const description = listing.description || listing.title;
  const companyDetailPath =
    listing.user?.is_company && listing.user.company_slug
      ? `/companies/${listing.user.company_slug}`
      : null;
  const postedByName =
    listing.user?.is_company && listing.user.company_name
      ? listing.user.company_name
      : listing.user?.name;

  const seoImage = currentImage ? getImageUrl(currentImage) : '/jade.png';

  return (
    <>
      <SEOHead
        seo={{
          title,
          description: description.substring(0, 160),
          keywords: `${title}, ${getLocation()}, ${getPropertyType()}, ${listing.wanted_type_label}, share profit`,
          image: seoImage,
        }}
        path={`/share-profit/${slug}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/search?type=share-profit')}
            className="mb-4 sm:mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'mm' ? 'စာရင်းသို့ ပြန်သွားရန်' : 'Back to Listings'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {galleryImages.length > 0 && (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-[16/10] bg-muted">
                      {/**
                       * key forces remount when index changes — LazyImage keeps old src after first load.
                       */}
                      <ImageWithFallback
                        key={`share-profit-main-${safeIndex}-${currentImage?.id ?? 'none'}`}
                        src={getImageUrl(currentImage)}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      {galleryImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                            {safeIndex + 1} / {galleryImages.length}
                          </div>
                        </>
                      )}
                    </div>
                    {galleryImages.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto">
                        {galleryImages.map((img, index) => (
                          <button
                            key={`share-profit-thumb-${img.id}-${index}`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                              index === safeIndex ? 'border-primary' : 'border-transparent'
                            }`}
                          >
                            <ImageWithFallback
                              src={getImageUrl(img)}
                              alt={`${listing.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 sm:space-y-6">
                  <div>
                    <h1 className="mb-3 text-lg sm:text-xl lg:text-2xl">{listing.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className={getWantedTypeColor(listing.wanted_type)}>
                        {listing.wanted_type_label}
                      </Badge>
                      {getStatusBadge()}
                      <Badge variant="outline" className="bg-primary/5 border-primary/20">
                        <Home className="h-3 w-3 mr-1" />
                        {getPropertyType()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{getLocation()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-sm font-semibold">
                      {t('wantedDetail.description') || 'Description'}
                    </h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {listing.description || (language === 'mm' ? 'ဖော်ပြချက်မရှိပါ။' : 'No description provided.')}
                    </p>
                  </div>

                  {listing.additional_requirement && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="mb-2 text-sm font-semibold">
                          {t('wantedDetail.additionalRequirements') || 'Additional Requirements'}
                        </h3>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {listing.additional_requirement}
                        </p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div>
                    <h3 className="mb-4 text-sm font-semibold">
                      {t('wantedDetail.specifications') || 'Specifications'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Bed className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{t('wantedDetail.bedrooms') || 'Bedrooms'}</p>
                          <p className="font-medium">{listing.specifications.bedrooms || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Bath className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{t('wantedDetail.bathrooms') || 'Bathrooms'}</p>
                          <p className="font-medium">{listing.specifications.bathrooms || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Square className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{t('wantedDetail.area') || 'Area'}</p>
                          <p className="font-medium">{listing.specifications.area_range || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 text-sm font-semibold">{t('wantedDetail.budget') || 'Budget'}</h3>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-lg font-semibold text-primary">{listing.budget.budget_range}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {t('wantedDetail.postedOn') || 'Posted on'}: {listing.created_at}
                      </span>
                      {listing.status.expires_at && (
                        <span className="text-xs">
                          • {language === 'mm' ? 'သက်တမ်းကုန်' : 'Expires'}: {listing.status.expires_at}
                        </span>
                      )}
                    </div>
                    <ShareModal title={title} url={shareUrl}>
                      <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('wantedDetail.share') || 'Share'}
                      </Button>
                    </ShareModal>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
                  <h3 className="mb-4">{t('wantedDetail.contact') || 'Contact'}</h3>

                  {isOwnerInfoLocked ? (
                    <div
                      className="relative min-h-[220px] overflow-hidden rounded-lg cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={handleLockedTap}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleLockedTap();
                      }}
                    >
                      <div className="pointer-events-none select-none space-y-3 p-1 blur-sm contrast-[0.9]">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t('wantedDetail.name') || 'Name'}</p>
                          <p className="font-medium">Jane Customer</p>
                        </div>
                        <Button className="w-full gradient-primary">
                          <Phone className="mr-2 h-4 w-4" />
                          {t('wantedDetail.call') || 'Call'} 09 123 456 789
                        </Button>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>09 123 456 789</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4 text-primary" />
                            <span className="break-all">owner@example.com</span>
                          </div>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/12 via-background/24 to-background/36" />
                      <div className="pointer-events-none absolute left-2 top-2">
                        <Badge variant="secondary" className="gap-1 text-[11px] border-amber-300/50 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
                          <Lock className="h-3 w-3 text-amber-600" />
                          {language === 'mm' ? 'လော့ခ်' : 'Locked'}
                        </Badge>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          {!token
                            ? (language === 'mm' ? 'ဆက်သွယ်ရန် အကောင့်ဝင်ပါ' : 'Sign in to view contact details')
                            : (language === 'mm' ? 'ဆက်သွယ်ရန်အချက်အလက် ဖွင့်ရန် ပွိုင့်လိုအပ်သည်' : 'Points required to unlock contact')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t('wantedDetail.name') || 'Name'}</p>
                          <p className="font-medium">{listing.contact?.name ?? '—'}</p>
                        </div>
                        <Separator />
                        <Button
                          className="w-full gradient-primary"
                          onClick={handleCall}
                          disabled={!listing.contact?.phone}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          {t('wantedDetail.call') || 'Call'} {listing.contact?.phone ?? ''}
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{listing.contact?.phone ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="break-all">{listing.contact?.email ?? '—'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {isOwnerInfoLocked ? (
                <Card>
                  <CardContent
                    className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={handleLockedTap}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleLockedTap();
                    }}
                  >
                    <h3 className="mb-4">{t('wantedDetail.postedBy') || 'Posted By'}</h3>
                    <div className="relative min-h-[90px] overflow-hidden rounded-lg">
                      <div className="pointer-events-none select-none blur-sm">
                        <p className="font-medium">Company Name</p>
                        <p className="text-sm text-muted-foreground">Premium Member</p>
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/12 via-background/24 to-background/36" />
                      <div className="pointer-events-none absolute left-2 top-2">
                        <Badge variant="secondary" className="gap-1 text-[11px]">
                          <Lock className="h-3 w-3" />
                          {language === 'mm' ? 'လော့ခ်' : 'Locked'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : listing.user && listing.user.id > 0 ? (
                <Card>
                  <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
                    <h3 className="mb-4">{t('wantedDetail.postedBy') || 'Posted By'}</h3>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {listing.user.is_company ? (
                          <Building2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Home className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {companyDetailPath ? (
                          <Link to={companyDetailPath} className="font-medium text-primary hover:underline">
                            {postedByName}
                          </Link>
                        ) : (
                          <p className="font-medium">{postedByName ?? '—'}</p>
                        )}
                        {listing.user.member_level && (
                          <Badge className={`mt-2 text-xs ${getMemberLevelBadgeClass(listing.user.member_level)}`}>
                            {formatMemberLevelLabel(listing.user.member_level)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
