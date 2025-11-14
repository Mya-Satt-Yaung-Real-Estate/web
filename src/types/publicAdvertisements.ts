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
  per_page?: number;
  page?: number;
}

