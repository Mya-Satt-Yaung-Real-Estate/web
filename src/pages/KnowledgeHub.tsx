import { useLanguage } from '../contexts/LanguageContext';
import { Clock, Eye, User, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useKnowledgeHubs, useKnowledgeCategories } from '../hooks/queries/useKnowledge';
import { useState, useMemo } from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/ui/pagination';

export function KnowledgeHub() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch ALL knowledge hub data once (no pagination, no search filters)
  const { data: allKnowledgeData, isLoading: isLoadingKnowledge, error: knowledgeError } = useKnowledgeHubs({});
  const { data: categoriesData } = useKnowledgeCategories();

  // Process all knowledge hub data and apply client-side filtering
  const allArticles = useMemo(() => {
    if (!allKnowledgeData?.data) return [];
    return allKnowledgeData.data.map(article => ({
      id: article.id,
      title_en: article.title_en,
      title_mm: article.title_mm,
      slug: article.slug,
      category_en: article.category.name_en,
      category_mm: article.category.name_mm,
      category_id: article.category.id,
      readTime: `${article.reading_time} min read`,
      thumbnail: article.images?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      description: article.short_description,
      view_count: article.view_count,
      like_count: article.like_count,
      posted_user: article.posted_user.name,
      tags: article.tag,
    }));
  }, [allKnowledgeData]);

  // Client-side filtering
  const filteredArticles = useMemo(() => {
    let filtered = allArticles;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title_en.toLowerCase().includes(searchLower) ||
        article.title_mm.toLowerCase().includes(searchLower) ||
        (article.description && article.description.toLowerCase().includes(searchLower)) ||
        (article.category_en && article.category_en.toLowerCase().includes(searchLower)) ||
        (article.category_mm && article.category_mm.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category_id === selectedCategory);
    }

    return filtered;
  }, [allArticles, searchTerm, selectedCategory]);

  // Client-side pagination
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage, itemsPerPage]);

  // Pagination info
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Extract categories from API response
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map(category => ({
      id: category.id,
      name_en: category.name_en,
      name_mm: category.name_mm,
    }));
  }, [categoriesData]);

  // Simple handlers - no complex state management needed
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId ? Number(categoryId) : undefined);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(undefined);
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent"> */}
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            {t('services.knowledgeHub')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('services.knowledgeHubDesc')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('knowledge.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">{t('knowledge.categoryAll')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'mm' 
                      ? (category.name_mm && category.name_mm !== category.name_en ? category.name_mm : category.name_en) 
                      : category.name_en
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Content */}
        <div className="min-h-[600px]">
          {isLoadingKnowledge ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass border-border/50 overflow-hidden">
                  <div className="h-48 bg-muted/20 animate-pulse" />
                  <CardHeader>
                    <div className="h-6 bg-muted/20 animate-pulse rounded" />
                    <div className="h-4 bg-muted/20 animate-pulse rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/20 animate-pulse rounded" />
                      <div className="h-4 bg-muted/20 animate-pulse rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : knowledgeError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Failed to load articles</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : paginatedArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article) => (
                  <Card key={article.id} className="glass border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={article.thumbnail}
                        alt={language === 'mm' 
                          ? (article.title_mm || article.title_en) 
                          : (article.title_en || article.title_mm)
                        }
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 right-4 gradient-primary text-white">
                        {language === 'mm' 
                          ? (article.category_mm || article.category_en) 
                          : (article.category_en || article.category_mm)
                        }
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className='text-lg'>
                        {language === 'mm' 
                          ? (article.title_mm || article.title_en) 
                          : (article.title_en || article.title_mm)
                        }
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{article.description}</p>
                      
                      {/* Author and Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.posted_user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.view_count}
                        </span>
                      </div>
                      
                      <Link 
                        to={`/knowledge-hub/${article.slug}`}
                        className="text-primary hover:text-primary/80 hover:underline transition-colors font-medium"
                      >
                        {t('knowledge.readMore')} →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}