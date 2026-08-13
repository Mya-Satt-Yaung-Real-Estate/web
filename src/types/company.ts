/**
 * Company Type Definitions
 * 
 * Type definitions for company-related data structures.
 */

// ============================================================================
// COMPANY TYPES
// ============================================================================

export interface CompanyType {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface Region {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface Township {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface Company {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  member_level: 'basic' | 'bronze' | 'silver' | 'gold' | 'premium';
  email: string;
  company_type: CompanyType;
  verification_status: 'pending' | 'approved' | 'rejected';
  description: string;
  phone: string;
  region: Region;
  township: Township;
  business_address: string;
  property_count: number;
  advertisement_count?: number;
  activity_count?: number;
  view_count: number;
  contact_count: number;
  wanted_count?: number;
  company_profile: string;
  cover_image_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface CompaniesResponse {
  success: boolean;
  message: string;
  data: Company[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
  };
}

export interface CompanyTypeResponse {
  success: boolean;
  message: string;
  data: CompanyType[];
}

export interface CompanyDetailResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface CompanyLogoItem {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface CompanyLogoListResponse {
  success: boolean;
  message: string;
  data: CompanyLogoItem[];
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface CompanyFilters {
  search?: string;
  company_type_id?: number;
  per_page?: number;
  page?: number;
  member_level?: string;
  verification_status?: string;
  company_type?: string;
  region?: string;
  township?: string;
}
