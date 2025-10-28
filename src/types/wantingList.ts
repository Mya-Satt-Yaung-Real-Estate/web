/**
 * Wanting List Types
 * 
 * TypeScript interfaces for wanting list API responses and data structures.
 */

export interface WantingListPropertyType {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface WantingListRegion {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface WantingListTownship {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface WantingListLocation {
  region_en: string;
  township_en: string;
  region_mm: string;
  township_mm: string;
}

export interface WantingListBudget {
  min_budget: number;
  max_budget: number;
  budget_range: string;
}

export interface WantingListSpecifications {
  bedrooms?: number;
  bathrooms?: number;
  area_range?: string;
  min_area?: number;
  max_area?: number;
}

export interface WantingListContact {
  name: string;
  phone: string;
  email?: string;
}

export interface WantingListStatus {
  verification_status: 'pending' | 'approved' | 'rejected';
  status: string;
  is_expired: boolean;
  is_published: boolean;
  expires_at?: string;
}

export interface WantingListUser {
  id: number;
  name: string;
  profile_image_url?: string;
}

export interface WantingList {
  id: number;
  slug: string;
  wanted_type: 'buyer' | 'renter';
  wanted_type_label: string;
  title: string;
  description?: string;
  additional_requirement?: string;
  property_type: WantingListPropertyType;
  location: WantingListLocation;
  budget: WantingListBudget;
  specifications: WantingListSpecifications;
  contact: WantingListContact;
  status: WantingListStatus;
  user?: WantingListUser;
  created_at: string;
  updated_at: string;
}

export interface WantingListFilters {
  search?: string;
  wanted_type?: 'buyer' | 'renter';
  property_type_id?: number;
  prefer_region_id?: number;
  prefer_township_id?: number;
  verification_status?: 'pending' | 'approved' | 'rejected';
  min_budget?: number;
  max_budget?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface WantingListCreateData {
  wanted_type: 'buyer' | 'renter';
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
  expires_at?: string;
}

export interface WantingListUpdateData extends Partial<WantingListCreateData> {}

export interface WantingListResponse {
  success: boolean;
  message: string;
  data: WantingList;
  status: number;
}

export interface WantingListListResponse {
  success: boolean;
  message: string;
  data: WantingList[];
  pagination: {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  status: number;
}

export interface WantingListStatistics {
  total: number;
  by_type: {
    buyer: number;
    renter: number;
  };
  by_property_type: Array<{
    property_type: string;
    count: number;
  }>;
  by_region: Array<{
    region: string;
    count: number;
  }>;
}

export interface WantingListStatisticsResponse {
  success: boolean;
  message: string;
  data: WantingListStatistics;
  status: number;
}
