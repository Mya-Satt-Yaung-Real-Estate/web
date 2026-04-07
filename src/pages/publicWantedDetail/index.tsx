/**
 * Public Wanted Detail Page
 * 
 * Displays detailed information about a wanted listing.
 */

import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useWantedDetail } from '@/hooks/queries/useWantedDetail';
import { wantedListApi } from '@/services/api/wantedList';
import { pointSettingsApi } from '@/services/api/pointSettings';
import { wantedListKeys } from '@/services/queries/wantedList';
import { useAuthStore } from '@/stores/authStore';
import { SEOHead } from '@/components/seo/SEOHead';
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
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { ShareModal } from '@/components/ui/ShareModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import type { WantedListDetailResponse } from '@/types/wantedList';

export default function PublicWantedDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  const { data, isLoading, error } = useWantedDetail(slug || '');
  const wanted = data?.data?.data;
  const isOwnerInfoLocked = Boolean(wanted?.status?.owner_information_lock);

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

  const unlockPointAmount = pointSettings?.unlock_wanted_info?.point_amount;

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
      const res = await wantedListApi.unlockPublicWantedDetail(slug || '');
      return res.data as WantedListDetailResponse;
    },
    onMutate: () => setUnlockError(null),
    onSuccess: (data) => {
      setUnlockModalOpen(false);
      queryClient.invalidateQueries({ queryKey: wantedListKeys.detail(slug || '') });

      const apiMessage = data?.message?.trim();
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
            <h3 className="mb-2">{t('wantedDetail.errorLoading') || 'Error loading wanted listing'}</h3>
            <p className="text-muted-foreground mb-4">
              {t('wantedDetail.errorMessage') || 'Failed to load the wanted listing. Please try again later.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('wantedDetail.back') || 'Go Back'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!wanted) {
    return null;
  }

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

  const handleCall = () => {
    if (!wanted.contact?.phone) return;
    window.location.href = `tel:${wanted.contact.phone}`;
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

  const shareUrl = window.location.href;
  const title = wanted.title;
  const description = wanted.description || wanted.title;

  return (
    <>
      <SEOHead 
        seo={{
          title: title,
          description: description.substring(0, 160),
          keywords: `${title}, ${getLocation()}, ${getPropertyType()}, ${wanted.wanted_type_label}, wanted listing`,
          image: '/jade.png',
        }}
        path={`/wanted/${slug}`}
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
            {t('wantedDetail.backToListings') || 'Back to Listings'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Header Card */}
              <Card>
                <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 sm:space-y-6">
                  <div>
                    <h1 className="mb-3 text-lg sm:text-xl lg:text-2xl">{wanted.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getWantedTypeBadge()}
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

                  {/* Description */}
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">{t('wantedDetail.description') || 'Description'}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
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
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {wanted.additional_requirement}
                        </p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Key Specifications */}
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
                          <p className="font-medium">{wanted.specifications.bedrooms || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Bath className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{t('wantedDetail.bathrooms') || 'Bathrooms'}</p>
                          <p className="font-medium">{wanted.specifications.bathrooms || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Square className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">{t('wantedDetail.area') || 'Area'}</p>
                          <p className="font-medium">{wanted.specifications.area_range || '-'}</p>
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

                  {/* Posted Date and Share */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {t('wantedDetail.postedOn') || 'Posted on'}: {wanted.created_at}
                      </span>
                    </div>
                    <ShareModal title={title} url={shareUrl}>
                      <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/20">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('wantedDetail.share') || 'Share'}
                      </Button>
                    </ShareModal>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Contact Card */}
              <Card>
                <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
                  <h3 className="mb-4">{t('wantedDetail.contact') || 'Contact'}</h3>

                  {isOwnerInfoLocked ? (
                    <div
                      className="relative min-h-[220px] overflow-hidden rounded-lg cursor-pointer"
                      role="button"
                      aria-label={
                        language === 'mm'
                          ? 'ဆက်သွယ်ရန်အချက်အလက် လော့ခ်ထားပြီး ပွိုင့်ဖြင့် ဖွင့်ရန်'
                          : 'Contact information is locked. Tap to unlock with points.'
                      }
                      tabIndex={0}
                      onClick={handleRequestUnlock}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleRequestUnlock();
                      }}
                    >
                      {/* Slightly lighter lock view: a bit more visible, still unreadable */}
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
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/12 via-background/24 to-background/36"
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute left-2 top-2">
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[11px] border-amber-300/50 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800"
                        >
                          <Lock className="h-3 w-3 text-amber-600" />
                          {language === 'mm' ? 'လော့ခ်' : 'Locked'}
                          {unlockPointAmount != null
                            ? language === 'mm'
                              ? ` • ${unlockPointAmount} ပွိုင့်`
                              : ` • ${unlockPointAmount} pts`
                            : ' • ...'}
                        </Badge>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 text-center">
                        <p className="text-xs text-muted-foreground">
                          {language === 'mm'
                            ? 'ဆက်သွယ်ရန်အချက်အလက် ဖွင့်ရန် နှိပ်ပါ'
                            : 'Tap to unlock and view contact details'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{t('wantedDetail.name') || 'Name'}</p>
                          <p className="font-medium">{wanted.contact?.name ?? '—'}</p>
                        </div>

                        <Separator />

                        <Button
                          className="w-full gradient-primary"
                          onClick={handleCall}
                          disabled={!wanted.contact?.phone}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          {t('wantedDetail.call') || 'Call'} {wanted.contact?.phone ?? ''}
                        </Button>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{wanted.contact?.phone ?? '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary" />
                          <span className="break-all">{wanted.contact?.email ?? '—'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* User Info Card */}
              {isOwnerInfoLocked ? (
                <Card>
                  <CardContent
                    className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 cursor-pointer"
                    role="button"
                    aria-label={
                      language === 'mm'
                        ? 'တင်ထားသူအချက်အလက် လော့ခ်ထားပြီး ပွိုင့်ဖြင့် ဖွင့်ရန်'
                        : 'Posted by information is locked. Tap to unlock with points.'
                    }
                    tabIndex={0}
                    onClick={handleRequestUnlock}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleRequestUnlock();
                    }}
                  >
                    <h3 className="mb-4">{t('wantedDetail.postedBy') || 'Posted By'}</h3>
                    <div className="relative min-h-[90px] overflow-hidden rounded-lg">
                      <div className="pointer-events-none select-none blur-sm contrast-[0.9]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white font-medium">
                            J
                          </div>
                          <div>
                            <p className="font-medium">Jade Member</p>
                            <p className="text-sm text-muted-foreground">Company</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              premium
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/12 via-background/24 to-background/36" />
                      <div className="pointer-events-none absolute left-2 top-2">
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[11px] border-amber-300/50 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800"
                        >
                          <Lock className="h-3 w-3 text-amber-600" />
                          {language === 'mm' ? 'လော့ခ်' : 'Locked'}
                          {unlockPointAmount != null
                            ? language === 'mm'
                              ? ` • ${unlockPointAmount} ပွိုင့်`
                              : ` • ${unlockPointAmount} pts`
                            : ' • ...'}
                        </Badge>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-2 text-center">
                        <p className="text-[11px] text-muted-foreground">
                          {language === 'mm'
                            ? 'တင်ထားသူအချက်အလက် ဖွင့်ရန် နှိပ်ပါ'
                            : 'Tap to unlock posted-by details'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                wanted.user && (
                  <Card>
                    <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
                      <h3 className="mb-4">{t('wantedDetail.postedBy') || 'Posted By'}</h3>

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
                )
              )}

              {/* Location Card */}
              <Card>
                <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7">
                  <h4 className="mb-4">{t('wantedDetail.preferredLocation') || 'Preferred Location'}</h4>
                  
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
            </div>
          </div>
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
                      You need <strong>{unlockPointAmount}</strong> points to unlock contact and poster
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
                  ဤလိုချင်စာရင်း၏{' '}
                  <strong>ဆက်သွယ်ရန်အချက်အလက်</strong> နှင့်{' '}
                  <strong>တင်ထားသူအချက်အလက်</strong> ကို ကြည့်ရန် ပွိုင့်ပေးဆောင်ရပါမည်။
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
                  အတည်ပြုပြီးနောက် သင့်အကောင့်မှ ပွိုင့်ဖြတ်တောက်မည်ဖြစ်ပြီး ဤစာရင်းအတွက်သာ အသုံးပြုမည်ဖြစ်သည်။
                </p>
              </>
            ) : (
              <>
                <p>
                  If you want to view <strong>contact information</strong> (name, phone, email) and{' '}
                  <strong>posted-by details</strong> for this wanted listing, you need to pay points to unlock them.
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
                  Points are deducted from your balance when you confirm. This unlock applies to this listing only.
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

