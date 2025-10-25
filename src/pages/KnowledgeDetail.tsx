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
  Clock, 
  Eye, 
  User, 
  Calendar,
  Tag,
  BookOpen,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { useState } from 'react';

export default function KnowledgeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const { data: knowledgeData, isLoading, error } = useKnowledgeHub(slug || '');

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: knowledgeData?.data?.title_en || 'Knowledge Hub Article',
          text: knowledgeData?.data?.short_description || '',
          url: url,
        });
      } catch (err) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
    setShowShareOptions(false);
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/knowledge-hub" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Hub
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
                  <Clock className="h-4 w-4" />
                  <span>{article.reading_time} min read</span>
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

          {/* Share Section - At Bottom of Content */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Share this article</h3>
                    <p className="text-sm text-gray-600">Help others discover this content</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {isCopied ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Copied!</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleShare}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Now
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Floating Share Button - Modern Design */}
          <div className="fixed bottom-8 right-8 z-[9999]">
            <div className="relative">
              {/* Share Options Dropdown */}
              {showShareOptions && (
                <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-[280px] z-[10000] animate-in slide-in-from-bottom-2">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-1">Share Article</h3>
                      <p className="text-sm text-gray-600">Choose how you'd like to share</p>
                    </div>
                    
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {isCopied ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">
                          {isCopied ? 'Link Copied!' : 'Copy Link'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {isCopied ? 'Paste anywhere to share' : 'Copy to clipboard'}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Main Share Button */}
              <Button
                onClick={handleShare}
                onMouseEnter={() => setShowShareOptions(true)}
                onMouseLeave={() => setShowShareOptions(false)}
                className="h-16 w-16 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white hover:scale-105 group"
                size="icon"
              >
                <div className="flex flex-col items-center gap-1">
                  {isCopied ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <Share2 className="h-6 w-6" />
                  )}
                  <span className="text-xs font-medium">
                    {isCopied ? 'Copied!' : 'Share'}
                  </span>
                </div>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
