/**
 * Knowledge Hub Detail Page
 * 
 * Displays a single knowledge hub article with modern design.
 */

import { useParams, Link } from 'react-router-dom';
import { useKnowledgeHub } from '@/hooks/queries/useKnowledge';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Eye, 
  User, 
  Calendar,
  Tag,
  BookOpen,
  Share2
} from 'lucide-react';
import { ShareModal } from '@/components/ui/ShareModal';

export default function KnowledgeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  
  const { data: knowledgeData, isLoading, error } = useKnowledgeHub(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
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
    );
  }

  if (error || !knowledgeData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/knowledge-hub">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const article = knowledgeData.data;
  const title = language === 'mm' ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm);
  const description = article.short_description;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/knowledge-hub">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Hub
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {description}
          </p>
        </div>

          {/* Featured Image */}
          {article.images?.url && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={article.images.url}
                  alt={title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Image Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mt-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Posted by {article.posted_user}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Published {new Date(article.published_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.view_count} views</span>
                </div>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Article Content</span>
              </div>
              
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: article.main_content }}
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tag.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.view_count} views</span>
                </div>
              </div>
              <ShareModal
                title={title}
                url={window.location.href}
              >
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share this article
                </Button>
              </ShareModal>
            </div>
          </div>

      </div>
    </div>
  );
}
