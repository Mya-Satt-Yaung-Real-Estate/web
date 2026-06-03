/**
 * Company Detail Page
 * 
 * Displays a single company with detailed information.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompanyBySlug, useCompanyProperties, useCompanyAdvertisements } from '@/hooks/queries/useCompanies';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareModal } from '@/components/ui/ShareModal';
import { CompanyAdvertisementGridCard } from './CompanyAdvertisementGridCard';
import { CompanyAdvertisementListCard } from './CompanyAdvertisementListCard';
import { CompanyPropertyGridCard } from './CompanyPropertyGridCard';
import { CompanyPropertyListCard } from './CompanyPropertyListCard';
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
  Share2,
  Grid3x3,
  List,
  Megaphone,
} from 'lucide-react';

export default function CompanyDetail() {
  const { slug } = useParams<{ slug: string }>();
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
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="properties">{t('companies.tabs.properties')}</TabsTrigger>
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
                            <CompanyPropertyGridCard key={property.id} property={property} companySlug={slug || ''} />
                          ))}
                        </div>
                      )}

                      {/* List View */}
                      {viewMode === 'list' && (
                        <div className="space-y-4 mb-6">
                          {properties.map((property: Property) => (
                            <CompanyPropertyListCard key={property.id} property={property} companySlug={slug || ''} />
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
                            <CompanyAdvertisementGridCard key={advertisement.id} advertisement={advertisement} />
                          ))}
                        </div>
                      )}

                      {/* List View */}
                      {advertisementsViewMode === 'list' && (
                        <div className="space-y-4 mb-6">
                          {advertisements.map((advertisement: Advertisement) => (
                            <CompanyAdvertisementListCard key={advertisement.id} advertisement={advertisement} />
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

