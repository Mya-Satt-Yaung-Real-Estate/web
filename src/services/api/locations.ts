import { apiClient } from './client';

// Types for location data
export interface Region {
  id: number;
  name_mm: string;
  name_en: string;
  slug: string;
  is_active: boolean;
}

export interface Township {
  id: number;
  region_id: number;
  name_mm: string;
  name_en: string;
  slug: string;
  is_active: boolean;
  region: {
    id: number;
    name_mm: string;
    name_en: string;
    slug: string;
  };
}

export interface Ward {
  id: number;
  slug: string;
  township_id: number;
  ward_name_en: string;
  ward_name_mm: string;
}

export interface Road {
  id: number;
  slug: string;
  ward_id: number;
  name_en: string;
  name_mm: string;
  price: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

// API functions
export const locationApi = {
  // Get all regions
  getRegions: async (): Promise<ApiResponse<Region>> => {
    const response = await apiClient.get<ApiResponse<Region>>('/api/v1/locations/regions');
    return response.data;
  },

  // Get all townships
  getTownships: async (): Promise<ApiResponse<Township>> => {
    const response = await apiClient.get<ApiResponse<Township>>('/api/v1/locations/townships');
    return response.data;
  },

  // Get wards by township ID
  getWards: async (townshipId: number): Promise<ApiResponse<Ward>> => {
    const response = await apiClient.get<ApiResponse<Ward>>(`/api/v1/yarpyat/wards?township_id=${townshipId}`);
    return response.data;
  },

  // Get roads by ward ID
  getRoads: async (wardId: number): Promise<ApiResponse<Road>> => {
    const response = await apiClient.get<ApiResponse<Road>>(`/api/v1/yarpyat/roads?ward_id=${wardId}`);
    return response.data;
  },
};
