/**
 * Map Properties Types
 * 
 * TypeScript interfaces for map properties API responses.
 */

// ============================================================================
// MAP PROPERTY INTERFACE
// ============================================================================

export interface MapPropertyType {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

export interface MapPropertyListingType {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
}

export interface MapProperty {
  id: number;
  slug: string;
  code: string;
  title_en: string;
  title_mm: string;
  price: string;
  price_lakh?: string | number;
  phone_numbers: string[];
  latitude: string;
  longitude: string;
  property_type_id: number;
  listing_type_id: number;
  property_type: MapPropertyType;
  listing_type: MapPropertyListingType;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface MapPropertiesResponse {
  success: boolean;
  message: string;
  data: MapProperty[];
}

