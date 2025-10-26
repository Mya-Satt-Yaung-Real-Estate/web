import { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SEOHead } from '../components/seo/SEOHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { seoUtils } from '../lib/seo';
import { Building2, MapPin, Phone, Mail, Star, Eye, Home, Search, Globe } from 'lucide-react';
import { useCompanies } from '../hooks/queries/useCompanies';
import { useCompanyTypes } from '../hooks/queries/useCompanyTypes';
import type { Company, CompanyType } from '../types';

export function Companies() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // API data - fetch all companies at once for client-side filtering
  const { data: companiesResponse, isLoading, error } = useCompanies();
  const allCompanies: Company[] = companiesResponse?.data?.data || [];

  // API data - fetch company types for category filter
  const { data: companyTypesResponse } = useCompanyTypes();
  const companyTypes: CompanyType[] = companyTypesResponse?.data?.data || [];

  // Build categories from API data with language support
  const categories = useMemo(() => {
    return companyTypes.map(type => ({
      value: type.id.toString(),
      label: language === 'mm' ? type.name_mm : type.name_en,
    }));
  }, [companyTypes, language]);

  // Client-side filtering and search
  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company: Company) => {
      // Search filter with null checks
      const companyName = company.name || '';
      const companyDescription = company.description || '';
      const companyTypeName = company.company_type?.name_en || '';
      
      const matchesSearch = companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companyDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        companyTypeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Category filter - filter by company type ID
      const categoryId = parseInt(selectedCategory);
      if (!isNaN(categoryId)) {
        return company.company_type?.id === categoryId;
      }
      
      return true;
    });
  }, [allCompanies, searchQuery, selectedCategory]);

  // Client-side pagination
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // Reset to first page when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
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
                Showing {paginatedCompanies.length} of {filteredCompanies.length} companies
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
              </p>
              </div>
          )}

          {/* Companies Grid */}
          {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedCompanies.map((company: Company) => (
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
                            <CardTitle className="text-xl">{company.name}</CardTitle>
                          {company.verification_status === 'approved' && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
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
                            href={`${window.location.origin}/${company.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {`${window.location.origin}/${company.slug}`}
                          </a>
                        </div>
                      )}
                      </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 gradient-primary"
                        onClick={() => navigate('/modules', { state: { companyId: company.id, companyName: company.name } })}
                      >
                          {t('companies.viewProperties')}
                        </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.location.href = `mailto:${company.email}`}
                      >
                          {t('companies.contact')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && filteredCompanies.length === 0 && (
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