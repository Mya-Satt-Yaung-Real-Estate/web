import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEOHead } from '@/components/seo/SEOHead';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { seoUtils } from '@/lib/seo';
import { Building2, MapPin, Phone, Mail, Star, Eye, Home, Search, Globe } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { useCompanies } from '@/hooks/queries/useCompanies';
import { useCompanyTypes } from '@/hooks/queries/useCompanyTypes';
import type { Company, CompanyType } from '@/types';

export function Companies() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seo = seoUtils.getPageSEO('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Handle URL parameter for company type filtering
  useEffect(() => {
    const typeId = searchParams.get('typeId');
    if (typeId) {
      setSelectedCategory(typeId);
    } else {
      setSelectedCategory('all');
    }
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const companyFilters = useMemo(() => {
    const filters: {
      per_page: number;
      page: number;
      search?: string;
      company_type_id?: number;
    } = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    if (debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim();
    }

    if (selectedCategory !== 'all' && selectedCategory) {
      const categoryId = parseInt(selectedCategory, 10);
      if (!isNaN(categoryId)) {
        filters.company_type_id = categoryId;
      }
    }

    return filters;
  }, [currentPage, debouncedSearch, selectedCategory, itemsPerPage]);

  const { data: companiesResponse, isLoading, error } = useCompanies(companyFilters);
  const companies: Company[] = companiesResponse?.data?.data || [];
  const pagination = companiesResponse?.data?.pagination;
  const totalCompanies = pagination?.total ?? companies.length;
  const totalPages = pagination?.last_page ?? 1;

  // API data - fetch company types for category filter
  const { data: companyTypesResponse } = useCompanyTypes();
  const companyTypes: CompanyType[] = companyTypesResponse?.data?.data || [];

  // Build categories from API data with language support
  const categories = useMemo(() => {
    const allCategoriesOption = {
      value: 'all',
      label: language === 'mm' ? 'အမျိုးအစားအားလုံး' : 'All Companies',
    };
    
    const apiCategories = companyTypes.map(type => ({
      value: type.id.toString(),
      label: language === 'mm' ? type.name_mm : type.name_en,
    }));
    
    return [allCategoriesOption, ...apiCategories];
  }, [companyTypes, language]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <>
      <SEOHead seo={seo} path="/companies" />
      <div className="min-h-screen bg-gradient-mesh pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent text-center">
              {t('companies.title')}
            </h1>
            <p className="text-muted-foreground mt-2 text-center">
              {t('companies.subtitle')}
            </p>
          </div>

        {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('companies.search')}
                    value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder={language === 'mm' ? 'အမျိုးအစားရွေးချယ်ရန်' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading companies...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
              <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2">Error Loading Companies</h3>
              <p className="text-muted-foreground">Please try again later.</p>
            </div>
          )}

          {/* Results Count */}
          {!isLoading && !error && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {companies.length} of {totalCompanies} companies
                {debouncedSearch && ` for "${debouncedSearch}"`}
                {selectedCategory !== 'all' && selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
              </p>
              </div>
          )}

          {/* Companies Grid */}
          {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companies.map((company: Company) => (
                  <Card key={company.id} className="backdrop-blur-sm bg-background/95 hover:shadow-xl transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/20">
                          <ImageWithFallback
                          src={company.company_profile}
                            alt={company.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle 
                              className="text-xl cursor-pointer hover:text-primary transition-colors"
                              onClick={() => company.slug && navigate(`/companies/${company.slug}`)}
                            >
                              {company.name}
                            </CardTitle>
                          {company.verification_status === 'approved' && (
                              <Badge className="bg-primary text-white border-primary shadow-md font-semibold">
                                {t('companies.verified')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="capitalize">{company.member_level}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Home className="h-4 w-4" />
                            <span>{company.property_count} {t('companies.properties')}</span>
                            </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{company.view_count} views</span>
                          </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{company.description}</p>
                      
                    {/* Company Type and Location */}
                    <div className="flex flex-wrap gap-2">
                      {company.company_type && (
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {language === 'mm' ? company.company_type.name_mm : company.company_type.name_en}
                        </Badge>
                      )}
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

                    {/* Contact Info */}
                    <div className="space-y-2 pt-2">
                      {company.business_address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{company.business_address}</span>
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{company.phone}</span>
                        </div>
                      )}
                      {company.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{company.email}</span>
                        </div>
                      )}
                      {company.slug && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                          <a 
                            href={`${window.location.origin}/companies/${company.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {`${window.location.origin}/companies/${company.slug}`}
                          </a>
                        </div>
                      )}
                      </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => company.slug && navigate(`/companies/${company.slug}`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        className="flex-1 gradient-primary"
                        onClick={() => navigate(`/search?user_id=${company.user_id}`)}
                      >
                          {t('companies.viewProperties')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && totalCompanies === 0 && (
            <Card className="backdrop-blur-sm bg-background/95">
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">{t('companies.noResults')}</h3>
                <p className="text-muted-foreground">{t('companies.noResultsDesc')}</p>
              </CardContent>
            </Card>
          )}
          </div>
      </div>
    </>
  );
}

