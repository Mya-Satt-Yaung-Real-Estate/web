/**
 * Statistics API Endpoints
 * 
 * Statistics-related API operations.
 */

import { api } from './client';
import type { StatisticsCountsResponse } from '@/types/statistics';

export const statisticsApi = {
  /**
   * Get counts for all statistics
   */
  getCounts: () => {
    return api.get<StatisticsCountsResponse>('/api/v1/frontend/statistics/counts');
  },
};

