/**
 * Public Advertisement Types
 * 
 * TypeScript interfaces for public advertisement API responses.
 */

import type { PropertyPagination } from './properties';

export interface PublicAdvertisementLocation {
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
}

export interface PublicAdvertisementPrimaryImage {
  id: number;
  url: string;
  thumbnail_url: string | null;
}

export interface PublicAdvertisementStats {
  view_count: number;
  favorite_count: number;
}

export interface PublicAdvertisement {
  id: number;
  slug: string | null;
  is_me: boolean;
  title_en: string;
  title_mm: string;
  description: string;
  advertisement_type?: 'for_rent' | 'for_sale';
  location: PublicAdvertisementLocation;
  primary_image: PublicAdvertisementPrimaryImage | null;
  stats: PublicAdvertisementStats;
  is_featured: boolean;
  is_favorite: boolean;
  status: string;
  published_at: string;
  created_at: string;
  expires_at: string;
  days_until_expiry: number;
  expires_in_text: string;
}

export interface PublicAdvertisementListResponse {
  success: boolean;
  message: string;
  data: PublicAdvertisement[];
  pagination: PropertyPagination;
}

export interface PublicAdvertisementFilters {
  search?: string;
  advertisement_type?: 'for_rent' | 'for_sale';
  region_id?: number;
  township_id?: number;
  per_page?: number;
  page?: number;
}

// Detail page types
export interface PublicAdvertisementDetailLocation {
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
}

export interface PublicAdvertisementDetailContactInfo {
  contact_name: string;
  phone_numbers: string[];
  email: string;
}

export interface PublicAdvertisementDetailStats {
  view_count: number;
  contact_count: number;
  favorite_count: number;
}

export interface PublicAdvertisementDetailDates {
  published_at: string;
  created_at: string;
  expires_at: string;
}

export interface PublicAdvertisementDetailUser {
  id: number;
  name: string;
  user_type: string;
  member_level: string;
}

export interface PublicAdvertisementDetailMediaImage {
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

export interface PublicAdvertisementDetailMedia {
  images: PublicAdvertisementDetailMediaImage[];
  primary_image: PublicAdvertisementDetailMediaImage | null;
}

export interface PublicAdvertisementDetail {
  id: number;
  title_en: string;
  title_mm: string;
  description: string;
  advertisement_type?: 'for_rent' | 'for_sale';
  location: PublicAdvertisementDetailLocation;
  contact_info: PublicAdvertisementDetailContactInfo;
  is_featured: boolean;
  is_favorited: boolean;
  stats: PublicAdvertisementDetailStats;
  dates: PublicAdvertisementDetailDates;
  user: PublicAdvertisementDetailUser;
  age_in_days: number;
  days_until_expiry: number;
  is_expiring_soon: boolean;
  expires_in_text: string;
  media: PublicAdvertisementDetailMedia;
}

export interface PublicAdvertisementDetailResponse {
  success: boolean;
  message: string;
  data: PublicAdvertisementDetail;
}

