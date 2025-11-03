/**
 * Point Settings API
 * 
 * API operations for fetching point settings (upload fees, premium fees, etc.)
 */

import { api } from './client';

// ============================================================================
// TYPES
// ============================================================================

export interface PointSettingsInfo {
  days: number;
  point_amount: number;
}

export interface PremiumPropertyInfo {
  point_amount: number;
}

export interface PointSettings {
  renewal_info: PointSettingsInfo;
  upload_info: PointSettingsInfo;
  premium_property_info: PremiumPropertyInfo;
}

export interface PointSettingsResponse {
  success: boolean;
  message: string;
  data: PointSettings;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const pointSettingsApi = {
  /**
   * Get point settings (upload fees, premium fees, etc.)
   */
  getPointSettings: () => {
    return api.get<PointSettingsResponse>('/api/v1/point-settings');
  },
};




