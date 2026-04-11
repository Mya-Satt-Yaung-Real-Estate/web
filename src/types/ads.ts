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
}

export interface SliderAdsResponse {
  success: boolean;
  message: string;
  data: SliderAd[];
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


