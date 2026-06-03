/**
 * Wanted List Types
 * 
 * TypeScript interfaces for public wanted list API responses.
 */

import type { PropertyPagination } from './properties';

export interface WantedListPropertyType {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface WantedListLocation {
  region_en: string;
  township_en: string;
  region_mm: string;
  township_mm: string;
}

export interface WantedListBudget {
  min_budget: string;
  max_budget: string;
  budget_range: string;
}

export interface WantedListSpecifications {
  bedrooms: number;
  bathrooms: number;
  area_range: string;
}

export interface WantedListContact {
  name: string;
  phone: string;
  email: string;
}

export interface WantedListStatus {
  verification_status: 'pending' | 'approved' | 'rejected';
  status: 'published' | 'draft';
  is_expired: boolean;
  is_published: boolean;
  expires_at: string | null;
}

export interface WantedList {
  id: number;
  slug: string;
  wanted_type: 'buyer' | 'renter';
  wanted_type_label: string;
  title: string;
  description: string;
  property_type: WantedListPropertyType;
  location: WantedListLocation;
  budget: WantedListBudget;
  specifications: WantedListSpecifications;
  contact: WantedListContact;
  status: WantedListStatus;
  created_at: string;
}

export interface WantedListResponse {
  success: boolean;
  message: string;
  data: WantedList[];
  pagination: PropertyPagination;
}

// Detail page types
export interface WantedListDetailPreferredLocation {
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
}

export interface WantedListDetailBudget {
  min_budget: string;
  max_budget: string;
  budget_range: string;
}

export interface WantedListDetailSpecifications {
  bedrooms: number;
  bathrooms: number;
  min_area: string;
  max_area: string;
  area_range: string;
}

export interface WantedListDetailContact {
  name: string;
  email: string;
  phone: string;
}

export interface WantedListDetailStatus {
  verification_status: 'pending' | 'approved' | 'rejected';
  status: 'published' | 'draft';
  is_expired: boolean;
  is_published: boolean;
  expires_at: string | null;
  /** When true, contact and user are hidden until unlocked with points (public API). */
  owner_information_lock?: boolean;
}

export interface WantedListDetailUser {
  id: number;
  name: string | null;
  email: string | null;
  user_type: string | null;
  member_level: string | null;
  is_company: boolean;
  company_name: string | null;
  company_id: number | null;
  company_slug: string | null;
}

export interface WantedListDetail {
  id: number;
  slug: string;
  wanted_type: 'buyer' | 'renter';
  wanted_type_label: string;
  title: string;
  description: string;
  additional_requirement?: string;
  property_type: WantedListPropertyType;
  preferred_location: WantedListDetailPreferredLocation;
  budget: WantedListDetailBudget;
  specifications: WantedListDetailSpecifications;
  contact: WantedListDetailContact | null;
  status: WantedListDetailStatus;
  user: WantedListDetailUser | null;
  created_at: string;
}

export interface WantedListDetailResponse {
  success: boolean;
  message: string;
  data: WantedListDetail;
}

