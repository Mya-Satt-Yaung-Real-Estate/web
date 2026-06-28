/**
 * Ads Types
 * 
 * TypeScript interfaces for ads API responses.
 */

export interface SliderAdImage {
  id: number;
  type: string;
  file_name: string;
  url: string;
}

export interface SliderAd {
  id: number;
  title_en: string | null;
  title_mm: string | null;
  description_en: string | null;
  description_mm: string | null;
  link: string | null;
  link_type: string;
  link_text: string | null;
  text_color_code: string | null;
  images: SliderAdImage;
  user?: {
    id: number;
    slug: string | null;
    name: string | null;
    company: {
      id: number;
      slug: string;
      name: string;
    } | null;
  } | null;
}

export interface SliderAdsResponse {
  success: boolean;
  message: string;
  data: SliderAd[];
}

/** GET /api/v1/frontend/ads/detail-page — two sidebar strips */
export interface DetailPageSidebarsAdsData {
  sidebar_1: SliderAd[];
  sidebar_2: SliderAd[];
}

export interface DetailPageSidebarsAdsResponse {
  success: boolean;
  message: string;
  data: DetailPageSidebarsAdsData;
}

/** Grouped slides for home horizontal block (keys "1" = left, "2" = right). */
export type HomeBlockAdsData = {
  '1': SliderAd[];
  '2': SliderAd[];
};

export interface HomeBlockAdsResponse {
  success: boolean;
  message: string;
  data: HomeBlockAdsData;
}

/** Grouped slides for home 2×2 grid (keys "1".."4"). */
export type HomeGridAdsData = {
  '1': SliderAd[];
  '2': SliderAd[];
  '3': SliderAd[];
  '4': SliderAd[];
};

export interface HomeGridAdsResponse {
  success: boolean;
  message: string;
  data: HomeGridAdsData;
}


