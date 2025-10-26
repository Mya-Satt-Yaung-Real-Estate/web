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
  name: string;
  slug: string;
  member_level: 'bronze' | 'silver' | 'gold' | 'platinum';
  email: string;
  company_type: CompanyType;
  verification_status: 'pending' | 'approved' | 'rejected';
  description: string;
  phone: string;
  region: Region;
  township: Township;
  business_address: string;
  property_count: number;
  view_count: number;
  contact_count: number;
  company_profile: string;
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
}

export interface CompanyTypeResponse {
  success: boolean;
  message: string;
  data: CompanyType[];
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface CompanyFilters {
  search?: string;
  member_level?: string;
  verification_status?: string;
  company_type?: string;
  region?: string;
  township?: string;
}
