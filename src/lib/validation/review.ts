/**
 * Review Validation Schema
 * 
 * Zod schema for review form validation.
 */

import { z } from 'zod';

export const createReviewSchema = (t: (key: string) => string) => z.object({
  property_name: z.string().min(1, t('reviews.validation.propertyNameRequired') || 'Property name is required'),
  property_location: z.string().min(1, t('reviews.validation.propertyLocationRequired') || 'Property location is required'),
  rating: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return 0;
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number()
      .min(1, t('reviews.validation.ratingRequired') || 'Rating is required')
      .max(5, t('reviews.validation.ratingMax') || 'Rating must be between 1 and 5')
  ),
  review_subject: z.string().min(1, t('reviews.validation.reviewSubjectRequired') || 'Review subject is required'),
  review_content: z.string().min(1, t('reviews.validation.reviewContentRequired') || 'Review content is required'),
});

