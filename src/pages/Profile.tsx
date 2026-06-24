import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building, Calendar, MapPin, Settings, Home, CheckCircle, XCircle, Star, Eye, ArrowLeft, Edit, Award, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { cn } from '@/lib/utils';

const DEFAULT_COVER_IMAGE = 'https://msy-demo.s3.ap-southeast-1.amazonaws.com/default/default-cover.jpeg';

export function Profile() {
  const { user, isAuthenticated } = useAuthStore();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('profile');
  const coverRef = useRef<HTMLDivElement>(null);
  const profileBarRef = useRef<HTMLDivElement>(null);
  const [isProfileBarPinned, setIsProfileBarPinned] = useState(false);
  const [profileBarHeight, setProfileBarHeight] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const cover = coverRef.current;
    const profileBar = profileBarRef.current;
    if (!cover || !profileBar) return;

    const updateProfileBarHeight = () => {
      setProfileBarHeight(profileBar.offsetHeight);
    };

    updateProfileBarHeight();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProfileBarPinned(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-96px 0px 0px 0px' },
    );

    observer.observe(cover);
    window.addEventListener('resize', updateProfileBarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateProfileBarHeight);
    };
  }, [user]);

  if (!user || !isAuthenticated) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isCompany = user.user_type === 'company';
  const companyAddress = user.personal_information?.business_address || 'N/A';
  const companyDescription = user.personal_information?.description || '';
  const companyLocation = language === 'mm'
    ? user.personal_information?.location_mm
    : user.personal_information?.location_en || '';
  const companyType = language === 'mm'
    ? user.personal_information?.company_type_mm
    : user.personal_information?.company_type_en || '';
  const coverImageUrl = user.cover_image_url || DEFAULT_COVER_IMAGE;

  return (
    <>
      <SEOHead seo={seo} path="/profile" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('profile.title')}
              </h1>
              <p className="text-muted-foreground mt-2">{t('profile.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>

          {/* Cover + Profile row */}
          <div className="mb-6">
            <Card className="overflow-hidden backdrop-blur-sm bg-background/95 shadow-sm">
              <div ref={coverRef} className="relative aspect-[2/1] w-full bg-muted sm:aspect-[3/1]">
                <ImageWithFallback
                  src={coverImageUrl}
                  alt={`${user.name} cover`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 right-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/profile/edit')}
                    className="bg-background/95 shadow-md backdrop-blur-sm hover:bg-background"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {t('profile.editCover') || 'Edit cover photo'}
                  </Button>
                </div>
              </div>

              {isProfileBarPinned && <div style={{ height: profileBarHeight }} aria-hidden="true" />}
              <div
                ref={profileBarRef}
                className={cn(
                  'border-t border-border/60 bg-background/95',
                  isProfileBarPinned
                    ? 'fixed top-24 left-0 right-0 z-40 border border-border/60 shadow-sm backdrop-blur-sm'
                    : 'relative',
                )}
              >
                <div
                  className={cn(
                    'flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:py-6',
                    isProfileBarPinned
                      ? 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
                      : 'px-4 sm:px-6',
                  )}
                >
                  {/* Avatar */}
                  {user.profile_image_url ? (
                    <div className="h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex-shrink-0">
                      <img
                        src={user.profile_image_url}
                        alt={`${user.name}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold">
                                ${getInitials(user.name)}
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white text-xl sm:text-2xl lg:text-3xl font-semibold border-4 border-primary/20 shadow-lg flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 flex-col justify-center sm:py-2">
                    <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                      <h2 className="text-lg sm:text-xl font-bold break-words">{user.name}</h2>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300 w-fit">
                        {isCompany ? t('profile.company') : t('profile.individual')}
                      </Badge>
                      {isCompany && companyType && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 w-fit">
                          {companyType}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2.5 text-muted-foreground sm:space-y-3">
                      {user.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="break-words text-sm">{user.email}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="break-words text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex w-fit flex-shrink-0 flex-col gap-2 self-start sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/profile/edit')}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('common.edit') || 'Edit'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/my-properties')}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      {t('properties.title') || 'My Properties'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile info */}
          <Card className="mb-6 backdrop-blur-sm bg-background/95 shadow-sm">
            <CardContent className="pt-6">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {t('profile.currentPoints')}
                  </Label>
                  <p className="font-medium text-primary mb-2">{user.current_point || 0}</p>
                  <button
                    onClick={() => navigate('/point-management')}
                    className="text-xs text-primary hover:text-primary/80 hover:underline flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>{t('profile.managePoints') || 'Manage Points'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div>
                  <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {t('profile.memberLevel')}
                  </Label>
                  <p className="font-medium">
                    {user.member_level ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        {user.member_level}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('profile.memberSince')}
                  </Label>
                  <p className="font-medium">{formatDate(user.member_since)}</p>
                </div>

                {isCompany && (
                  <>
                    <div>
                      <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                        {user.verify_account ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {t('profile.accountVerification')}
                      </Label>
                      <p className="font-medium">
                        {user.verify_account ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            {t('profile.verified')}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            {t('profile.notVerified')}
                          </Badge>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('profile.location')}
                      </Label>
                      <p className="font-medium">{companyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('profile.companyAddress')}
                      </Label>
                      <p className="font-medium">{companyAddress}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Description */}
          {isCompany && companyDescription && (
            <Card className="mb-6 backdrop-blur-sm bg-background/95 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="h-5 w-5 text-primary" />
                  {t('profile.description')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{companyDescription}</p>
              </CardContent>
            </Card>
          )}

          {/* Account Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
              <CardContent className="pt-6 pb-6 px-4 sm:px-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-2 text-primary">
                  {user.my_property_listing?.sold_property_count || 0}
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">{t('profile.savedProperties')}</p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
              <CardContent className="pt-6 pb-6 px-4 sm:px-6 text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-2 text-primary">
                  {user.my_property_listing?.total_property_count || 0}
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">{t('profile.propertiesPosted')}</p>
              </CardContent>
            </Card>
            {(isCompany && user.account_statistics) ? (
              <Card className="backdrop-blur-sm bg-background/95 shadow-sm sm:col-span-2 lg:col-span-1">
                <CardContent className="pt-6 pb-6 px-4 sm:px-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      {user.account_statistics.view_count || 0}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base">{t('profile.viewCount')}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="backdrop-blur-sm bg-background/95 shadow-sm sm:col-span-2 lg:col-span-1">
                <CardContent className="pt-6 pb-6 px-4 sm:px-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <div className="text-2xl sm:text-3xl font-bold text-primary">0</div>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base">{t('profile.viewCount')}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <Card className="backdrop-blur-sm bg-background/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{t('profile.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/my-properties/create')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  {t('profile.postProperty')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/appointments')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('profile.bookAppointment')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('profile.settings')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/')}
                >
                  <Building className="h-4 w-4 mr-2" />
                  {t('profile.browseProperties')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
