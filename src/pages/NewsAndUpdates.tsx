import { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNewsAndUpdates, useNewsCategories } from '@/hooks/queries/useNews';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Clock, Eye, User, Search } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { NewsGridSkeleton } from '@/components/news/NewsCardSkeleton';
import type { NewsFilters } from '@/types/news';

// Helper function to decode Unicode escape sequences
const decodeUnicode = (str: string): string => {
  try {
    return str.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  } catch (error) {
    console.warn('Failed to decode Unicode string:', str);
    return str;
  }
};

export function NewsAndUpdates() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Maintain focus on search input during typing
  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      const input = searchInputRef.current;
      const cursorPosition = input.selectionStart;
      
      // Restore cursor position after re-render
      setTimeout(() => {
        if (input && document.activeElement !== input) {
          input.focus();
          if (cursorPosition !== null) {
            input.setSelectionRange(cursorPosition, cursorPosition);
          }
        }
      }, 0);
    }
  }, [isSearchFocused, searchTerm]);

  // API filters
  const filters: NewsFilters = useMemo(() => ({
    search: debouncedSearchTerm || undefined,
    category: selectedCategory,
    per_page: 9,
    page: currentPage,
  }), [debouncedSearchTerm, selectedCategory, currentPage]);

  // Fetch news data
  const { data: newsData, isLoading: isLoadingNews, error: newsError, isFetching } = useNewsAndUpdates(filters);
  const { data: categoriesData } = useNewsCategories();

  // Show loading when fetching new data due to filter changes
  // Only show loading if not currently typing in search
  const isFilterLoading = isFetching && !isLoadingNews && !isSearchFocused;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change - reset to page 1
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId ? Number(categoryId) : undefined);
    setCurrentPage(1);
  };

  // Handle search change - reset to page 1
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search blur
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(undefined);
    setCurrentPage(1);
  };

  // Extract news items from API response
  const newsItems = useMemo(() => {
    if (!newsData?.data) return [];
    return newsData.data.map(item => ({
      id: item.id,
      title_en: item.title_en,
      title_mm: item.title_mm,
      slug: item.slug,
      category_en: item.category.name_en,
      category_mm: item.category.name_mm ? decodeUnicode(item.category.name_mm) : item.category.name_en,
      category_id: item.category.id,
      readTime: `${item.reading_time} ${t('news.minRead')}`,
      thumbnail: item.images?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      description: item.short_description,
      view_count: item.view_count,
      like_count: item.like_count,
      posted_user: item.posted_user.name,
      tags: item.tag,
    }));
  }, [newsData, t]);

  // Extract categories from API response
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map(category => ({
      id: category.id,
      name_en: category.name_en,
      name_mm: category.name_mm ? decodeUnicode(category.name_mm) : category.name_en,
    }));
  }, [categoriesData]);

  if (isLoadingNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
              {t('news.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('news.subtitle')}
            </p>
          </div>

          {/* Search and Filters Skeleton */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="h-10 bg-muted rounded-md animate-pulse"></div>
              </div>
              <div className="sm:w-64">
                <div className="h-10 bg-muted rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* News Grid Skeleton */}
          <NewsGridSkeleton count={9} />
        </div>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{t('news.error')}</p>
            <Button onClick={() => window.location.reload()}>
              {t('forms.tryAgain')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <SEOHead 
        seo={{
          title: t('news.title'),
          description: t('news.subtitle'),
          keywords: 'news, updates, real estate, market analysis, policy',
          image: '/jade.png',
          type: 'website'
        }}
        path="/news-and-updates"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            {t('news.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('news.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={t('news.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10"
                  autoComplete="off"
                />
                {searchTerm !== debouncedSearchTerm && isSearchFocused && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">{t('news.categoryAll')}</option>
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

        {/* News Grid - Stable Container */}
        <div className="min-h-[600px] relative">
          {isFilterLoading ? (
            <div className="absolute inset-0">
              <NewsGridSkeleton count={9} />
            </div>
          ) : newsItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('news.noResults')}</h3>
            <p className="text-muted-foreground mb-4">{t('news.tryAgain')}</p>
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
            >
              {t('forms.clear')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={language === 'mm' ? (item.title_mm || item.title_en) : (item.title_en || item.title_mm)}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4 gradient-primary text-white">
                    {language === 'mm' 
                      ? (item.category_mm && item.category_mm !== item.category_en ? item.category_mm : item.category_en) 
                      : item.category_en
                    }
                  </Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {language === 'mm' 
                      ? (item.title_mm && item.title_mm !== item.title_en ? item.title_mm : item.title_en) 
                      : item.title_en
                    }
                  </CardTitle>
                  {item.description && (
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{item.view_count} {t('news.views')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{item.posted_user}</span>
                    </div>
                    <Link to={`/news-and-updates/${item.slug}`}>
                      <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                        {t('news.readMore')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>

        {/* Pagination */}
        {newsData?.pagination && newsData.pagination.last_page > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={newsData.pagination.current_page}
              totalPages={newsData.pagination.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsAndUpdates;
