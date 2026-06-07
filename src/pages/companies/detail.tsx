/**
 * Company Detail Page
 * 
 * Displays a single company with detailed information.
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompanyBySlug, useCompanyProperties, useCompanyAdvertisements, useCompanyWantedLists } from '@/hooks/queries/useCompanies';
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
import { WantedListingCard } from '@/pages/publicProperties/components/WantedListingCard';
import type { Property } from '@/types/properties';
import type { Advertisement } from '@/types/advertisement';
import type { WantedList as WantedListItem } from '@/types/wantedList';
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
  Calendar,
  Search,
} from 'lucide-react';

export default function CompanyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const seo = seoUtils.getPageSEO('companies');
  const [activeTab, setActiveTab] = useState('properties');
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [advertisementsPage, setAdvertisementsPage] = useState(1);
  const [wantedListsPage, setWantedListsPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [advertisementsViewMode, setAdvertisementsViewMode] = useState<'grid' | 'list'>('grid');
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [allAdvertisements, setAllAdvertisements] = useState<Advertisement[]>([]);
  const [allWantedLists, setAllWantedLists] = useState<WantedListItem[]>([]);

  const { data: companyData, isLoading, error } = useCompanyBySlug(slug || '');
  const { data: propertiesData, isLoading: propertiesLoading, isFetching: propertiesFetching } = useCompanyProperties(
    slug || '',
    { per_page: 12, page: propertiesPage }
  );
  const { data: advertisementsData, isLoading: advertisementsLoading, isFetching: advertisementsFetching } = useCompanyAdvertisements(
    slug || '',
    { per_page: 12, page: advertisementsPage }
  );
  const { data: wantedListsData, isLoading: wantedListsLoading, isFetching: wantedListsFetching } = useCompanyWantedLists(
    slug || '',
    { per_page: 12, page: wantedListsPage }
  );

  // Reset properties when company changes
  useEffect(() => {
    setAllProperties([]);
    setPropertiesPage(1);
    setAllAdvertisements([]);
    setAdvertisementsPage(1);
    setAllWantedLists([]);
    setWantedListsPage(1);
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
    if (prevTab.current !== 'wanted' && activeTab === 'wanted') {
      // Switching TO wanted tab - reset and reload
      setAllWantedLists([]);
      setWantedListsPage(1);
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

  // Accumulate wanted lists when new page data arrives
  useEffect(() => {
    if (wantedListsData?.data?.data && activeTab === 'wanted') {
      const newWantedLists = wantedListsData.data.data;
      if (wantedListsPage === 1) {
        setAllWantedLists(newWantedLists);
      } else {
        setAllWantedLists(prev => {
          const existingIds = new Set(prev.map((wanted: WantedListItem) => wanted.id));
          const uniqueNew = newWantedLists.filter((wanted: WantedListItem) => !existingIds.has(wanted.id));
          return [...prev, ...uniqueNew];
        });
      }
    }
  }, [wantedListsData, wantedListsPage, activeTab]);

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
  const wantedLists = allWantedLists;
  const wantedListsPagination = wantedListsData?.data?.pagination;
  const companySinceYear = company.createdAt ? new Date(company.createdAt).getFullYear() : null;

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

  const handleLoadMoreWantedLists = () => {
    if (wantedListsPagination && wantedListsPage < wantedListsPagination.last_page) {
      setWantedListsPage(prev => prev + 1);
    }
  };

  return (
    <>
      <SEOHead seo={seo} path={`/companies/${slug}`} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Banner */}
          <div className="relative mb-6 overflow-hidden rounded-lg border border-primary/10 bg-gradient-to-br from-primary/20 via-primary/10 to-background shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(62,151,125,0.22),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(62,151,125,0.14),_transparent_32%)]" />
            <div className="relative flex min-h-[240px] items-end px-6 pb-6 pt-8 sm:px-8 lg:min-h-[280px] lg:px-12">
              <div className="flex items-end gap-5 sm:gap-7">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                  <ImageWithFallback
                    src={company.company_profile || '/jade.png'}
                    alt={company.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 text-foreground">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{company.name}</h1>
                    {company.verification_status === 'approved' && (
                      <Badge className="bg-primary text-white shadow-md">
                        {t('companies.verified')}
                      </Badge>
                    )}
                    <Badge variant="outline" className={`${getMemberLevelColor(company.member_level)} bg-white/90 shadow-sm`}>
                      {getMemberLevelLabel(company.member_level)}
                    </Badge>
                  </div>

                  {company.company_type && (
                    <div className="mb-5 text-base font-semibold text-primary sm:text-lg">
                      {language === 'mm' ? company.company_type.name_mm : company.company_type.name_en}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Home className="h-4 w-4" />
                      {company.property_count} {t('companies.properties')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {company.view_count} {t('companies.views')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Megaphone className="h-4 w-4" />
                      {advertisementsPagination?.total ?? advertisements.length} {t('companies.tabs.advertisements')}
                    </span>
                    {companySinceYear && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Since {companySinceYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    {company.slug && (
                      <a href={`${window.location.origin}/companies/${company.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
                        <Globe className="h-4 w-4 text-primary" />
                        <span className="truncate">{`${window.location.host}/companies/${company.slug}`}</span>
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
                        {t('companies.viewProperties') || t('companies.tabs.properties')}
                      </TabsTrigger>
                      <TabsTrigger
                        value="wanted"
                        className="h-11 min-w-[170px] flex-none rounded-full border border-primary/40 bg-background px-6 text-primary shadow-sm hover:bg-primary/10 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {t('companies.tabs.wantedList') || 'Wanted List'}
                      </TabsTrigger>
                      <TabsTrigger
                        value="advertisements"
                        className="h-11 min-w-[190px] flex-none rounded-full border border-primary/40 bg-background px-6 text-primary shadow-sm hover:bg-primary/10 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
                      >
                        <Megaphone className="mr-2 h-4 w-4" />
                        {t('companies.viewAdvertisement') || 'View Advertisement'}
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

                    {/* Wanted List Tab */}
                    <TabsContent value="wanted" className="mt-2">
                      {wantedLists.length > 0 && !wantedListsLoading && (
                        <div className="flex items-center justify-between mb-4">
                          <Link to="/search?type=wanted">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                              {t('companies.viewAllWantedLists') || 'View all wanted lists'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      )}

                      {wantedListsLoading && wantedListsPage === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                              <CardContent className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : wantedLists.length === 0 ? (
                        <div className="text-center py-12">
                          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-semibold mb-2">{t('search.noWantedListings') || 'No wanted listings found'}</h3>
                          <p className="text-muted-foreground">{t('companies.noWantedListsDesc') || "This company hasn't posted any wanted lists yet."}</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {wantedLists.map((wanted: WantedListItem) => (
                              <WantedListingCard key={wanted.id} wanted={wanted} />
                            ))}
                          </div>

                          {wantedListsPagination && wantedListsPage < wantedListsPagination.last_page && (
                            <div className="flex justify-center mt-6">
                              <Button
                                variant="outline"
                                size="lg"
                                onClick={handleLoadMoreWantedLists}
                                disabled={wantedListsFetching || wantedListsLoading}
                                className="min-w-[200px]"
                              >
                                {wantedListsFetching || wantedListsLoading ? (
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
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

