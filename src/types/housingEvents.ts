/**
 * Housing Events Types
 * 
 * TypeScript interfaces for housing events API responses.
 */

import type { PropertyPagination } from './properties';

export interface HousingEventRegion {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface HousingEventTownship {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface HousingEventCategory {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface HousingEventImage {
  id: number;
  type: string;
  file_name: string;
  url: string;
}

export interface HousingEvent {
  id: number;
  slug: string;
  name_en: string;
  name_mm: string;
  tag: string[];
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  location: string;
  region: HousingEventRegion;
  township: HousingEventTownship;
  is_free: boolean;
  price: string;
  need_registration: boolean;
  registered_user_count: number;
  accepted_user_count: number;
  category: HousingEventCategory;
  images: HousingEventImage | null;
}

export interface HousingEventListResponse {
  success: boolean;
  message: string;
  data: HousingEvent[];
  pagination: PropertyPagination;
}

export interface HousingEventFilters {
  per_page?: number;
  page?: number;
}

