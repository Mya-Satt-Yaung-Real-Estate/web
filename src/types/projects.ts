import type { PropertyMedia, PropertyRegion, PropertyTownship, PropertyType } from './properties';

export type ProjectCondition = 'under_construction' | 'ongoing' | 'upcoming';
export type ProjectPublishStatus = 'draft' | 'published' | 'unpublished';
export type ProjectCurrency = 'MMK' | 'USD' | 'THB' | 'CNY';

export interface ProjectDeveloper {
  id: number;
  name: string;
  user_type: string;
  member_level: string;
  profile_image_url: string | null;
}

export interface ProjectLocation {
  region: PropertyRegion | null;
  township: PropertyTownship | null;
  address: string | null;
}

export interface ProjectPrice {
  min: string | number | null;
  max: string | number | null;
  currency: ProjectCurrency;
  range: string | null;
}

export interface ProjectUnitType {
  id?: number;
  name: string;
  area?: string | null;
  price_range?: string | null;
  description?: string | null;
  units?: string | null;
}

export interface ProjectPaymentPlan {
  id?: number;
  name: string;
  description?: string | null;
}

export interface ProjectContactInfo {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface Project {
  id: number;
  user_id?: number;
  slug: string;
  title_en: string;
  title_mm?: string | null;
  developer: ProjectDeveloper | null;
  property_type: PropertyType | null;
  location: ProjectLocation;
  total_units?: string | null;
  completion_text?: string | null;
  condition: ProjectCondition;
  publish_status: ProjectPublishStatus;
  price: ProjectPrice;
  description_en?: string | null;
  description_mm?: string | null;
  features?: string[] | null;
  unit_types?: ProjectUnitType[];
  payment_plans?: ProjectPaymentPlan[];
  contact_info?: ProjectContactInfo;
  is_featured: boolean;
  show_on_homepage: boolean;
  view_count: number;
  primary_image?: PropertyMedia | null;
  media?: {
    images: PropertyMedia[];
    primary_image: PropertyMedia | null;
  };
  dates?: {
    created_at?: string;
    updated_at?: string;
  };
}

export interface ProjectPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface ProjectListResponse {
  success: boolean;
  message: string;
  data: Project[];
  pagination: ProjectPagination;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface ProjectFilters {
  search?: string;
  user_id?: number;
  property_type_id?: number;
  region_id?: number;
  township_id?: number;
  condition?: ProjectCondition;
  publish_status?: ProjectPublishStatus;
  is_featured?: boolean;
  show_on_homepage?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_min' | 'price_max' | 'created_at' | 'updated_at' | 'view_count';
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ProjectFormPayload {
  title_en: string;
  title_mm?: string;
  property_type_id?: number;
  region_id?: number;
  township_id?: number;
  address?: string;
  total_units?: string;
  completion_text?: string;
  condition: ProjectCondition;
  publish_status: ProjectPublishStatus;
  price_min?: number;
  price_max?: number;
  currency: ProjectCurrency;
  description_en?: string;
  description_mm?: string;
  features?: string[];
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  is_featured?: boolean;
  show_on_homepage?: boolean;
  media_ids?: number[];
  unit_types?: ProjectUnitType[];
  payment_plans?: ProjectPaymentPlan[];
}
