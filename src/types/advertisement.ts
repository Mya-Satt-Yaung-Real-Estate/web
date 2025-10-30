/**
 * Advertisement Types
 * 
 * TypeScript interfaces for advertisement API responses and data structures.
 */

export interface Advertisement {
  id: number;
  user_id: number;
  is_me: boolean;
  title_en: string;
  title_mm: string;
  description: string;
  location: {
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
  };
  contact_info: {
    contact_name: string;
    phone_numbers: string[];
    email: string;
  };
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  is_featured: boolean;
  is_favorite: boolean;
  stats: {
    view_count: number;
    contact_count: number;
    favorite_count: number;
  };
  dates: {
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
    verified_at: string | null;
    last_renewed_at: string | null;
  };
  verification_status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  is_published: boolean;
  is_draft: boolean;
  is_expired: boolean;
  is_rejected: boolean;
  days_until_expiry: number | null;
  is_expiring_soon: boolean;
  expires_in_text: string | null;
  renewal_info: {
    renewal_count: number;
  };
  media: {
    images: Array<{
      id: number;
      type: string;
      filename: string;
      is_primary: boolean;
      status: string;
      url: string;
    }>;
    primary_image: {
      id: number;
      type: string;
      filename: string;
      is_primary: boolean;
      status: string;
      url: string;
    } | null;
  };
}

export interface AdvertisementFilters {
  search?: string;
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  verification_status?: 'pending' | 'approved' | 'rejected';
  is_featured?: boolean;
  is_published?: boolean;
  is_draft?: boolean;
  is_expired?: boolean;
  is_rejected?: boolean;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface CreateAdvertisementData {
  title_en: string;
  title_mm: string;
  description: string;
  region_id: number;
  township_id: number;
  address: string;
  contact_name: string;
  phone_numbers: string[];
  email: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  media_ids: number[];
}

export interface AdvertisementListData {
  data: Advertisement[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AdvertisementResponse {
  data: Advertisement;
  message: string;
  success: boolean;
}

export interface AdvertisementListResponse {
  data: Advertisement[];
  message: string;
  success: boolean;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AdvertisementCreateData {
  title: string;
  description: string;
  content: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  budget: number;
  target_audience?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AdvertisementUpdateData {
  title?: string;
  description?: string;
  content?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface AdvertisementCategory {
  id: number;
  name: string;
  name_en: string;
  name_mm: string;
  description?: string;
  is_active: boolean;
}

export interface AdvertisementCategoryResponse {
  success: boolean;
  message: string;
  data: AdvertisementCategory[];
}
