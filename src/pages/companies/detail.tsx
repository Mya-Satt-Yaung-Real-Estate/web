/**
 * Company Detail Page
 * 
 * Displays a single company with detailed information.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCompanyBySlug, useCompanyProperties, useCompanyAdvertisements } from '@/hooks/queries/useCompanies';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareModal } from '@/components/ui/ShareModal';
import type { Property } from '@/types/properties';
import type { Advertisement } from '@/types/advertisement';
import { 
  ArrowLeft, 
  ArrowRight,
  Mail, 
  Phone,
  MapPin,
  Building2,
  Eye,
  Home,
  Globe,
  Star,
  Heart,
  MessageCircle,
  Bed,
  Bath,
  Square,
  Share2,
  Grid3x3,
  List,
  Megaphone,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function CompanyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const seo = seoUtils.getPageSEO('companies');
  const [activeTab, setActiveTab] = useState('properties');
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [advertisementsPage, setAdvertisementsPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [advertisementsViewMode, setAdvertisementsViewMode] = useState<'grid' | 'list'>('grid');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [allAdvertisements, setAllAdvertisements] = useState<Advertisement[]>([]);
  
  const { data: companyData, isLoading, error } = useCompanyBySlug(slug || '');
  const { data: propertiesData, isLoading: propertiesLoading, isFetching: propertiesFetching } = useCompanyProperties(
    slug || '', 
    { per_page: 12, page: propertiesPage }
  );
  const { data: advertisementsData, isLoading: advertisementsLoading, isFetching: advertisementsFetching } = useCompanyAdvertisements(
    slug || '',
    { per_page: 12, page: advertisementsPage }
  );

  // Reset properties when company changes
  useEffect(() => {
    setAllProperties([]);
    setPropertiesPage(1);
    setAllAdvertisements([]);
    setAdvertisementsPage(1);
  }, [slug]);

  // Reset data when switching tabs
  const prevTab = useRef(activeTab);
  useEffect(() => {
    if (prevTab.current !== 'properties' && activeTab === 'properties') {
      // Switching TO properties tab - reset and reload
      setAllProperties([]);
      setPropertiesPage(1);
    }
    if (prevTab.current !== 'advertisements' && activeTab === 'advertisements') {
      // Switching TO advertisements tab - reset and reload
      setAllAdvertisements([]);
      setAdvertisementsPage(1);
    }
    prevTab.current = activeTab;
  }, [activeTab]);

  // Accumulate properties when new page data arrives
  useEffect(() => {
    if (propertiesData?.data?.data && activeTab === 'properties') {
      const newProperties = propertiesData.data.data;
      if (propertiesPage === 1) {
        // First page - replace
        setAllProperties(newProperties);
      } else {
        // Subsequent pages - append (filter duplicates by id)
        setAllProperties(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newProperties.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
      }
    }
  }, [propertiesData, propertiesPage, activeTab]);

  // Accumulate advertisements when new page data arrives
  useEffect(() => {
    if (advertisementsData?.data?.data && activeTab === 'advertisements') {
      const newAdvertisements = advertisementsData.data.data;
      if (advertisementsPage === 1) {
        // First page - replace
        setAllAdvertisements(newAdvertisements);
      } else {
        // Subsequent pages - append (filter duplicates by id)
        setAllAdvertisements(prev => {
          const existingIds = new Set(prev.map((a: Advertisement) => a.id));
          const uniqueNew = newAdvertisements.filter((a: Advertisement) => !existingIds.has(a.id));
          return [...prev, ...uniqueNew];
        });
      }
    }
  }, [advertisementsData, advertisementsPage, activeTab]);

  if (isLoading) {
    return (
      <>
        <SEOHead seo={seo} path={`/companies/${slug}`} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !companyData?.data?.data) {
    return (
      <>
        <SEOHead seo={seo} path={`/companies/${slug}`} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('companies.notFound')}</h1>
              <p className="text-gray-600 mb-6">{t('companies.notFoundDesc')}</p>
              <Link to="/companies">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('companies.backToCompanies')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // API returns ApiResponse<CompanyDetailResponse>, so we need to unwrap
  const company = companyData.data.data;

  // Get member level display
  const getMemberLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  // Get member level color
  const getMemberLevelColor = (level: string) => {
    switch (level) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'gold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  // Property helper functions
  const getPropertyTitle = (property: Property) => (language === 'mm' ? property.title_mm : property.title_en);
  const getPropertyLocation = (property: Property) => {
    const region = language === 'mm' ? property.location?.region?.name_mm : property.location?.region?.name_en;
    const township = language === 'mm' ? property.location?.township?.name_mm : property.location?.township?.name_en;
    return region && township ? `${township}, ${region}` : '';
  };
  const getPropertyType = (property: Property) => (language === 'mm' ? property.property_type?.name_mm : property.property_type?.name_en) || '';
  const getListingType = (property: Property) => (language === 'mm' ? property.listing_type?.name_mm : property.listing_type?.name_en) || '';

  const properties = allProperties;
  const propertiesPagination = propertiesData?.data?.pagination;
  
  const advertisements = allAdvertisements;
  const advertisementsPagination = advertisementsData?.data?.pagination;
  
  const handleLoadMoreProperties = () => {
    if (propertiesPagination && propertiesPage < propertiesPagination.last_page) {
      setPropertiesPage(prev => prev + 1);
    }
  };

  const handleLoadMoreAdvertisements = () => {
    if (advertisementsPagination && advertisementsPage < advertisementsPagination.last_page) {
      setAdvertisementsPage(prev => prev + 1);
    }
  };

  // Advertisement helper functions
  const getAdvertisementTitle = (advertisement: Advertisement) => (language === 'mm' ? advertisement.title_mm : advertisement.title_en);
  const getAdvertisementLocation = (advertisement: Advertisement) => {
    const region = language === 'mm' ? advertisement.location?.region?.name_mm : advertisement.location?.region?.name_en;
    const township = language === 'mm' ? advertisement.location?.township?.name_mm : advertisement.location?.township?.name_en;
    if (region && township) return `${township}, ${region}`;
    if (region) return region;
    if (township) return township;
    return '';
  };

  return (
    <>
      <SEOHead seo={seo} path={`/companies/${slug}`} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Breadcrumbs */}
          <div className="mb-8">
            {/* Row 1: Breadcrumbs and Back Button */}
            <div className="flex items-center justify-between mb-6">
              <nav className="flex items-center gap-2 text-sm">
                <Link to="/companies" className="text-primary hover:text-primary/80 transition-colors">
                  {t('companies.title')}
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{t('companies.detail')}</span>
              </nav>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('companies.back')}
              </Button>
            </div>
          </div>

          {/* Company Info Section */}
          <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-border/50 mb-6 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="!pt-6 px-6 pb-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Company Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg">
                    <ImageWithFallback
                      src={company.company_profile}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  {/* Name and Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
                      {company.verification_status === 'approved' && (
                        <Badge className="bg-primary text-white border-primary shadow-md font-semibold">
                          {t('companies.verified')}
                        </Badge>
                      )}
                      <Badge variant="outline" className={getMemberLevelColor(company.member_level)}>
                        {getMemberLevelLabel(company.member_level)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <ShareModal
                        title={company.name}
                        url={window.location.href}
                      >
                        <Button variant="outline" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 flex-1 sm:flex-initial">
                          <Share2 className="h-4 w-4 mr-2" />
                          {t('companies.share')}
                        </Button>
                      </ShareModal>
                      {company.phone && (
                        <Button 
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-primary/10 text-primary hover:bg-primary/20 flex-1 sm:flex-initial"
                        >
                          <a href={`tel:${company.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            {t('companies.contact')}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Company Type */}
                  {company.company_type && (
                    <div className="mb-4">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        <Building2 className="h-3 w-3 mr-1" />
                        {language === 'mm' ? company.company_type.name_mm : company.company_type.name_en}
                      </Badge>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-background/50">
                      <Home className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-2xl font-bold">{company.property_count}</p>
                        <p className="text-xs text-muted-foreground">{t('companies.properties')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-background/50">
                      <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-2xl font-bold">{company.view_count}</p>
                        <p className="text-xs text-muted-foreground">{t('companies.views')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-background/50">
                      <Home className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-2xl font-bold">{company.wanted_count ?? 0}</p>
                        <p className="text-xs text-muted-foreground">{t('companies.wantedList')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {company.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{t('companies.about')}</h3>
                      <p className="text-muted-foreground leading-relaxed">{company.description}</p>
                    </div>
                  )}

                  {/* Location */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{t('companies.location')}</h3>
                    <div className="space-y-2">
                      {(company.region || company.township) && (
                        <div className="flex flex-wrap gap-2">
                          {company.region && (
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {language === 'mm' ? company.region.name_mm : company.region.name_en}
                            </Badge>
                          )}
                          {company.township && (
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {language === 'mm' ? company.township.name_mm : company.township.name_en}
                            </Badge>
                          )}
                        </div>
                      )}
                      {company.business_address && (
                        <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50">
                          <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{company.business_address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">{t('companies.contactInformation')}</h3>
                    <div className="space-y-2">
                      {company.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                          <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>{company.email}</span>
                        </div>
                      )}
                      {company.slug && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                          <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                          <a 
                            href={`${window.location.origin}/companies/${company.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            {`${window.location.origin}/companies/${company.slug}`}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-border/50 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="!pt-6 px-6 pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="properties">{t('companies.tabs.properties')}</TabsTrigger>
                  <TabsTrigger value="wanted-list">{t('companies.tabs.wantedList')}</TabsTrigger>
                  <TabsTrigger value="advertisements">{t('companies.tabs.advertisements')}</TabsTrigger>
                </TabsList>

                {/* Properties Tab */}
                <TabsContent value="properties" className="mt-6">
                  {/* View All Link and Toggle Buttons */}
                  {properties.length > 0 && !propertiesLoading && (
                    <div className="flex items-center justify-between mb-4">
                      <Link to="/search?type=property">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                          {t('companies.viewAllProperties')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border/50">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="h-8 px-3"
                        >
                          <Grid3x3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="h-8 px-3"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {propertiesLoading && propertiesPage === 1 ? (
                    viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse" />
                            <CardContent className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row gap-4 p-4">
                              <div className="w-full sm:w-64 h-48 sm:h-40 bg-gray-200 rounded-lg animate-pulse" />
                              <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )
                  ) : properties.length === 0 ? (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">{t('companies.noProperties')}</h3>
                      <p className="text-muted-foreground">{t('companies.noPropertiesDesc')}</p>
                    </div>
                  ) : (
                    <>
                      {/* Grid View */}
                      {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          {properties.map((property: Property) => (
                            <Card 
                              key={property.id} 
                              className="group hover:shadow-2xl transition-all border-2 border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
                              onClick={() => navigate(`/my-properties/${property.slug}`)}
                            >
                              {/* Image Section */}
                              <div className={`relative h-48 overflow-hidden ${
                                property.primary_image?.url ? '' : 'bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'
                              }`}>
                                <ImageWithFallback
                                  src={property.primary_image?.url || '/jade.png'}
                                  alt={getPropertyTitle(property)}
                                  className={`group-hover:scale-105 transition-transform duration-300 ${
                                    property.primary_image?.url ? 'w-full h-full object-cover' : 'max-w-[80%] max-h-[80%] object-contain'
                                  }`}
                                />

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                  {property.is_trending && (
                                    <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm">
                                      <Star className="h-3 w-3 mr-1" />
                                      {t('premium.badge')}
                                    </Badge>
                                  )}
                                  {property.tan_tan_tan && (
                                    <Badge variant="outline" className="bg-primary/90 text-white border-primary/50 backdrop-blur-sm">
                                      {t('categories.tantantan')}
                                    </Badge>
                                  )}
                                </div>

                                {/* Price */}
                                <div className="absolute bottom-3 left-3">
                                  <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                                    {property.formatted_price}
                                  </Badge>
                                </div>
                              </div>

                              <CardHeader className="space-y-3 pb-4">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                    {getPropertyTitle(property)}
                                  </h3>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {getPropertyType(property)}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {getListingType(property)}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                                {/* Location */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="line-clamp-1">{getPropertyLocation(property)}</span>
                                </div>

                                {/* Property Details */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground py-2 border-t border-border/50">
                                  {property.bedrooms && (
                                    <div className="flex items-center gap-1.5">
                                      <Bed className="h-4 w-4" />
                                      <span>{property.bedrooms}</span>
                                    </div>
                                  )}
                                  {property.bathrooms && (
                                    <div className="flex items-center gap-1.5">
                                      <Bath className="h-4 w-4" />
                                      <span>{property.bathrooms}</span>
                                    </div>
                                  )}
                                  {property.area_sqft && (
                                    <div className="flex items-center gap-1.5">
                                      <Square className="h-4 w-4" />
                                      <span>{property.area_sqft} sqft</span>
                                    </div>
                                  )}
                                </div>

                                {/* Statistics */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4 text-primary" />
                                    <span>{property.stats?.view_count ?? 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4 text-red-500" />
                                    <span>{property.stats?.favorite_count ?? 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1 ml-auto">
                                    <MessageCircle className="h-4 w-4 text-primary" />
                                    <span>{property.stats?.comment_count ?? 0}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* List View */}
                      {viewMode === 'list' && (
                        <div className="space-y-4 mb-6">
                        {properties.map((property: Property) => (
                          <Card 
                            key={property.id} 
                            className="group hover:shadow-xl transition-all border-2 border-border/50 backdrop-blur-sm overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
                            onClick={() => navigate(`/properties/detail/${property.slug}`)}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                              {/* Image Section */}
                              <div className="flex flex-col w-full sm:w-64 flex-shrink-0 gap-2">
                                <div className={`relative w-full h-48 sm:h-40 overflow-hidden rounded-lg ${
                                  property.primary_image?.url ? '' : 'bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'
                                }`}>
                                  <ImageWithFallback
                                    src={property.primary_image?.url || '/jade.png'}
                                    alt={getPropertyTitle(property)}
                                    className={`group-hover:scale-105 transition-transform duration-300 ${
                                      property.primary_image?.url ? 'w-full h-full object-cover' : 'max-w-[80%] max-h-[80%] object-contain'
                                    }`}
                                  />

                                  {/* Badges */}
                                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                                    {property.is_trending && (
                                      <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm text-xs">
                                        <Star className="h-3 w-3 mr-1" />
                                        {t('premium.badge')}
                                      </Badge>
                                    )}
                                    {property.tan_tan_tan && (
                                      <Badge variant="outline" className="bg-primary/90 text-white border-primary/50 backdrop-blur-sm text-xs">
                                        {t('categories.tantantan')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Price - Below Image */}
                                <div>
                                  <Badge className="bg-primary text-white border-primary text-sm font-semibold">
                                    {property.formatted_price}
                                  </Badge>
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="flex-1 flex flex-col min-w-0">
                                <div className="space-y-3">
                                  {/* Title, Badges, and Statistics */}
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                      <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                        {getPropertyTitle(property)}
                                      </h3>
                                      <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {getPropertyType(property)}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {getListingType(property)}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Statistics - Top Right */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5 text-primary" />
                                        <span>{property.stats?.view_count ?? 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Heart className="h-3.5 w-3.5 text-red-500" />
                                        <span>{property.stats?.favorite_count ?? 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MessageCircle className="h-3.5 w-3.5 text-primary" />
                                        <span>{property.stats?.comment_count ?? 0}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Location */}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="line-clamp-1">{getPropertyLocation(property)}</span>
                                  </div>

                                  {/* Property Details */}
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-t border-border/50">
                                    {property.area_sqft && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground">{t('properties.area')}:</span>
                                        <span className="text-sm font-medium">{property.area_sqft} sqft</span>
                                      </div>
                                    )}
                                    {property.bedrooms && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground">{t('properties.bedrooms')}:</span>
                                        <span className="text-sm font-medium">{property.bedrooms}</span>
                                      </div>
                                    )}
                                    {property.bathrooms && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground">{t('properties.bathrooms')}:</span>
                                        <span className="text-sm font-medium">{property.bathrooms}</span>
                                      </div>
                                    )}
                                    {property.length && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground">{t('properties.length')}:</span>
                                        <span className="text-sm font-medium">{property.length} ft</span>
                                      </div>
                                    )}
                                    {property.width && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-xs text-muted-foreground">{t('properties.width')}:</span>
                                        <span className="text-sm font-medium">{property.width} ft</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Address */}
                                  {property.location?.address && (
                                    <div className="pt-2 border-t border-border/50">
                                      <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <span className="text-xs text-muted-foreground block mb-1">{t('properties.address')}:</span>
                                          <span className="text-sm">{property.location.address}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                        </div>
                      )}

                      {/* Load More Button */}
                      {propertiesPagination && propertiesPage < propertiesPagination.last_page && (
                        <div className="flex justify-center mt-6">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleLoadMoreProperties}
                            disabled={propertiesFetching || propertiesLoading}
                            className="min-w-[200px]"
                          >
                            {propertiesFetching || propertiesLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                {t('forms.loadMore')}...
                              </>
                            ) : (
                              t('forms.loadMore')
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Wanted List Tab */}
                <TabsContent value="wanted-list" className="mt-6">
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">{t('companies.comingSoon')}</h3>
                    <p className="text-muted-foreground">{t('companies.comingSoonWanted')}</p>
                  </div>
                </TabsContent>

                {/* Advertisements Tab */}
                <TabsContent value="advertisements" className="mt-6">
                  {/* View All Link and Toggle Buttons */}
                  {advertisements.length > 0 && !advertisementsLoading && (
                    <div className="flex items-center justify-between mb-4">
                      <Link to="/search?type=advertisement">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                          {t('ads.viewAll')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border/50">
                        <Button
                          variant={advertisementsViewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setAdvertisementsViewMode('grid')}
                          className="h-8 px-3"
                        >
                          <Grid3x3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={advertisementsViewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setAdvertisementsViewMode('list')}
                          className="h-8 px-3"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {advertisementsLoading && advertisementsPage === 1 ? (
                    advertisementsViewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse" />
                            <CardContent className="p-4 space-y-3">
                              <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row gap-4 p-4">
                              <div className="w-full sm:w-64 h-48 sm:h-40 bg-gray-200 rounded-lg animate-pulse" />
                              <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )
                  ) : advertisements.length === 0 ? (
                    <div className="text-center py-12">
                      <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">{t('advertisements.noResults')}</h3>
                      <p className="text-muted-foreground">{t('advertisements.noResultsDesc') || "This company hasn't posted any advertisements yet."}</p>
                    </div>
                  ) : (
                    <>
                      {/* Grid View */}
                      {advertisementsViewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          {advertisements.map((advertisement: Advertisement) => (
                            <Card 
                              key={advertisement.id} 
                              className="group hover:shadow-2xl transition-all border-2 border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
                              onClick={() => navigate(`/advertisements/detail/${advertisement.id}`)}
                            >
                              {/* Image Section */}
                              <div className={`relative h-48 overflow-hidden ${
                                advertisement.media?.primary_image ? '' : 'bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'
                              }`}>
                                <ImageWithFallback
                                  src={advertisement.media?.primary_image?.url || '/jade.png'}
                                  alt={getAdvertisementTitle(advertisement)}
                                  className={`group-hover:scale-105 transition-transform duration-300 ${
                                    advertisement.media?.primary_image ? 'w-full h-full object-cover' : 'max-w-[80%] max-h-[80%] object-contain'
                                  }`}
                                />

                                {/* Featured Badge */}
                                {advertisement.is_featured && (
                                  <div className="absolute top-3 left-3">
                                    <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      {t('advertisements.featured')}
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              <CardHeader className="space-y-3 pb-4">
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                    {getAdvertisementTitle(advertisement)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {advertisement.description}
                                  </p>
                                </div>
                              </CardHeader>

                              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                                {/* Location */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {getAdvertisementLocation(advertisement) || t('advertisements.locationNotSpecified')}
                                  </span>
                                </div>

                                {/* Statistics */}
                                <div className="grid grid-cols-2 gap-4 py-2 border-t border-border/50">
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                      <BarChart3 className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{advertisement.stats?.view_count ?? 0}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t('advertisements.views')}</p>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                      <Heart className="h-4 w-4 text-red-500" />
                                      <span className="font-medium">{advertisement.stats?.favorite_count ?? 0}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{t('advertisements.favorites')}</p>
                                  </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-2 border-t border-border/50">
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                                      {t('advertisements.created')} {new Date(advertisement.dates?.created_at || Date.now()).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* List View */}
                      {advertisementsViewMode === 'list' && (
                        <div className="space-y-4 mb-6">
                        {advertisements.map((advertisement: Advertisement) => (
                          <Card 
                            key={advertisement.id} 
                            className="group hover:shadow-xl transition-all border-2 border-border/50 backdrop-blur-sm overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
                            onClick={() => navigate(`/advertisements/detail/${advertisement.id}`)}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                              {/* Image Section */}
                              <div className="flex flex-col w-full sm:w-64 flex-shrink-0 gap-2">
                                <div className={`relative w-full h-48 sm:h-40 overflow-hidden rounded-lg ${
                                  advertisement.media?.primary_image ? '' : 'bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'
                                }`}>
                                  <ImageWithFallback
                                    src={advertisement.media?.primary_image?.url || '/jade.png'}
                                    alt={getAdvertisementTitle(advertisement)}
                                    className={`group-hover:scale-105 transition-transform duration-300 ${
                                      advertisement.media?.primary_image ? 'w-full h-full object-cover' : 'max-w-[80%] max-h-[80%] object-contain'
                                    }`}
                                  />

                                  {/* Featured Badge */}
                                  {advertisement.is_featured && (
                                    <div className="absolute top-2 left-2">
                                      <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm text-xs">
                                        <Star className="h-3 w-3 mr-1" />
                                        {t('advertisements.featured')}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Content Section */}
                              <div className="flex-1 flex flex-col min-w-0">
                                <div className="space-y-3">
                                  {/* Title, Badges, and Statistics */}
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                      <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                        {getAdvertisementTitle(advertisement)}
                                      </h3>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {advertisement.description}
                                      </p>
                                    </div>

                                    {/* Statistics - Top Right */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                                      <div className="flex items-center gap-1">
                                        <BarChart3 className="h-3.5 w-3.5 text-primary" />
                                        <span>{advertisement.stats?.view_count ?? 0}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Heart className="h-3.5 w-3.5 text-red-500" />
                                        <span>{advertisement.stats?.favorite_count ?? 0}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Location */}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="line-clamp-1">
                                      {getAdvertisementLocation(advertisement) || t('advertisements.locationNotSpecified')}
                                    </span>
                                  </div>

                                  {/* Address */}
                                  {advertisement.location?.address && (
                                    <div className="pt-2 border-t border-border/50">
                                      <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <span className="text-xs text-muted-foreground block mb-1">{t('properties.address')}:</span>
                                          <span className="text-sm">{advertisement.location.address}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Footer */}
                                  <div className="pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <Calendar className="h-3.5 w-3.5" />
                                      <span>
                                        {t('advertisements.created')} {new Date(advertisement.dates?.created_at || Date.now()).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                        </div>
                      )}

                      {/* Load More Button */}
                      {advertisementsPagination && advertisementsPage < advertisementsPagination.last_page && (
                        <div className="flex justify-center mt-6">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={handleLoadMoreAdvertisements}
                            disabled={advertisementsFetching || advertisementsLoading}
                            className="min-w-[200px]"
                          >
                            {advertisementsFetching || advertisementsLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                {t('forms.loadMore')}...
                              </>
                            ) : (
                              t('forms.loadMore')
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

