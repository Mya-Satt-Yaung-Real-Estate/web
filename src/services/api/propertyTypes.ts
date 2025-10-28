/**
 * Property Types API Service
 * 
 * API operations for property type endpoints.
 */

import { apiClient } from './client';

// Types for property type data
export interface PropertyType {
  id: number;
  name_mm: string;
  name_en: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

// API response types
export interface PropertyTypeResponse {
  success: boolean;
  message: string;
  data: PropertyType[];
}

export const propertyTypeApi = {
  /**
   * Get all active property types
   */
  async getPropertyTypes(): Promise<PropertyTypeResponse> {
    const response = await apiClient.get<PropertyTypeResponse>('/api/v1/property-types');
    return response.data;
  },
};

