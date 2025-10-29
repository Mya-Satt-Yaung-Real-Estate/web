import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Home, Bed, Bath, Square, Phone, Mail, Edit, Trash2, Share2, Users, CheckCircle, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { ShareModal } from '@/components/ui/ShareModal';
import { useWantingList } from '@/hooks/queries/useWantingList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDeleteWantingList } from '@/hooks/mutations';
import { Skeleton } from '@/components/ui/skeleton';

export default function WantingListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const seo = seoUtils.getPageSEO('myWantedList');
  
  // Fetch wanting list data
  const { data: wantingListData, isLoading, error } = useWantingList(id || '');
  const deleteWantingListMutation = useDeleteWantingList();

  const wantingList = wantingListData?.data;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this wanted listing?')) {
      if (id) {
        deleteWantingListMutation.mutate(id, {
          onSuccess: () => {
            navigate('/my-wanted-listings/list');
          },
        });
      }
    }
  };

  const getVerificationStatusColor = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    if (verificationStatus === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (verificationStatus === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (verificationStatus === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getVerificationStatusLabel = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return t('myWantedList.expired');
    if (verificationStatus === 'approved') return t('myWantedList.approved');
    if (verificationStatus === 'pending') return t('myWantedList.pending');
    if (verificationStatus === 'rejected') return t('myWantedList.rejected');
    return verificationStatus;
  };

  // Helper function to get property type name
  const getPropertyTypeName = () => {
    if (!wantingList?.property_type) return '';
    return language === 'mm' ? wantingList.property_type.name_mm : wantingList.property_type.name_en;
  };

  // Helper function to get location string
  const getLocationString = () => {
    if (!wantingList) return '';
    // Check both possible structures (API might use preferred_location or location)
    const location = (wantingList as any).preferred_location || wantingList.location;
    if (!location) return '';
    
    if (location.region && location.township) {
      const region = language === 'mm' 
        ? location.region.name_mm 
        : location.region.name_en;
      const township = language === 'mm'
        ? location.township.name_mm
        : location.township.name_en;
      return `${region}, ${township}`;
    }
    
    // Fallback for string-based location
    if (typeof location === 'string') return location;
    if (location.region_en && location.township_en) {
      return language === 'mm' 
        ? `${location.region_mm}, ${location.township_mm}`
        : `${location.region_en}, ${location.township_en}`;
    }
    return '';
  };

  // Helper function to get area range display
  const getAreaRange = () => {
    if (!wantingList?.specifications?.area_range) return '';
    return wantingList.specifications.area_range;
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <SEOHead seo={seo} path={`/my-wanted-listings/detail/${id}`} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !wantingList) {
    return (
      <>
        <SEOHead seo={seo} path={`/my-wanted-listings/detail/${id}`} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">{t('myWantedList.errorLoadingDetail')}</p>
                <Button onClick={() => navigate('/my-wanted-listings/list')} className="mt-4">
                  {t('myWantedList.backToList')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Note: verification_status might not be in API response, defaulting to 'pending' if not available
  const verificationStatus = wantingList.status?.verification_status || 'pending';
  const isExpired = wantingList.status?.is_expired || false;

  return (
    <>
      <SEOHead seo={seo} path={`/my-wanted-listings/detail/${id}`} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Breadcrumbs */}
          <div className="mb-8">
            {/* Row 1: Breadcrumbs and Back Button */}
            <div className="flex items-center justify-between mb-6">
              <nav className="flex items-center gap-2 text-sm">
                <Link to="/my-wanted-listings/list" className="text-primary hover:text-primary/80 transition-colors">
                  {t('myWantedList.title')}
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{t('myWantedList.detail')}</span>
              </nav>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('myWantedList.back')}
              </Button>
            </div>

            {/* Row 2: Title/Badges and Actions */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {wantingList.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={wantingList.wanted_type === 'buyer' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'}
                  >
                    {wantingList.wanted_type_label || (wantingList.wanted_type === 'buyer' ? t('myWantedList.buyer') : t('myWantedList.renter'))}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={getVerificationStatusColor(verificationStatus, isExpired)}
                  >
                    {getVerificationStatusLabel(verificationStatus, isExpired)}
                  </Badge>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {verificationStatus === 'approved' && (
                  <ShareModal
                    title={wantingList.title}
                    url={window.location.href}
                  >
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Share2 className="h-4 w-4 mr-2" />
                      {t('myWantedList.share')}
                    </Button>
                  </ShareModal>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('myWantedList.actions')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {verificationStatus === 'pending' && (
                      <DropdownMenuItem asChild>
                        <Link to={`/my-wanted-listings/edit/${id}`}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('myWantedList.edit')}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('myWantedList.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Property Summary - Horizontal Row */}
          <Card className="border-border/50 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Property Overview */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Home className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{t('myWantedList.propertyType')}</h3>
                    <p className="text-sm text-muted-foreground">{getPropertyTypeName()}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{t('myWantedList.preferLocation')}</h3>
                    <p className="text-sm text-muted-foreground">{getLocationString()}</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{t('myWantedList.budgetRange')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {wantingList.budget?.budget_range || 
                        (wantingList.budget?.min_budget && wantingList.budget?.max_budget
                          ? `${t('myWantedList.min')} ${(wantingList.budget.min_budget / 1000000).toFixed(0)}MMK - ${t('myWantedList.max')} ${(wantingList.budget.max_budget / 1000000).toFixed(0)}MMK`
                          : '')
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simple Card Sections */}
          <div className="space-y-6">
            {/* Description & Requirements Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Home className="h-4 w-4 text-primary" />
                  {t('myWantedList.descriptionRequirements')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">{t('myWantedList.propertyDescription')}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {wantingList.description || t('myWantedList.noDescription')}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">{t('myWantedList.propertySpecifications')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {wantingList.specifications?.bedrooms && (
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Bed className="h-4 w-4 text-primary mx-auto mb-2" />
                        <div className="text-sm font-medium">{t('myWantedList.bedrooms')}</div>
                        <div className="text-xs text-muted-foreground">{wantingList.specifications.bedrooms}</div>
                      </div>
                    )}
                    {wantingList.specifications?.bathrooms && (
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Bath className="h-4 w-4 text-primary mx-auto mb-2" />
                        <div className="text-sm font-medium">{t('myWantedList.bathrooms')}</div>
                        <div className="text-xs text-muted-foreground">{wantingList.specifications.bathrooms}</div>
                      </div>
                    )}
                    {getAreaRange() && (
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Square className="h-4 w-4 text-primary mx-auto mb-2" />
                        <div className="text-sm font-medium">{t('myWantedList.areaRange')}</div>
                        <div className="text-xs text-muted-foreground">{getAreaRange()}</div>
                      </div>
                    )}
                    {wantingList.property_type && (
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <Building className="h-4 w-4 text-primary mx-auto mb-2" />
                        <div className="text-sm font-medium">{t('myWantedList.propertyType')}</div>
                        <div className="text-xs text-muted-foreground">{getPropertyTypeName()}</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Requirements Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {t('myWantedList.additionalRequirements')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {wantingList.additional_requirement && (
                  <div>
                    <h4 className="font-semibold mb-3">{t('myWantedList.specialRequirements')}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {wantingList.additional_requirement}
                    </p>
                  </div>
                )}

                <Separator />

              </CardContent>
            </Card>

            {/* Contact Information Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  {t('myWantedList.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  {/* Name Column */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">
                        {wantingList.contact?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{wantingList.contact?.name || t('myWantedList.notAvailable')}</h3>
                    </div>
                  </div>
                  
                  {/* Phone Column */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs text-muted-foreground">{t('myWantedList.phone')}</span>
                      <p className="text-sm font-medium">{wantingList.contact?.phone || t('myWantedList.notAvailable')}</p>
                    </div>
                  </div>
                  
                  {/* Email Column */}
                  {wantingList.contact?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-xs text-muted-foreground">{t('myWantedList.email')}</span>
                        <p className="text-sm font-medium">{wantingList.contact.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                    <Phone className="h-3 w-3 mr-2" />
                    {t('myWantedList.callNow')}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-3 w-3 mr-2" />
                    {t('myWantedList.share')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
