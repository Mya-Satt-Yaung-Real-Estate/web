export interface HomeExploreCategory {
  id: number;
  title_en: string;
  title_mm: string;
  description_en: string | null;
  description_mm: string | null;
  link_path: string;
  icon_key: string | null;
  sort_order: number;
}

export interface HomeExploreCategoryListResponse {
  success: boolean;
  message: string;
  data: HomeExploreCategory[];
}
