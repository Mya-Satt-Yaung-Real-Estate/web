export interface YoutubeVideo {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  youtube_link: string;
  view_count: number;
  created_at: string;
}

export interface YoutubeVideoListResponse {
  success: boolean;
  message: string;
  data: YoutubeVideo[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
  };
}

export interface YoutubeVideoDetailResponse {
  success: boolean;
  message: string;
  data: YoutubeVideo;
}

export interface YoutubeVideoFilters {
  page?: number;
  per_page?: number;
  search?: string;
}
