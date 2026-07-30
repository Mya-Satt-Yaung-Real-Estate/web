/**
 * Share Profit Listing types (Website public API V2).
 */

import type { PropertyPagination } from './properties';

export type ShareProfitWantedType = 'buyer' | 'renter' | 'seller' | 'share_profit';

export interface ShareProfitPropertyType {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface ShareProfitPreferredLocation {
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

export interface ShareProfitBudget {
  min_budget: string;
  max_budget: string;
  budget_range: string;
}

export interface ShareProfitSpecifications {
  bedrooms: number;
  bathrooms: number;
  min_area?: string | null;
  max_area?: string | null;
  area_range: string;
}

export interface ShareProfitContact {
  name: string;
  phone: string;
  email: string;
}

export interface ShareProfitStatus {
  verification_status: 'pending' | 'approved' | 'rejected';
  status: 'published' | 'draft';
  is_expired: boolean;
  is_published: boolean;
  is_active?: boolean;
  expires_at: string | null;
  owner_information_lock?: boolean;
}

export interface ShareProfitMediaImage {
  id: number;
  type: string;
  filename: string;
  is_primary: boolean;
  status: string;
  url?: string;
  thumbnail_url?: string;
  small_url?: string;
  medium_url?: string;
}

export interface ShareProfitMedia {
  images: ShareProfitMediaImage[];
  primary_image?: ShareProfitMediaImage | null;
}

export interface ShareProfitListing {
  id: number;
  slug: string;
  wanted_type: ShareProfitWantedType;
  wanted_type_label: string;
  title: string;
  description: string | null;
  property_type: ShareProfitPropertyType;
  preferred_location: ShareProfitPreferredLocation;
  budget: ShareProfitBudget;
  specifications: ShareProfitSpecifications;
  contact: ShareProfitContact;
  status: ShareProfitStatus;
  media?: ShareProfitMedia;
  created_at: string;
}

export interface ShareProfitListingDetailUser {
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

export interface ShareProfitListingDetail extends ShareProfitListing {
  additional_requirement?: string;
  user: ShareProfitListingDetailUser | null;
}

export interface ShareProfitListResponse {
  success: boolean;
  message: string;
  data: ShareProfitListing[];
  pagination: PropertyPagination;
}

export interface ShareProfitDetailResponse {
  success: boolean;
  message: string;
  data: ShareProfitListingDetail;
}

export interface ShareProfitStatistics {
  total: number;
  by_type: {
    buyer: number;
    renter: number;
    seller: number;
    share_profit: number;
  };
}

export interface ShareProfitStatisticsResponse {
  success: boolean;
  message: string;
  data: ShareProfitStatistics;
}

export interface ShareProfitOwnerFilters {
  search?: string;
  wanted_type?: ShareProfitWantedType;
  verification_status?: 'pending' | 'approved' | 'rejected';
  property_type_id?: number;
  prefer_region_id?: number;
  prefer_township_id?: number;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface ShareProfitCreateData {
  wanted_type: ShareProfitWantedType;
  property_type_id: number;
  title: string;
  prefer_region_id: number;
  prefer_township_id: number;
  name: string;
  phone: string;
  description?: string;
  min_budget?: number;
  max_budget?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  additional_requirement?: string;
  email?: string;
  status?: 'draft' | 'published';
  media_ids: number[];
}

export type ShareProfitUpdateData = ShareProfitCreateData;
