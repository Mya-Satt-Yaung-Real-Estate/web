/**
 * Property Types
 * 
 * TypeScript interfaces for property API responses and data structures.
 */

// ============================================================================
// NESTED TYPES
// ============================================================================

export interface PropertyType {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

export interface ListingType {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

export interface PropertyCondition {
  value: 'ready' | 'some' | 'no';
  label_en: string;
  label_mm: string;
}

export interface PropertyRegion {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface PropertyTownship {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface PropertyLocation {
  region: PropertyRegion;
  township: PropertyTownship;
  address: string;
  latitude: string;
  longitude: string;
  location_string: string;
  location_string_mm: string;
}

export interface PropertyContactInfo {
  owner_name: string;
  phone_numbers: string[];
  email?: string;
}

export interface PropertyStats {
  view_count: number;
  contact_count: number;
  favorite_count: number;
  like_count: number;
  comment_count: number;
}

export interface PropertyDates {
  published_at: string;
  expires_at: string | null;
  verified_at: string | null;
}

export interface PropertyMedia {
  id: number;
  type: string;
  filename: string;
  is_primary: boolean;
  status: string;
  url: string;
  small_url: string;
  medium_url: string;
  thumbnail_url: string;
}

// ============================================================================
// MAIN PROPERTY INTERFACE
// ============================================================================

export interface Property {
  id: number;
  user_id: number;
  property_type: PropertyType;
  listing_type: ListingType;
  title_en: string;
  title_mm: string;
  description: string;
  property_condition: PropertyCondition;
  location: PropertyLocation;
  price: string;
  formatted_price: string;
  area_sqft: string;
  length?: string;
  width?: string;
  bedrooms: number;
  bathrooms: number;
  bank_installment_available: boolean;
  features: string[];
  contact_info: PropertyContactInfo;
  status: string;
  is_featured: boolean;
  tan_tan_tan: boolean;
  is_trending: boolean;
  code: string;
  is_favorited: boolean;
  is_liked: boolean;
  stats: PropertyStats;
  dates: PropertyDates;
  verification_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  is_published: boolean;
  is_draft: boolean;
  is_sold: boolean;
  is_rented: boolean;
  is_expired: boolean;
  primary_image: PropertyMedia | null;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PropertyPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface PropertyResponse {
  success: boolean;
  message: string;
  data: Property;
}

export interface PropertyListResponse {
  success: boolean;
  message: string;
  data: Property[];
  pagination: PropertyPagination;
}

// ============================================================================
// FILTERS
// ============================================================================

export interface PropertyFilters {
  search?: string;
  status?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  region_id?: number;
  township_id?: number;
  property_type_id?: number;
  listing_type_id?: number;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface PropertyStatistics {
  total: number;
  by_type?: {
    [key: string]: number;
  };
  by_property_type?: Array<{
    property_type: string;
    count: number;
  }>;
  by_region?: Array<{
    region: string;
    count: number;
  }>;
}

export interface PropertyStatisticsResponse {
  success: boolean;
  message: string;
  data: PropertyStatistics;
  status?: number;
}

