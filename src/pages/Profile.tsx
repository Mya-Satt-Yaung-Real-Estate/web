import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building, Calendar, MapPin, Settings, Home, CheckCircle, XCircle, Star, Eye, ArrowLeft, Edit, Award, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';

export function Profile() {
  const { user, isAuthenticated } = useAuthStore();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('profile');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);

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
  const companyName = user.personal_information?.company_name || 'N/A';
  const companyAddress = user.personal_information?.business_address || 'N/A';
  const companyDescription = user.personal_information?.description || '';
  const companyLocation = language === 'mm' 
    ? user.personal_information?.location_mm 
    : user.personal_information?.location_en || '';
  const companyType = language === 'mm'
    ? user.personal_information?.company_type_mm
    : user.personal_information?.company_type_en || '';

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

          {/* Profile Card */}
          <Card className="mb-6 backdrop-blur-sm bg-background/95 shadow-sm">
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <Button variant="outline" size="sm" onClick={() => navigate('/profile/edit')} className="text-xs sm:text-sm">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t('common.edit') || 'Edit'}</span>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pr-20 sm:pr-0">
                {/* Avatar */}
                {user.profile_image_url ? (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex-shrink-0">
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
                            <div class="w-full h-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white text-xl sm:text-2xl font-semibold">
                              ${getInitials(user.name)}
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white text-xl sm:text-2xl font-semibold border-4 border-primary/20 shadow-lg flex-shrink-0">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 pt-0 sm:pt-2 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold break-words">{user.name}</h2>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 w-fit">
                      {isCompany ? t('profile.company') : t('profile.individual')}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="break-words text-sm sm:text-base">{user.email}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="break-words text-sm sm:text-base">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Separator className="mb-6" />
              
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
                        <Building className="h-4 w-4" />
                        {t('profile.companyName')}
                      </Label>
                      <p className="font-medium">{companyName}</p>
                    </div>
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
                        <Building className="h-4 w-4" />
                        {t('profile.companyType')}
                      </Label>
                      <p className="font-medium">{companyType || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
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

          {/* Account Statistics - Horizontal Layout */}
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

