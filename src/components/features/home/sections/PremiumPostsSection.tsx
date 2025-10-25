/**
 * Premium Posts Section
 * 
 * Lazy-loaded section for premium property posts.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PremiumPostCard } from '@/components/features/home/PremiumPostCard';
import { ArrowRight, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { memo } from 'react';

interface PremiumPost {
  id: string;
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  views: number;
  trending: boolean;
  likes: number;
  comments: number;
}

interface PremiumPostsSectionProps {
  premiumPosts: PremiumPost[];
}

export const PremiumPostsSection = memo(function PremiumPostsSection({ premiumPosts }: PremiumPostsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-background dark:from-amber-950/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2>{t('premium.title')}</h2>
              <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-white" />
                Premium
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {t('premium.subtitle')}
            </p>
          </div>
          <Link to="/search-all?type=premium">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
              {t('premium.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumPosts.map(post => (
            <PremiumPostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
});

