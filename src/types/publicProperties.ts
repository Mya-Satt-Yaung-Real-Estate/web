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

  // Search and basic filters
  search?: string;
  property_type_id?: number;
  price_low_to_high?: boolean;

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


