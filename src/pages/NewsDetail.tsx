import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNewsDetail } from '@/hooks/queries/useNews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, User, Calendar, Share2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShareModal } from '@/components/ui/ShareModal';

export function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  
  const { data: newsData, isLoading, error } = useNewsDetail(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsData?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">News Not Found</h1>
            <p className="text-muted-foreground mb-6">The news article you're looking for doesn't exist.</p>
            <Link to="/news-and-updates">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const news = newsData.data;
  const title = language === 'mm' 
    ? (news.title_mm && news.title_mm !== news.title_en ? news.title_mm : news.title_en)
    : news.title_en;


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <SEOHead 
        seo={{
          title: title,
          description: news.short_description,
          keywords: news.tag.join(', '),
          image: news.images?.url || '/jade.png',
          type: 'article'
        }}
        path={`/news-and-updates/${slug}`}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/news-and-updates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <Card className="mb-8 overflow-hidden">
          {news.images && (
            <div className="relative h-64 md:h-80">
              <ImageWithFallback
                src={news.images.url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">
              {title}
            </CardTitle>
            
            {news.short_description && (
              <p className="text-muted-foreground text-lg mt-4">
                {news.short_description}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{news.posted_user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(news.published_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{news.view_count} {t('news.views')}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: news.main_content }}
            />
            
            {/* Tags */}
            {news.tag && news.tag.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {news.tag.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{news.view_count} views</span>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NewsDetail;
