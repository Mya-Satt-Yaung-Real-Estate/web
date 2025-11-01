import { apiClient } from './client';

export interface ListingType {
  id: number;
  name_en: string;
  name_mm: string;
  full_name?: string;
  slug: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
}

export interface ListingTypeResponse {
  success: boolean;
  message: string;
  data: ListingType[];
}

export const listingTypeApi = {
  async getListingTypes(): Promise<ListingTypeResponse> {
    const response = await apiClient.get<ListingTypeResponse>('/api/v1/frontend/property-listing-types');
    return response.data;
  },
};




