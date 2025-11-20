/**
 * Point API Endpoints
 * 
 * Point-related API operations.
 */

import { api } from './client';
import type {
  PointPackagesResponse,
  PointFifoApiResponse,
  PointTransactionsResponse,
  PointPurchaseResponse,
} from '@/types/points';

// ============================================================================
// POINT API FUNCTIONS
// ============================================================================

export const pointApi = {
  /**
   * Get point packages, balance, and recent transactions (V1)
   */
  getPointPackages: () => {
    return api.get<PointPackagesResponse>('/api/v1/frontend/points/packages');
  },

  /**
   * Purchase point package (V1)
   */
  purchasePointPackage: (packageId: number) => {
    return api.post<PointPurchaseResponse>('/api/v1/frontend/points/purchase', {
      package_id: packageId,
    });
  },

  /**
   * Get point transactions (V1)
   */
  getPointTransactions: (params?: { per_page?: number; page?: number }) => {
    return api.get<PointTransactionsResponse>('/api/v1/frontend/point-transactions', {
      params,
    });
  },

  /**
   * Get FIFO point allocations (V2)
   */
  getPointFifo: () => {
    return api.get<PointFifoApiResponse>('/api/v2/frontend/points/fifo');
  },
};

