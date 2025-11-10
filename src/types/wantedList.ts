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

