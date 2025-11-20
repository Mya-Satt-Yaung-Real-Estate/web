/**
 * Reviews Page
 * 
 * Main page for displaying public reviews.
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ReviewList, CreateReviewModal } from './components';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { usePublicReviews } from '@/hooks/queries/useReviews';

export default function Reviews() {
  const { t } = useLanguage();
  const seo = seoUtils.getPageSEO('reviews');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { refetch } = usePublicReviews();

  const handleCreateSuccess = () => {
    refetch();
  };

  return (
    <>
      <SEOHead seo={seo} path="/reviews" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent mb-2">
                {t('reviews.title') || 'Reviews'}
              </h1>
              <p className="text-muted-foreground">
                {t('reviews.subtitle') || 'Read what our users have to say about their property experiences'}
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('reviews.createReview') || 'Create Review'}
            </Button>
          </div>

          {/* Review List */}
          <ReviewList />

          {/* Create Review Modal */}
          <CreateReviewModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
      </div>
    </>
  );
}

