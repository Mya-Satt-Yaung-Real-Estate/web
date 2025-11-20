/**
 * Review API Service
 * 
 * API calls for public reviews (no authentication required).
 */

import { api } from './client';
import type { ReviewsListResponse, ReviewFilters, CreateReviewRequest, CreateReviewResponse } from '@/types/reviews';

export const reviewApi = {
  /**
   * Get public reviews list
   */
  getPublicReviews: (filters?: ReviewFilters) => {
    return api.get<ReviewsListResponse>('/api/v1/frontend/public-reviews', {
      params: filters,
    });
  },

  /**
   * Create a new review
   */
  createReview: (data: CreateReviewRequest) => {
    return api.post<CreateReviewResponse>('/api/v1/frontend/reviews', data);
  },
};

