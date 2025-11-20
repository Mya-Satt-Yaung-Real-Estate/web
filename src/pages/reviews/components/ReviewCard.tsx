/**
 * Review Card Component
 * 
 * Displays a single review in a card format.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, User } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Review } from '@/types/reviews';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { language } = useLanguage();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'text-yellow-500 fill-yellow-500'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return language === 'mm' ? 'ယခုလေးတင်' : 'just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return language === 'mm' ? `${minutes} မိနစ်က` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return language === 'mm' ? `${hours} နာရီက` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return language === 'mm' ? `${days} ရက်က` : `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6 pt-8">
        {/* Header: User Info and Rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {review.user.profile_image_url ? (
                <ImageWithFallback
                  src={review.user.profile_image_url}
                  alt={review.user.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{review.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
        </div>

        {/* Property Info */}
        <div className="mb-4 pb-4 border-b">
          <h3 className="font-semibold text-base mb-1">{review.property_name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{review.property_location}</span>
          </div>
        </div>

        {/* Review Subject */}
        <h4 className="font-semibold text-sm mb-2">{review.review_subject}</h4>

        {/* Review Content */}
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {review.review_content}
        </p>
      </CardContent>
    </Card>
  );
}

