/**
 * Knowledge Hub Types
 * 
 * TypeScript interfaces for knowledge hub API responses and data structures.
 */

export interface KnowledgeCategory {
  id: number;
  name_en: string | null;
  name_mm: string | null;
}

export interface KnowledgePostedUser {
  name: string;
}

export interface KnowledgeImages {
  id: number | null;
  type: string | null;
  file_name: string | null;
  url: string | null;
}

export interface KnowledgeHub {
  id: number;
  title_en: string;
  title_mm: string;
  slug: string;
  category: KnowledgeCategory;
  short_description: string;
  view_count: number;
  like_count: number;
  posted_user: KnowledgePostedUser;
  reading_time: number;
  images: KnowledgeImages;
  tag: string[];
}

export interface KnowledgeHubResponse {
  success: boolean;
  message: string;
  data: KnowledgeHub[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
  };
}

export interface KnowledgeHubFilters {
  search?: string;
  category?: number;
  tag?: string;
  per_page?: number;
  page?: number;
}
