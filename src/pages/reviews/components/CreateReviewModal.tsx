/**
 * Create Review Modal Component
 * 
 * Modal for creating a new review.
 */

import { useEffect } from 'react';
import { Star, MapPin, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/forms';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useCreateReview } from '@/hooks/mutations/useReviewMutations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createReviewSchema } from '@/lib/validation/review';
import { useState } from 'react';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateReviewModal({ isOpen, onClose, onSuccess }: CreateReviewModalProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useModal();
  const [rating, setRating] = useState<number>(0);
  
  // Mutation hook
  const createReviewMutation = useCreateReview();
  
  // Form validation
  const { form, errors } = useFormValidation(createReviewSchema);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        property_name: '',
        property_location: '',
        rating: 0,
        review_subject: '',
        review_content: '',
      });
      setRating(0);
    }
  }, [isOpen, form]);
  
  const onSubmit = (data: any) => {
    // Prepare data for API
    const createData = {
      property_name: data.property_name,
      property_location: data.property_location,
      rating: rating || data.rating || 0,
      review_subject: data.review_subject,
      review_content: data.review_content,
    };

    createReviewMutation.mutate(createData, {
      onSuccess: () => {
        showSuccess(
          t('reviews.createSuccess') || 'Review created successfully!',
          t('reviews.createSuccessTitle') || 'Success!'
        );
        onClose();
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      },
      onError: (error: any) => {
        console.error('Create review failed:', error);
        const errorMessage = error?.response?.data?.message || error?.message || t('reviews.createError') || 'Failed to create review';
        showError(errorMessage, t('reviews.createErrorTitle') || 'Error');
      },
    });
  };

  const renderStars = (currentRating: number, onRatingChange: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => {
            onRatingChange(starValue);
            form.setValue('rating', starValue, { shouldValidate: true });
          }}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`h-6 w-6 ${
              starValue <= currentRating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('reviews.createReview') || 'Create Review'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Name */}
          <FormField
            name="property_name"
            label={t('reviews.propertyName') || 'Property Name'}
            error={errors.property_name}
            className="space-y-4"
          >
            <Input
              {...form.register('property_name')}
              placeholder={t('reviews.propertyNamePlaceholder') || 'Enter property name'}
            />
          </FormField>

          {/* Property Location */}
          <FormField
            name="property_location"
            label={t('reviews.propertyLocation') || 'Property Location'}
            error={errors.property_location}
            className="space-y-4"
          >
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register('property_location')}
                placeholder={t('reviews.propertyLocationPlaceholder') || 'Enter property location'}
                className="pl-10"
              />
            </div>
          </FormField>

          {/* Rating */}
          <FormField
            name="rating"
            label={t('reviews.rating') || 'Rating'}
            error={errors.rating}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              {renderStars(rating || form.watch('rating') || 0, (newRating) => {
                setRating(newRating);
                form.setValue('rating', newRating, { shouldValidate: true });
              })}
              {(rating || form.watch('rating')) > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating || form.watch('rating')} {(rating || form.watch('rating')) === 1 ? t('reviews.star') || 'star' : t('reviews.stars') || 'stars'}
                </span>
              )}
            </div>
          </FormField>

          {/* Review Subject */}
          <FormField
            name="review_subject"
            label={t('reviews.reviewSubject') || 'Review Subject'}
            error={errors.review_subject}
            className="space-y-4"
          >
            <Input
              {...form.register('review_subject')}
              placeholder={t('reviews.reviewSubjectPlaceholder') || 'Enter review subject'}
            />
          </FormField>

          {/* Review Content */}
          <FormField
            name="review_content"
            label={t('reviews.reviewContent') || 'Review Content'}
            error={errors.review_content}
            className="space-y-4"
          >
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                {...form.register('review_content')}
                placeholder={t('reviews.reviewContentPlaceholder') || 'Enter your review content'}
                className="pl-10 min-h-[120px]"
              />
            </div>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={createReviewMutation.isPending}>
              {t('reviews.cancel') || 'Cancel'}
            </Button>
            <Button type="submit" className="gradient-primary" disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending
                ? (t('reviews.creating') || 'Creating...')
                : (t('reviews.create') || 'Create Review')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

