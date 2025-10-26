import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Clock, Eye, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useKnowledgeHubs, useKnowledgeCategories } from '../hooks/queries/useKnowledge';
import { useState, useMemo } from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Link } from 'react-router-dom';
import type { KnowledgeHubFilters } from '../types/knowledge';

export function KnowledgeHub() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  // API filters
  const filters: KnowledgeHubFilters = useMemo(() => ({
    search: searchTerm || undefined,
    category: selectedCategory,
    per_page: 20,
  }), [searchTerm, selectedCategory]);

  // Fetch knowledge hub data
  const { data: knowledgeData, isLoading: isLoadingKnowledge, error: knowledgeError } = useKnowledgeHubs(filters);
  const { data: categoriesData } = useKnowledgeCategories();

  // Extract articles from API response
  const articles = useMemo(() => {
    if (!knowledgeData?.data) return [];
    return knowledgeData.data.map(article => ({
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
  }, [knowledgeData]);

  // Extract categories from API response
  const categories = useMemo(() => {
    if (!categoriesData?.data) return [];
    return categoriesData.data.map(category => ({
      id: category.id,
      name_en: category.name_en,
      name_mm: category.name_mm,
    }));
  }, [categoriesData]);


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
              <Input
                placeholder={t('knowledge.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">{t('knowledge.categoryAll')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {language === 'mm' 
                      ? (category.name_mm || category.name_en) 
                      : (category.name_en || category.name_mm)
                    }
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Content */}
        <div className="space-y-6">
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
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
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
                        Read More →
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}