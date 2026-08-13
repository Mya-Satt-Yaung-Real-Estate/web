import type { PropertyPagination } from './properties';

export type ActivityStatus = 'draft' | 'published';

export interface ActivityUser {
  id: number;
  name: string | null;
  user_type: string | null;
  member_level: string | null;
  company_id: number | null;
  company_name: string | null;
  company_slug: string | null;
  profile_image_url?: string | null;
}

export interface ActivityMediaImage {
  id: number;
  type?: string;
  filename: string;
  is_primary?: boolean;
  status?: string;
  url?: string;
  thumbnail_url?: string;
  small_url?: string;
  medium_url?: string;
}

export interface Activity {
  id: number;
  user_id: number;
  slug: string;
  title: string;
  description: string | null;
  status: ActivityStatus;
  show_on_homepage: boolean;
  published_at: string | null;
  user?: ActivityUser | null;
  primary_image?: ActivityMediaImage | null;
  media?: {
    images?: ActivityMediaImage[];
    primary_image?: ActivityMediaImage | null;
  };
  created_at: string;
  updated_at: string;
}

export interface ActivityOwnerFilters {
  search?: string;
  status?: ActivityStatus;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}

export interface ActivityCreateData {
  title: string;
  description: string;
  status?: ActivityStatus;
  media_ids: number[];
}

export type ActivityUpdateData = ActivityCreateData;

export interface ActivityListResponse {
  success: boolean;
  message: string;
  data: Activity[];
  pagination: PropertyPagination;
}

export interface ActivityDetailResponse {
  success: boolean;
  message: string;
  data: Activity;
}
