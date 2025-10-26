export interface NewsCategory {
  id: number;
  name_en: string;
  name_mm: string;
}

export interface NewsCategoryResponse {
  success: boolean;
  message: string;
  data: NewsCategory[];
}

export interface NewsPostedUser {
  name: string;
}

export interface NewsImages {
  id: number;
  type: string;
  file_name: string;
  url: string;
}

export interface NewsItem {
  id: number;
  title_en: string;
  title_mm: string;
  slug: string;
  category: NewsCategory;
  short_description: string | null;
  view_count: number;
  like_count: number;
  posted_user: NewsPostedUser;
  reading_time: number;
  images: NewsImages | null;
  tag: string[];
}

export interface NewsPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: NewsItem[];
  pagination: NewsPagination;
}

export interface NewsFilters {
  search?: string;
  category?: number;
  per_page?: number;
  page?: number;
}

export interface NewsDetailImages {
  id: number;
  type: string;
  file_name: string;
  url: string;
}

export interface NewsDetail {
  id: number;
  title_en: string;
  title_mm: string;
  slug: string;
  short_description: string;
  main_content: string;
  tag: string[];
  view_count: number;
  like_count: number;
  posted_user: string;
  reading_time: number;
  images: NewsDetailImages | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface NewsDetailResponse {
  success: boolean;
  message: string;
  data: NewsDetail;
}
