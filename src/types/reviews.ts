/**
 * Review Types
 * 
 * TypeScript interfaces for review API responses and data structures.
 */

// ============================================================================
// REVIEW INTERFACE
// ============================================================================

export interface ReviewUser {
  id: number;
  name: string;
  slug: string;
  profile_image_url: string | null;
}

export interface Review {
  id: number;
  slug: string;
  property_name: string;
  property_location: string;
  rating: number;
  review_subject: string;
  review_content: string;
  created_at: string;
  user: ReviewUser;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ReviewPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface ReviewsListResponse {
  success: boolean;
  message: string;
  data: Review[];
  pagination: ReviewPagination;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface ReviewFilters {
  per_page?: number;
  page?: number;
}

// ============================================================================
// CREATE REVIEW TYPES
// ============================================================================

export interface CreateReviewRequest {
  property_name: string;
  property_location: string;
  rating: number;
  review_subject: string;
  review_content: string;
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: Review;
}

