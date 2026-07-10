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

export interface ProjectPointInfo {
  point_amount: number;
}

/** Cost to reveal contact / poster on a public wanted listing */
export interface UnlockWantedInfo {
  point_amount: number;
}

export interface AuthorizeMemberLevel {
  premium_feature: string[];
}

export interface PointSettings {
  renewal_info: PointSettingsInfo;
  upload_info: PointSettingsInfo;
  premium_property_info: PremiumPropertyInfo;
  upload_project_info?: ProjectPointInfo;
  update_project_info?: ProjectPointInfo;
  payment_integration_status?: boolean;
  unlock_wanted_info?: UnlockWantedInfo;
  authorize_member_level?: AuthorizeMemberLevel;
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




