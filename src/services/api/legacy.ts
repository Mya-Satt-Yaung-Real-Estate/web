/**
 * Legacy Team API Service
 * 
 * API operations for legacy team endpoints.
 */

import { apiClient } from './client';
import type { LegacyTeamResponse, LegacyTeamDetailResponse } from '@/types/legacy';

export const legacyApi = {
  /**
   * Get legacy team members
   */
  async getLegacyTeam(): Promise<LegacyTeamResponse> {
    const response = await apiClient.get<LegacyTeamResponse>('/api/v1/frontend/legacy-teams');
    return response.data;
  },

  /**
   * Get legacy team member by slug
   */
  async getLegacyTeamBySlug(slug: string): Promise<LegacyTeamDetailResponse> {
    const response = await apiClient.get<LegacyTeamDetailResponse>(`/api/v1/frontend/legacy-teams/${slug}`);
    return response.data;
  },
};
