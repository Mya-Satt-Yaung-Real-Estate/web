/**
 * Public Property Types
 * 
 * TypeScript interfaces for public property API responses and data structures.
 */

import type { PropertyType, ListingType, PropertyMedia, PropertyPagination } from './properties';

// ============================================================================
// PUBLIC PROPERTY INTERFACE
// ============================================================================

export interface PublicPropertyUser {
  id: number;
  name: string;
}

export interface PublicPropertyRegion {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

export interface PublicPropertyTownship {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

/**
 * Public Property - Simplified property structure from public API
 */
export interface PublicProperty {
  id: number;
  slug: string;
  property_type_id: number;
  listing_type_id: number;
  title_en: string;
  title_mm: string;
  description: string;
  price: string;
  price_lakh?: string | number;
  area_sqft: string;
  bedrooms: number;
  bathrooms: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  favorite_count: number;
  is_featured: boolean;
  tan_tan_tan: boolean;
  premium: boolean;
  bank_installment_available: boolean;
  code: string;
  is_favorited?: boolean;
  is_liked?: boolean;
  property_type: PropertyType;
  property_condition: 'ready' | 'some' | 'no';
  features: string[];
  listing_type: ListingType;
  region: PublicPropertyRegion;
  township: PublicPropertyTownship;
  user: PublicPropertyUser;
  primary_image: PropertyMedia | null;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface PublicPropertyListResponse {
  success: boolean;
  message: string;
  data: PublicProperty[];
  pagination: PropertyPagination;
}

// ============================================================================
// FILTERS
// ============================================================================

export interface PublicPropertyFilters {
  // Listing type filters
  listing_type_id?: number;
  tan_tan_tan?: boolean;
  premium?: boolean;
  installment?: boolean;

  // Search and basic filters
  search?: string;
  property_type_id?: number;
  price_low_to_high?: boolean;
  user_id?: number;

  // Advanced filters
  property_condition?: 'ready' | 'some' | 'no';
  region_id?: number;
  township_id?: number;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  amenities?: string[];

  // Pagination
  per_page?: number;
  page?: number;
}

// ============================================================================
// PROPERTY DETAIL TYPES
// ============================================================================

export interface PublicPropertyComment {
  id: number;
  profile_link: string | null;
  user_id: number;
  user_name: string;
  comment: string;
  is_me: boolean;
  created_at: string;
  replies: PublicPropertyCommentReply[];
  reply_count: number;
}

export interface PublicPropertyCommentReply {
  id: number;
  profile_link: string | null;
  user_id: number;
  user_name: string;
  comment: string;
  is_me: boolean;
  created_at: string;
  parent_comment_id: number;
}

export interface PublicPropertyLocation {
  region: {
    id: number;
    name_en: string;
    name_mm: string;
  };
  township: {
    id: number;
    name_en: string;
    name_mm: string;
  };
  address: string;
  latitude: string;
  longitude: string;
  location_string: string;
  location_string_mm: string;
}

export interface PublicPropertyContactInfo {
  owner_profile_image_url: string | null;
  owner_name: string;
  phone_numbers: string[];
  email: string;
  property_count: number;
  is_company?: boolean;
  company_name?: string | null;
  company_id?: number | null;
  company_slug?: string | null;
}

export interface PublicPropertyStats {
  view_count: number;
  contact_count: number;
  favorite_count: number;
  like_count: number;
  comment_count: number;
}

export interface PublicPropertyDates {
  published_at: string;
  created_at: string;
}

export interface PublicPropertyMedia {
  images: PropertyMedia[];
  primary_image: PropertyMedia | null;
}

export interface PublicPropertyCondition {
  value: 'ready' | 'some' | 'no';
  label_en: string;
  label_mm: string;
}

/**
 * Public Property Detail - Full property structure from detail API
 */
export interface PublicPropertyDetail {
  id: number;
  property_type: PropertyType;
  listing_type: ListingType;
  title_en: string;
  title_mm: string;
  description: string;
  property_condition: PublicPropertyCondition;
  location: PublicPropertyLocation;
  price: string;
  formatted_price: string;
  price_lakh?: string | number;
  area_sqft: string;
  length: string | null;
  width: string | null;
  bedrooms: number;
  bathrooms: number;
  bank_installment_available: boolean;
  features: string[];
  contact_info: PublicPropertyContactInfo;
  is_featured: boolean;
  tan_tan_tan: boolean;
  is_trending: boolean;
  premium?: boolean;
  code: string;
  status: string;
  is_favorited: boolean;
  is_liked: boolean;
  stats: PublicPropertyStats;
  dates: PublicPropertyDates;
  user: {
    id: number;
    name: string;
    user_type: string;
    member_level: string;
  };
  media: PublicPropertyMedia;
  comments: PublicPropertyComment[];
}

export interface PublicPropertyDetailResponse {
  success: boolean;
  message: string;
  data: PublicPropertyDetail;
}


