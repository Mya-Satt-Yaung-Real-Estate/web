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
import { CompanyAdvertisementGridCard } from './CompanyAdvertisementGridCard';
import { CompanyAdvertisementListCard } from './CompanyAdvertisementListCard';
import { CompanyPropertyGridCard } from './CompanyPropertyGridCard';
import { CompanyPropertyListCard } from './CompanyPropertyListCard';
import { toast } from 'sonner';
import { formatMemberLevelLabel, getMemberLevelBadgeClass } from '@/lib/memberLevel';
import type { Property } from '@/types/properties';
import type { Advertisement } from '@/types/advertisement';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Eye,
  Home,
  Globe,
  Grid3x3,
  List,
  Megaphone,
  Share2,
  CheckCircle,
  Award,
} from 'lucide-react';

const DEFAULT_COVER_IMAGE = 'https://msy-demo.s3.ap-southeast-1.amazonaws.com/default/default-cover.jpeg';

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

  const properties = allProperties;
  const propertiesPagination = propertiesData?.data?.pagination;

  const advertisements = allAdvertisements;
  const advertisementsPagination = advertisementsData?.data?.pagination;
  const coverImageUrl = company.cover_image_url || DEFAULT_COVER_IMAGE;
  const advertisementCount = company.advertisement_count ?? advertisementsPagination?.total ?? 0;

  const handleShare = async () => {
    const url = `${window.location.origin}/companies/${company.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: company.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(t('companies.linkCopied') || 'Link copied to clipboard');
    } catch {
      // User cancelled share or clipboard unavailable
    }
  };

  const handleContact = () => {
    if (company.phone) {
      window.location.href = `tel:${company.phone}`;
      return;
    }
    if (company.email) {
      window.location.href = `mailto:${company.email}`;
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cover + profile header */}
          <Card className="mb-6 overflow-visible border-border/60 bg-background/95 shadow-sm">
            <div className="relative">
              <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted sm:aspect-[3/1]">
                <ImageWithFallback
                  src={coverImageUrl}
                  alt={`${company.name} cover`}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/90 to-transparent sm:h-20" />
              </div>

              <div className="absolute bottom-0 left-3 z-10 h-24 w-24 translate-y-[65%] overflow-hidden rounded-full border-4 border-background bg-background shadow-lg sm:left-6 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:left-8 lg:h-48 lg:w-48">
                <ImageWithFallback
                  src={company.company_profile || '/jade.png'}
                  alt={company.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="px-4 pb-4 pt-0 sm:px-6 lg:px-8">
              <div className="flex gap-3 sm:gap-4 md:gap-6">
                <div
                  className="w-24 flex-shrink-0 sm:w-36 md:w-40 lg:w-48"
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2 pt-4 sm:pt-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                        {company.name}
                      </h1>
                      {company.verification_status === 'approved' && (
                        <Badge className="border-green-300 bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3.5 w-3.5" />
                          {t('companies.verified')}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`${getMemberLevelBadgeClass(company.member_level)} shadow-sm`}>
                        <Award className="mr-1 h-3.5 w-3.5" />
                        {formatMemberLevelLabel(company.member_level)}
                      </Badge>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 md:w-auto">
                      <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 md:flex-none">
                        <Share2 className="mr-2 h-4 w-4" />
                        {t('companies.share')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleContact} disabled={!company.phone && !company.email} className="flex-1 md:flex-none">
                        <Mail className="mr-2 h-4 w-4" />
                        {t('companies.contact')}
                      </Button>
                    </div>
                  </div>

                  {company.company_type && (
                    <p className="text-sm font-medium text-muted-foreground sm:text-base">
                      {language === 'mm' ? company.company_type.name_mm : company.company_type.name_en}
                    </p>
                  )}

                  <div className="flex flex-col gap-1.5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Home className="h-4 w-4 shrink-0" />
                      {company.property_count} {t('companies.properties')}
                    </span>
                    <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Megaphone className="h-4 w-4 shrink-0" />
                      {advertisementCount} {t('companies.advertisements')}
                    </span>
                    <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4 shrink-0" />
                      {company.view_count} {t('companies.views')}
                    </span>
                  </div>

                  {company.slug && (
                    <a
                      href={`${window.location.origin}/companies/${company.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex max-w-full items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{`${window.location.host}/companies/${company.slug}`}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Company Sidebar */}
            <aside className="space-y-4 lg:col-span-1">
              <Card className="border-border/60 bg-background/95 shadow-lg">
                <CardContent className="px-5 pb-5 pt-6">
                  <h3 className="mb-3 text-sm font-semibold">{t('companies.about')}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {company.description || t('companies.noDescription') || 'No description provided.'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/95 shadow-lg">
                <CardContent className="px-5 pb-5 pt-6">
                  <h3 className="mb-3 text-sm font-semibold">{t('companies.location')}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {(company.region || company.township) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>
                          {[company.township && (language === 'mm' ? company.township.name_mm : company.township.name_en), company.region && (language === 'mm' ? company.region.name_mm : company.region.name_en)].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {company.business_address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{company.business_address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/95 shadow-lg">
                <CardContent className="px-5 pb-5 pt-6">
                  <h3 className="mb-3 text-sm font-semibold">{t('companies.contactInformation')}</h3>
                  <div className="space-y-3 text-sm">
                    {company.phone && (
                      <a href={`tel:${company.phone}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                        <Phone className="h-4 w-4 text-primary" />
                        {company.phone}
                      </a>
                    )}
                    {company.email && (
                      <a href={`mailto:${company.email}`} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                        <Mail className="h-4 w-4 text-primary" />
                        {company.email}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-background/95 shadow-lg">
                <CardContent className="px-5 pb-5 pt-6">
                  <h3 className="mb-3 text-sm font-semibold">{t('companies.serviceAreas') || 'Service Areas'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.region && (
                      <Badge variant="outline" className="bg-primary/5 text-primary">
                        {language === 'mm' ? company.region.name_mm : company.region.name_en}
                      </Badge>
                    )}
                    {company.township && (
                      <Badge variant="outline" className="bg-primary/5 text-primary">
                        {language === 'mm' ? company.township.name_mm : company.township.name_en}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </aside>

            <main className="lg:col-span-3">
              {/* Tabs Section */}
              <Card className="bg-background/95 border-border/60 shadow-lg">
                <CardContent className="!pt-6 px-6 pb-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mx-auto mb-4 flex h-auto w-fit flex-wrap gap-8 rounded-none bg-transparent p-0">
                      <TabsTrigger
                        value="properties"
                        className="h-11 min-w-[170px] flex-none rounded-full border border-primary/40 bg-background px-6 text-primary shadow-sm hover:bg-primary/10 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        {t('companies.viewProperties') || t('companies.tabs.properties')} ({company.property_count})
                      </TabsTrigger>
                      <TabsTrigger
                        value="advertisements"
                        className="h-11 min-w-[190px] flex-none rounded-full border border-primary/40 bg-background px-6 text-primary shadow-sm hover:bg-primary/10 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        <Megaphone className="mr-2 h-4 w-4" />
                        {t('companies.viewAdvertisement') || 'View Advertisement'} ({advertisementCount})
                      </TabsTrigger>
                    </TabsList>

                    {/* Properties Tab */}
                    <TabsContent value="properties" className="mt-2">
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
                    <TabsContent value="advertisements" className="mt-2">
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
                          <h3 className="text-lg font-semibold mb-2">{t('companies.noAdvertisements')}</h3>
                          <p className="text-muted-foreground">{t('companies.noAdvertisementsDesc')}</p>
                        </div>
                      ) : (
                        <>
                          {/* Grid View */}
                          {advertisementsViewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                              {advertisements.map((advertisement: Advertisement) => (
                                <CompanyAdvertisementGridCard key={advertisement.id} advertisement={advertisement} companySlug={slug || ''} />
                              ))}
                            </div>
                          )}

                          {/* List View */}
                          {advertisementsViewMode === 'list' && (
                            <div className="space-y-4 mb-6">
                              {advertisements.map((advertisement: Advertisement) => (
                                <CompanyAdvertisementListCard key={advertisement.id} advertisement={advertisement} companySlug={slug || ''} />
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
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

